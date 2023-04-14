import os, aiohttp, json, asyncio
from fastapi import FastAPI, APIRouter, Request, Header, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from oauthlib.oauth2 import WebApplicationClient
from mangum import Mangum
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from db import init_db, close_db
from authentication import user_id_to_auth_token, auth_token_to_user_id
from user import UserData, UserResponse, User, Role, init_roles, all_users
from student import StudentData, StudentResponse, Student
from program import ProgramData, ProgramResponse, Program, all_programs
from program import LevelData, LevelResponse, Level
from camp import CampData, CampResponse, Camp, LevelScheduleData, LevelScheduleResponse, LevelSchedule, all_camps


class Object(object):
    pass


app = FastAPI()
api_router = APIRouter(prefix=os.environ.get('ROOT_PATH') or '')


@app.on_event('startup')
async def startup():
    app.config = Object()
    app.config.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)
    app.config.GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
    app.config.GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
    app.config.GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
    app.config.jwt_cookie_name = "authToken"
    app.config.jwt_lifetime = timedelta(minutes=30)
    app.config.jwt_algorithm = "HS256"
    app.config.jwt_subject = "access"

    app.google_client = WebApplicationClient(app.config.GOOGLE_CLIENT_ID)

    app.db_engine, app.db_sessionmaker = await init_db(
        user = os.environ.get('DB_USER'),
        password = os.environ.get('DB_PASSWORD'),
        url = os.environ.get('DB_HOST'),
        port = os.environ.get('DB_PORT'),
        schema_name = os.environ.get('DB_SCHEMA_NAME'),
        for_pytest = (os.environ.get('PYTEST_RUN') == '1')
    )
    async with app.db_sessionmaker() as session:
        await init_roles(session)


@app.on_event('shutdown')
async def shutdown():
    await close_db(app.db_engine)


async def get_google_provider_cfg() -> dict:
    ret_json = {}
    async with aiohttp.ClientSession() as session:
        async with session.get(app.config.GOOGLE_DISCOVERY_URL) as response:
            ret_json = await response.json()
    return ret_json


async def get_authorized_user(request, session, permission_url_path, required = True) -> Optional[User]:
    token = request.headers.get('Authorization')
    user_id = auth_token_to_user_id(app, token)
    if user_id:
        user = User(id = user_id)
        await user.create(session)
    else:
        user = None
    if required:
        if not user:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Auth: User not logged in.")
        if permission_url_path == '/':
            return user
        for role in await user.roles(session):
            if permission_url_path in role.permissible_endpoints:
                return user
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for {permission_url_path}")
    else:
        return user


@api_router.post("/signin")
async def signin_post(request: Request, google_response_token: dict):
    google_provider_cfg = await get_google_provider_cfg()
    app.google_client.parse_request_body_response(json.dumps(google_response_token))
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = app.google_client.add_token(userinfo_endpoint)
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(uri, data=body) as google_response:
            user_info_json = await google_response.json()
    if not user_info_json.get("email_verified"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User email not available or not verified by Google.")
    async with app.db_sessionmaker() as db_session:
        user = User(
            google_id = user_info_json["sub"],
            full_name = user_info_json["name"],
            email_address = user_info_json["email"]
        )
        await user.create(db_session)

        user_token, token_expiration = user_id_to_auth_token(app, user.id)
        return user_token


@api_router.get("/signout", response_class = RedirectResponse)
async def signout_get(request: Request):
    tgtUrl = '/'
    message = request.query_params.get('message')
    if message is not None:
        tgtUrl = tgtUrl + '?message="' + message + '"'
    response = RedirectResponse(url=tgtUrl)
    response.delete_cookie(key = app.config.jwt_cookie_name)
    return response


@api_router.get("/user", response_model = Optional[UserResponse])
async def get_user(request: Request):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/', required = False)
        return user


@api_router.put("/user", response_model = UserResponse)
async def put_user(request: Request, updated_user: UserData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/', required = True)
        user = user.copy(update=updated_user.dict(exclude_unset=True))
        await user.update(session = session)
        return user


@api_router.get("/user/roles")
async def get_user_roles(request: Request):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/', required = False)
        if user is None:
            return []
        else:
            return [role.dict() for role in await user.roles(session)]


@api_router.get("/instructors/{user_id}", response_model = Optional[UserResponse])
async def instructor_get_one(request: Request, user_id: int, accept: Optional[str] = Header(None)):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/')
        instructor = User(id = user_id)
        await instructor.create(session)
        role = Role(name = 'INSTRUCTOR')
        await role.create(session)
        if instructor.id is None or role not in await instructor.roles(session):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Instructor id={user_id} does not exist.")
        return user



###############################################################################
# STUDENTS
###############################################################################


@api_router.get("/students")
async def get_students(request: Request, accept: Optional[str] = Header(None)):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/students')
        students = []
        for db_student in await user.students(session):
            student = Student(db_obj = db_student)
            await student.create(session)
            students.append(student.dict(include=StudentResponse().dict()))
        return students


@api_router.get("/students/{student_id}", response_model = StudentResponse)
async def get_student(request: Request, student_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/students')
        for db_student in await user.students(session):
            if db_student.id == student_id:
                student = Student(db_obj = db_student)
                await student.create(session)
                return student
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for student id={student_id}")


@api_router.put("/students/{student_id}", response_model = StudentResponse)
async def put_update_student(request: Request, student_id: int, updated_student: StudentData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/students')
        for db_student in await user.students(session):
            if db_student.id == student_id:
                student = Student(db_obj = db_student)
                await student.create(session)
                student = student.copy(update=updated_student.dict(exclude_unset=True))
                await student.update(session = session)
                return student
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for student id={student_id}")


@api_router.post("/students", response_model = StudentResponse, status_code = status.HTTP_201_CREATED)
async def post_new_student(request: Request, new_student_data: StudentData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/students')
        new_student = Student(**new_student_data.dict())
        await new_student.create(session)
        if new_student.id is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post new student failed")
        await user.add_student(session = session, student = new_student)
        return new_student


@api_router.delete("/students/{student_id}")
async def delete_student(request: Request, student_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/students')
        for db_student in await user.students(session):
            if db_student.id == student_id:
                student = Student(db_obj = db_student)
                await student.create(session)
                await user.remove_student(session = session, student = student)
                return
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for student id={student_id}")



@api_router.get("/students/{student_id}/camps")
async def get_student_camps(request: Request, student_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/students')
        for db_student in await user.students(session):
            if db_student.id == student_id:
                student = Student(db_obj = db_student)
                await student.create(session)
                camps = []
                for db_camp in await student.camps(session):
                    camp = Camp(db_obj = db_camp)
                    await camp.create(session)
                    camps.append(camp.dict(include=CampResponse().dict()))
                return camps
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for student id={student_id}")




###############################################################################
# PROGRAMS/TEACH
###############################################################################


@api_router.get("/teach")
async def get_teach_all(request: Request, accept: Optional[str] = Header(None)):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/teach')
        camp_list = []
        for db_camp in await user.camps(session):
            camp = Camp(db_obj = db_camp)
            await camp.create(session)
            if camp.is_published:
                camp_list.append(camp.dict(include=CampResponse().dict()))
        return camp_list

@api_router.get("/programs")
async def get_programs(request: Request, accept: Optional[str] = Header(None)):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/programs')
        for role in await user.roles(session):
            if role.name == 'ADMIN':
                return await all_programs(session)
        program_list = []
        for db_program in await user.programs(session):
            program = Program(db_obj = db_program)
            await program.create(session)
            program_list.append(program.dict(include=ProgramResponse().dict()))
        return program_list


@api_router.get("/programs/{program_id}", response_model = ProgramResponse)
async def get_program(request: Request, program_id: int, accept: Optional[str] = Header(None)):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps') # special authorization: if you can get a camp, you can get a program/level
        program = Program(id = program_id)
        await program.create(session)
        if program.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Program id={program_id} does not exist")
        return program


@api_router.put("/programs/{program_id}", response_model = ProgramResponse)
async def put_update_program(request: Request, program_id: int, updated_program: ProgramData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/programs')
        for db_program in await user.programs(session):
            if db_program.id == program_id:
                program = Program(db_obj = db_program)
                await program.create(session)
                program = program.copy(update=updated_program.dict(exclude_unset=True))
                await program.update(session)
                return program
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")


@api_router.post("/programs", response_model = ProgramResponse, status_code = status.HTTP_201_CREATED)
async def post_new_program(request: Request, new_program_data: ProgramData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/programs')
        new_program = Program(**new_program_data.dict())
        await new_program.create(session)
        if new_program.id is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post new program failed")
        await user.add_program(session = session, program = new_program)
        return new_program


@api_router.delete("/programs/{program_id}")
async def delete_program(request: Request, program_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/programs')
        for db_program in await user.programs(session):
            if db_program.id == program_id:
                program = Program(db_obj = db_program)
                await user.remove_program(session = session, program = program)
                return
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")


@api_router.get("/programs/{program_id}/levels")
async def get_levels(request: Request, program_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps') # special authorization: if you can get a camp, you can get a program/level
        program = Program(id = program_id)
        await program.create(session)
        level_list = []
        for db_level in await program.levels(session):
            level = Level(db_obj = db_level)
            await level.create(session)
            level_list.append(level.dict(include=LevelResponse().dict()))
        return level_list


@api_router.get("/programs/{program_id}/levels/{level_id}", response_model=LevelResponse)
async def get_level(request: Request, program_id: int, level_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps') # special authorization: if you can get a camp, you can get a program/level
        program = Program(id = program_id)
        await program.create(session)
        if program.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Program id={program_id} does not exist")
        for db_level in await program.levels(session):
            if db_level.id == level_id:
                level = Level(db_obj = db_level)
                await level.create(session)
                return level
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Level id={level_id} does not exist for program id={program_id}")


@api_router.put("/programs/{program_id}/levels/{level_id}", response_model = LevelResponse)
async def put_update_level(request: Request, program_id: int, level_id: int, updated_level: LevelData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/programs')
        for db_program in await user.programs(session):
            if db_program.id == program_id:
                program = Program(db_obj = db_program)
                await program.create(session)
                for db_level in await program.levels(session):
                    if db_level.id == level_id:
                        level = Level(db_obj = db_level)
                        await level.create(session)
                        level = level.copy(update=updated_level.dict(exclude_unset=True))
                        await level.update(session)
                        return level
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Level id={level_id} does not exist for program id={program_id}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")


@api_router.post("/programs/{program_id}/levels", response_model = LevelResponse, status_code = status.HTTP_201_CREATED)
async def post_new_level(request: Request, program_id: int, new_level_data: LevelData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/programs')
        for db_program in await user.programs(session):
            if db_program.id == program_id:
                program = Program(db_obj = db_program)
                await program.create(session)
                new_level = Level(**new_level_data.dict())
                new_level.program_id = program_id
                new_level.list_index = await program.get_next_level_index(session)
                await new_level.create(session)
                return new_level
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")


@api_router.delete("/programs/{program_id}/levels/{level_id}")
async def delete_level(request: Request, program_id: int, level_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/programs')
        for db_program in await user.programs(session):
            if db_program.id == program_id:
                program = Program(db_obj = db_program)
                await program.create(session)
                for db_level in await program.levels(session):
                    if db_level.id == level_id:
                        level = Level(db_obj = db_level)
                        await level.create(session)
                        await level.delete(session)
                        return
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Level id={level_id} does not exist for program id={program_id}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User does not have permission for program id={program_id}")


@api_router.get("/camps/{camp_id}/students")
async def get_camp_students(request: Request, camp_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/teach')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} does not exist.")
        if not await camp.user_authorized(session, user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for camp id={camp_id}.")
        students = []
        for db_student in await camp.students(session):
            student = Student(db_obj = db_student)
            await student.create(session)
            students.append(student.dict(include=StudentResponse().dict()))
        return students


@api_router.get("/camps/{camp_id}/students/{student_id}", response_model = StudentResponse)
async def get_camp_student(request: Request, camp_id: int, student_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/teach')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} does not exist.")
        if not await camp.user_authorized(session, user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for camp id={camp_id}.")
        for db_student in await camp.students(session):
            if db_student.id == student_id:
                student = Student(db_obj = db_student)
                await student.create(session)
                return student
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student id={student_id} is not enrolled in camp id={camp_id}.")


@api_router.get("/camps/{camp_id}/students/{student_id}/camps")
async def get_camp_student_camps(request: Request, camp_id: int, student_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/teach')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} does not exist.")
        if not await camp.user_authorized(session, user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for camp id={camp_id}.")
        for db_student in await camp.students(session):
            if db_student.id == student_id:
                student = Student(db_obj = db_student)
                await student.create(session)
                camps = []
                for db_camp in await student.camps(session):
                    camp_i = Camp(db_obj = db_camp)
                    await camp_i.create(session)
                    camps.append(camp_i.dict(include=CampResponse().dict()))
                return camps
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student id={student_id} is not enrolled in camp id={camp_id}.")


@api_router.get("/camps/{camp_id}/students/{student_id}/guardians")
async def get_camp_student_guardians(request: Request, camp_id: int, student_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/teach')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} does not exist.")
        if not await camp.user_authorized(session, user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"User not authorized for camp id={camp_id}.")
        for db_student in await camp.students(session):
            if db_student.id == student_id:
                student = Student(db_obj = db_student)
                await student.create(session)
                guardians = []
                for db_guardian in await student.guardians(session):
                    guardian = User(db_obj = db_guardian)
                    await guardian.create(session)
                    guardians.append(guardian.dict(include=UserResponse().dict()))
                return guardians
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student id={student_id} is not enrolled in camp id={camp_id}.")


###############################################################################
# VIEW CAMPS (READ SIDE OF CAMPS) AND STUDENT ENROLLMENT
###############################################################################


@api_router.get("/camps")
async def get_camps(request: Request, accept: Optional[str] = Header(None)):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps')
        return await all_camps(session = session, published = True)


@api_router.get("/camps/{camp_id}", response_model = CampResponse)
async def get_camp(request: Request, camp_id: int, accept: Optional[str] = Header(None)):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        return camp


@api_router.get("/camps/{camp_id}/levels/{level_id}", response_model = LevelScheduleResponse)
async def get_camp_level_schedule(request: Request, camp_id: int, level_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} does not exist.")
        for db_level_schedule in await camp.level_schedules(session):
            if db_level_schedule.level_id == level_id:
                level_schedule = LevelSchedule(db_obj = db_level_schedule)
                await level_schedule.create(session)
                return level_schedule
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Level id={level_id} not found for camp id={camp_id}")


@api_router.get("/camps/{camp_id}/levels")
async def get_camp_level_schedules(request: Request, camp_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} does not exist.")
        level_schedules = []
        for db_level_schedule in await camp.level_schedules(session):
            level_schedule = LevelSchedule(db_obj = db_level_schedule)
            await level_schedule.create(session)
            level_schedules.append(level_schedule.dict(include=(LevelScheduleResponse().dict())))
        return level_schedules


@api_router.get("/camps/{camp_id}/instructors")
async def get_camp_instructors(request: Request, camp_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} does not exist.")
        instructors = []
        for db_instructor in await camp.instructors(session):
            instructor = User(db_obj = db_instructor)
            await instructor.create(session)
            instructor_response = instructor.dict(include=UserResponse().dict())
            instructor_response['is_primary'] = (db_instructor.id == camp.primary_instructor_id)
            instructors.append(instructor_response)
        return instructors


@api_router.get("/camps/{camp_id}/instructors/{instructor_id}")
async def get_camp_instructor(request: Request, camp_id: int, instructor_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} does not exist.")
        for db_instructor in await camp.instructors(session):
            if db_instructor.id == instructor_id:
                instructor = User(db_obj = db_instructor)
                await instructor.create(session)
                return instructor.dict(include=UserResponse().dict())
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Instructor id={instructor_id} does not exist for camp id={camp_id}")



@api_router.post("/camps/{camp_id}/students/{student_id}", response_model = StudentResponse, status_code = status.HTTP_201_CREATED)
async def enroll_student_in_camp(request: Request, camp_id: int, student_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/camps')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        if not camp.is_published:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Camp id={camp_id} is not yet published for enrollment.")
        for db_student in await user.students(session):
            if db_student.id == student_id:
                student = Student(db_obj = db_student)
                await student.create(session)
                await camp.add_student(session = session, student = student)
                return student
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Student id={student_id} does not belong to this user.")



###############################################################################
# SCHEDULE CAMPS (WRITE SIDE OF CAMPS)
###############################################################################


@api_router.get("/schedule")
async def get_schedule(request: Request, accept: Optional[str] = Header(None)):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        return await all_camps(session = session)


@api_router.post("/camps", response_model = CampResponse, status_code = status.HTTP_201_CREATED)
async def post_new_camp(request: Request, new_camp_data: CampData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        instructor = User(id = new_camp_data.primary_instructor_id)
        await instructor.create(session)
        if instructor.id is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Instructor id={new_camp_data.primary_instructor_id} does not exist.")
        new_camp = Camp(**new_camp_data.dict())
        await new_camp.create(session)
        if new_camp.id is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post new camp failed")
        await new_camp.add_instructor(session, instructor)
        return new_camp


@api_router.put("/camps/{camp_id}", response_model = CampResponse)
async def put_update_camp(request: Request, camp_id: int, updated_camp_data: CampData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        if updated_camp_data.program_id != camp.program_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Once created, the program cannot be changed for a camp. Schedule a new camp, instead.")
        instructor = User(id = updated_camp_data.primary_instructor_id)
        await instructor.create(session)
        if instructor.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Instructor id={updated_camp_data.primary_instructor_id} not found.")
        camp = camp.copy(update=updated_camp_data.dict(exclude_unset=True))
        await camp.update(session = session)
        return camp


@api_router.delete("/camps/{camp_id}")
async def delete_camp(request: Request, camp_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        await camp.delete(session = session)


@api_router.post("/camps/{camp_id}/instructors/{instructor_id}", response_model = UserResponse, status_code = status.HTTP_201_CREATED)
async def add_instructor_to_camp(request: Request, camp_id: int, instructor_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        instructor = User(id = instructor_id)
        await instructor.create(session)
        if instructor.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Instructor_id id={instructor_id} not found.")
        await instructor.create(session)
        await camp.add_instructor(session = session, instructor = instructor)
        return instructor


@api_router.delete("/camps/{camp_id}/instructors/{instructor_id}")
async def remove_instructor_from_camp(request: Request, camp_id: int, instructor_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        instructor = User(id = instructor_id)
        await instructor.create(session)
        if instructor.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Instructor_id id={instructor_id} not found.")
        await camp.remove_instructor(session = session, instructor = instructor)


@api_router.delete("/camps/{camp_id}/students/{student_id}")
async def remove_student_from_camp(request: Request, camp_id: int, student_id: int):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        if not camp.is_published:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Camp id={camp_id} is not yet published for enrollment.")
        student = Student(id = student_id)
        await student.create(session)
        if student.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student id={student_id} not found.")
        await camp.remove_student(session = session, student = student)


@api_router.put("/camps/{camp_id}/levels/{level_id}", response_model = LevelScheduleResponse)
async def camp_update_level_schedule(request: Request, camp_id: int, level_id: int, updated_level_schedule: LevelScheduleData):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        camp = Camp(id = camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        for db_level_schedule in await camp.level_schedules(session):
            if db_level_schedule.level_id == level_id:
                level_schedule = LevelSchedule(db_obj = db_level_schedule)
                await level_schedule.create(session)
                level_schedule = level_schedule.copy(update=updated_level_schedule.dict(exclude_unset=True))
                await level_schedule.update(session)
                return level_schedule
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Level id={level_id} does not exist for camp id={camp_id}")


@api_router.get("/instructors")
async def get_all_possible_instructors(request: Request):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/schedule')
        return await all_users(session, by_role = 'INSTRUCTOR')


###############################################################################
# MEMBERS (full access to users)
###############################################################################


@api_router.get("/users")
async def users_get_all(request: Request):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/members')
        return await all_users(session)


@api_router.get("/roles")
async def roles_get_all(request: Request):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/members')
        return [role.dict() for role in await user.roles(session)] # cheating a little here - admin (i.e. this) user will have all roles


@api_router.post("/users/{user_id}/roles/{role_name}")
async def user_add_role(request: Request, user_id: int, role_name: str):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/members')
        tgt_user = User(id = user_id)
        await tgt_user.create(session)
        if tgt_user.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User id={tgt_user.id} not found.")
        role = Role(name = role_name)
        await role.create(session)
        if role.name is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Role={role_name} not found.")
        await tgt_user.add_role(session = session, role = role)
        return role_name


@api_router.delete("/users/{user_id}/roles/{role_name}")
async def user_remove_role(request: Request, user_id: int, role_name: str):
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, '/members')
        tgt_user = User(id = user_id)
        await tgt_user.create(session)
        await tgt_user.remove_role(session = session, role = role_name)


###############################################################################
# INCLUDE ROUTER (must go last)
###############################################################################


app.include_router(api_router)
handler = Mangum(app) # only needed for use with AWS Lambda

