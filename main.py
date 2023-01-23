import os, aiohttp, json, db
from fastapi import FastAPI, APIRouter, Request, Header, HTTPException, status, Form
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from oauthlib.oauth2 import WebApplicationClient
from typing import Optional
from user import User, load_all_roles, load_all_users_by_role
from student import StudentData, StudentResponse, Student
from program import ProgramData, ProgramResponse, Program
from program import LevelData, LevelResponse, Level
from camp import Camp, load_camps_table
from datetime import date


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/images", StaticFiles(directory="images"), name="images")
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)
app.user = None
app.db_path = os.environ.get("DB_PATH") or os.path.join(os.path.dirname(__file__), 'app.db')
app.db = None
app.db = db.get_db(app)
app.roles = load_all_roles(db = app.db)
app.instructors = {}
app.promoted_programs = {}
app.camps = {}

templates = Jinja2Templates(directory="templates")
api_router = APIRouter()

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
google_client = WebApplicationClient(GOOGLE_CLIENT_ID)


async def get_google_provider_cfg() -> dict:
    ret_json = {}
    async with aiohttp.ClientSession() as session:
        async with session.get(GOOGLE_DISCOVERY_URL) as response:
            ret_json = await response.json()
    return ret_json


def check_basic_auth(permission_url_path):
    if not app.user:
        return RedirectResponse(url='/')
    for role_name in app.user.roles:
        role = app.roles[role_name]
        if permission_url_path in role.permissible_endpoints:
            return None
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for {permission_url_path}")


def build_base_html_args(request: Request) -> dict:
    template_args = {"request": request}
    if app.user is None:
        template_args['user_id'] = None
        template_args['user_name'] = None
        template_args['roles'] = None
    else:
        template_args['user_id'] = app.user.id
        template_args['user_name'] = app.user.full_name
        current_roles = []
        for role_name in app.user.roles:
            current_roles.append(app.roles[role_name])
        template_args['roles'] = current_roles
    return template_args


@api_router.get("/")
async def homepage_get(request: Request):
    template_args = build_base_html_args(request)
    return templates.TemplateResponse("index.html", template_args)


@api_router.get("/signin")
async def signin_get(request: Request):
    google_provider_cfg = await get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    redirect_uri = 'https://' + request.url.netloc + request.url.path + '/callback'
    request_uri = google_client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=redirect_uri,
        scope=["openid", "email", "profile"],
    )
    return RedirectResponse(url=request_uri)


@api_router.get("/signin/callback")
async def signin_callback_get(request: Request, code):
    google_provider_cfg = await get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    redirect_url = 'https://' + request.url.netloc + request.url.path
    token_url, headers, body = google_client.prepare_token_request(
        token_endpoint,
        authorization_response=f'{request.url}',
        redirect_url=redirect_url,
        code=code,
        client_secret=GOOGLE_CLIENT_SECRET
    )
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.post(token_url, data=body) as response:
            token_response_json = await response.json()
    google_client.parse_request_body_response(json.dumps(token_response_json))
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = google_client.add_token(userinfo_endpoint)
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(uri, data=body) as response:
            user_info_json = await response.json()
    if user_info_json.get("email_verified"):
        app.user = User(
            db = app.db,
            google_id = user_info_json["sub"],
            given_name = user_info_json["given_name"],
            family_name = user_info_json["family_name"],
            full_name = user_info_json["name"],
            picture = user_info_json["picture"]
        )
        app.user.add_email_address(db = app.db, email_address = user_info_json["email"])
    else:
        return "User email not available or not verified by Google.", 400
    return RedirectResponse(url='/')


@api_router.get("/signout")
async def signout_get(request: Request):
    app.user = None
    return RedirectResponse(url='/')


@app.on_event("shutdown")
async def shutdown() -> None:
    db.close_db(app)
    if os.environ.get("DEV_MODE") and os.path.isfile(app.db_path):
        os.remove(app.db_path)


@api_router.get("/profile")
async def profile_get(request: Request):
    auth_check = check_basic_auth('/profile')
    if auth_check is not None:
        return auth_check
    template_args = build_base_html_args(request)
    return templates.TemplateResponse("profile.html", template_args)


@api_router.get("/instructor/{user_id}")
async def instructor_get_one(request: Request, user_id: int):
    auth_check = check_basic_auth('/instructor')
    if auth_check is not None:
        return auth_check
    template_args = build_base_html_args(request)
    return templates.TemplateResponse("instructor.html", template_args)



###############################################################################
# STUDENTS
###############################################################################


@api_router.get("/students")
async def get_students(request: Request, accept: Optional[str] = Header(None)):
    auth_check = check_basic_auth('/students')
    if "text/html" in accept:
        if auth_check is not None:
            return auth_check
        template_args = build_base_html_args(request)
        return templates.TemplateResponse("students.html", template_args)
    else:
        if auth_check is not None:
            return []
        student_list = []
        for student_id in app.user.student_ids:
            student = Student(db = app.db, id = student_id)
            student_list.append(student.dict(include=StudentResponse().dict()))
        return student_list


@api_router.get("/students/{student_id}", response_model=StudentResponse)
async def get_student(student_id: int):
    if check_basic_auth('/students') is not None:
        return StudentResponse()
    if student_id not in app.user.student_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for student id={student_id}")
    student = Student(db = app.db, id = student_id)
    return student


@api_router.put("/students/{student_id}", response_model = StudentResponse)
async def put_update_student(student_id: int, updated_student: StudentData):
    if check_basic_auth('/students') is not None:
        return StudentResponse()
    if student_id not in app.user.student_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for student id={student_id}")
    student = Student(db = app.db, id = student_id).copy(update=updated_student.dict(exclude_unset=True))
    await student.update_basic(app.db)
    return student


@api_router.post("/students", response_model = StudentResponse, status_code = status.HTTP_201_CREATED)
async def post_new_student(new_student_data: StudentData):
    if check_basic_auth('/students') is not None:
        return StudentResponse()
    # TODO: there's got to be a slicker way to do this
    new_student = Student(
        db = app.db,
        id = None,
        name = new_student_data.name,
        birthdate = new_student_data.birthdate,
        grade_level = new_student_data.grade_level
    )
    if new_student.id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post new student failed")
    app.user.add_student(db = app.db, student_id = new_student.id)
    return new_student


@api_router.delete("/students/{student_id}")
async def delete_student(student_id: int):
    if check_basic_auth('/students') is not None:
        return None
    if student_id not in app.user.student_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for student id={student_id}")
    app.user.remove_student(db = app.db, student_id = student_id)



###############################################################################
# PROGRAMS/TEACH
###############################################################################


@api_router.get("/teach")
async def get_teach_page(request: Request):
    auth_check = check_basic_auth('/teach')
    if auth_check is not None:
        return auth_check
    template_args = build_base_html_args(request)
    return templates.TemplateResponse("teach.html", template_args)


@api_router.get("/programs")
async def get_programs(request: Request, accept: Optional[str] = Header(None)):
    auth_check = check_basic_auth('/programs')
    if "text/html" in accept:
        if auth_check is not None:
            return auth_check
        template_args = build_base_html_args(request)
        return templates.TemplateResponse("programs.html", template_args)
    else:
        if auth_check is not None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
        program_list = []
        for program_id in app.user.program_ids:
            program = Program(db = app.db, id = program_id)
            program_list.append(program.dict(include=ProgramResponse().dict()))
        return program_list


@api_router.get("/programs/{program_id}", response_model = ProgramResponse)
async def get_program(request: Request, program_id: int, accept: Optional[str] = Header(None)):
    auth_check = check_basic_auth('/programs')
    if "text/html" in accept:
        if auth_check is not None:
            return auth_check
        template_args = build_base_html_args(request)
        return templates.TemplateResponse("program.html", template_args)
    else:
        if auth_check is not None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
        if program_id not in app.user.program_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")
        return Program(db = app.db, id = program_id)


@api_router.put("/programs/{program_id}", response_model = ProgramResponse)
async def put_update_program(program_id: int, updated_program: ProgramData):
    if check_basic_auth('/programs') is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
    if program_id not in app.user.program_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")
    program = Program(db = app.db, id = program_id).copy(update=updated_program.dict(exclude_unset=True))
    await program.update_basic(app.db)
    return program


@api_router.post("/programs", response_model = ProgramResponse, status_code = status.HTTP_201_CREATED)
async def post_new_program(new_program_data: ProgramData):
    if check_basic_auth('/programs') is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
    # TODO: there's got to be a slicker way to do this
    new_program = Program(
        db = app.db,
        id = None,
        title = new_program_data.title,
        grade_range = new_program_data.grade_range,
        tags = new_program_data.tags,
        description = new_program_data.description
    )
    if new_program.id is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post new program failed")
    app.user.add_program(db = app.db, program_id = new_program.id)
    return new_program


@api_router.delete("/programs/{program_id}")
async def delete_program(program_id: int):
    if check_basic_auth('/programs') is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
    if program_id not in app.user.program_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")
    app.user.remove_program(db = app.db, program_id = program_id)


@api_router.get("/programs/{program_id}/levels")
async def get_levels(program_id: int):
    auth_check = check_basic_auth('/programs')
    if auth_check is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
    if program_id not in app.user.program_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")
    program = Program(db = app.db, id = program_id)
    level_list = []
    for level_id in program.level_ids:
        level = Level(db = app.db, id = level_id)
        level_list.append(level.dict(include=LevelResponse().dict()))
    return level_list


@api_router.get("/programs/{program_id}/levels/{level_id}", response_model=LevelResponse)
async def get_level(program_id: int, level_id: int):
    if check_basic_auth('/programs') is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
    if program_id not in app.user.program_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")
    program = Program(db = app.db, id = program_id)
    if level_id not in program.level_ids:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Level id={level_id} does not exist for program id={program_id}")
    return Level(db = app.db, id = level_id)


@api_router.put("/programs/{program_id}/levels/{level_id}", response_model = LevelResponse)
async def put_update_level(program_id: int, level_id: int, updated_level: LevelData):
    if check_basic_auth('/programs') is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
    if program_id not in app.user.program_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")
    program = Program(db = app.db, id = program_id)
    if level_id not in program.level_ids:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Level id={level_id} does not exist for program id={program_id}")
    level = Level(db = app.db, id = level_id)
    new_list_index = updated_level.list_index
    updated_level.list_index = level.list_index
    level = level.copy(update=updated_level.dict(exclude_unset=True))
    await level.update_basic(app.db)
    if new_list_index != level.list_index:
        await program.move_level_index(db = app.db, level_id = level.id, new_list_index = new_list_index)
        level.list_index = new_list_index
    return level


@api_router.post("/programs/{program_id}/levels", response_model = LevelResponse, status_code = status.HTTP_201_CREATED)
async def post_new_level(program_id: int, new_level_data: LevelData):
    if check_basic_auth('/programs') is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
    if program_id not in app.user.program_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")
    program = Program(db = app.db, id = program_id)
    # TODO: there's got to be a slicker way to do this
    new_level = Level(
        db = app.db,
        id = None,
        title = new_level_data.title,
        description = new_level_data.description,
        list_index = program.get_next_level_index()
    )
    program.add_level(db = app.db, level_id = new_level.id)
    return new_level


@api_router.delete("/programs/{program_id}/levels/{level_id}")
async def delete_level(program_id: int, level_id: int):
    if check_basic_auth('/programs') is not None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for /programs endpoints")
    if program_id not in app.user.program_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")
    program = Program(db = app.db, id = program_id)
    if level_id not in program.level_ids:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Level id={level_id} does not exist for program id={program_id}")
    await program.remove_level(db = app.db, level_id = level_id)



###############################################################################
# ADMIN
###############################################################################


@api_router.get("/members")
async def members_get(request: Request):
    auth_check = check_basic_auth('/members')
    if auth_check is not None:
        return auth_check
    template_args = build_base_html_args(request)
    return templates.TemplateResponse("members.html", template_args)


@api_router.get("/database")
async def database_get(request: Request):
    auth_check = check_basic_auth('/database')
    if auth_check is not None:
        return auth_check
    template_args = build_base_html_args(request)
    return templates.TemplateResponse("database.html", template_args)



###############################################################################
# CAMPS/SCHEDULING
###############################################################################


async def schedule_get_all_camps(request: Request, template_args: dict):
    user_program_titles = app.user.load_program_titles(db = app.db)
    load_all_users_by_role(db = app.db, role="INSTRUCTOR", users = app.instructors)
    template_args['filtertable'] = load_camps_table(db = app.db)
    template_args['promoted_programs'] = app.promoted_programs
    template_args['user_program_titles'] = user_program_titles
    template_args['instructors'] = app.instructors
    return templates.TemplateResponse("schedule.html", template_args)


@api_router.get("/camps")
async def camps_get(request: Request):
    auth_check = check_basic_auth('/camps')
    if auth_check is not None:
        return auth_check
    template_args = build_base_html_args(request)
    return templates.TemplateResponse("camps.html", template_args)


@api_router.get("/schedule")
async def schedule_get(request: Request):
    auth_check = check_basic_auth('/schedule')
    if auth_check is not None:
        return auth_check
    template_args = build_base_html_args(request)
    return await schedule_get_all_camps(request, template_args)


@api_router.post("/schedule")
async def schedule_post_new_camp(request: Request, camp_program_id: int = Form(), camp_instructor_id: int = Form()):
    auth_check = check_basic_auth('/schedule')
    if auth_check is not None:
        return auth_check
    template_args = build_base_html_args(request)
    new_camp = Camp(db = app.db, program_id = camp_program_id)
    new_camp.add_instructor(db = app.db, user_id = camp_instructor_id)
    return await schedule_get_all_camps(request, template_args)


@api_router.delete("/schedule/{camp_id}")
async def camp_delete(request: Request, camp_id: int):
    auth_check = check_basic_auth('/schedule')
    if auth_check is not None:
        return auth_check
    load_all_camps(db = app.db, camps = app.camps)
    camp = app.camps.pop(camp_id)
    if camp is not None:
        camp.delete(db = app.db)



###############################################################################
# INCLUDE ROUTER (must go last)
###############################################################################


app.include_router(api_router)

