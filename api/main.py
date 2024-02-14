import os
import aiohttp
import json
from fastapi import FastAPI, APIRouter, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from oauthlib.oauth2 import WebApplicationClient
from mangum import Mangum
from pydantic import BaseModel
from sqlalchemy import select
from typing import Optional, List, Literal
from datetime import timedelta
from db import PaymentRecordDb, init_db, close_db
from datamodels import EnrollmentData, EnrollmentResponse, RoleEnum, UserData, UserResponse, StudentData, StudentResponse
from datamodels import ProgramData, ProgramResponse, LevelData, LevelResponse
from datamodels import CampData, CampResponse
from datamodels import EnrollmentData
from authentication import user_id_to_auth_token, auth_token_to_user_id
from user import User, init_roles, all_users
from student import Student
from program import Program, all_programs
from program import Level
from camp import Camp, all_camps
from square.client import Client as SquareClient
from uuid import uuid4


class Object(object):
    pass


description = """
API for managing the Level Up Learning business for scheduling summer and year-round
 educational track out camps. Guardians can define their students and enroll those
 students in camps. Instructors can design "programs" (i.e. curriculum) and "levels"
 (i.e. lessons) and see the camps they're currently teaching. Administrators can
 schedule camps, adjust enrollments, and assign instructors to camps.
"""
root_path = os.environ.get("API_ROOT_PATH") or ""
app = FastAPI(
    title="Level Up Learning",
    description=description,
    version="0.0.1",
    contact={
        "name": "Steve Miles",
        "url": "https://www.stevenmilesquant.com",
        "email": "steven.miles.quant@gmail.com",
    },
    docs_url=f'{root_path}/docs',
    openapi_url=f'{root_path}/openapi.json',
    redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api_router = APIRouter(prefix=root_path)


@app.on_event('startup')
async def startup():
    app.config = Object()
    app.config.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)
    app.config.GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
    app.config.GOOGLE_CLIENT_SECRET = os.environ.get(
        "GOOGLE_CLIENT_SECRET", None)
    app.config.GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
    app.config.jwt_lifetime = timedelta(days=1)
    app.config.jwt_algorithm = "HS256"
    app.config.jwt_subject = "access"

    app.google_client = WebApplicationClient(app.config.GOOGLE_CLIENT_ID)

    app.config.SQUARE_ACCESS_TOKEN = os.environ.get(
        "SQUARE_ACCESS_TOKEN", None)
    app.config.SQUARE_ENVIRONMENT = os.environ.get(
        "SQUARE_ENVIRONMENT", 'sandbox')
    app.square_client = SquareClient(
        access_token=app.config.SQUARE_ACCESS_TOKEN,
        environment=app.config.SQUARE_ENVIRONMENT)

    app.db_engine, app.db_sessionmaker = await init_db(
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        url=os.environ.get('DB_HOST'),
        port=os.environ.get('DB_PORT'),
        schema_name=os.environ.get('DB_SCHEMA_NAME'),
        for_pytest=(os.environ.get('PYTEST_RUN') == '1')
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


async def get_authorized_user(request, session, required=True) -> Optional[User]:
    token = request.headers.get('Authorization')
    user_id = auth_token_to_user_id(app, token)
    if user_id:
        user = User(id=user_id)
        await user.create(session)
    else:
        user = None
    if required and (not user or user.id is None):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"Auth: User not logged in.")
    return user


@api_router.post("/signin")
async def signin_post(request: Request, google_response_token: dict):
    '''Given the Google signin response token, returns this API's authentication token.'''
    google_provider_cfg = await get_google_provider_cfg()
    app.google_client.parse_request_body_response(
        json.dumps(google_response_token))
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = app.google_client.add_token(userinfo_endpoint)
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(uri, data=body) as google_response:
            user_info_json = await google_response.json()
    if not user_info_json.get("email_verified"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="User email not available or not verified by Google.")
    async with app.db_sessionmaker() as db_session:
        user = User(
            google_id=user_info_json["sub"],
            full_name=user_info_json["name"],
            email_address=user_info_json["email"]
        )
        await user.create(db_session)

        user_token, token_expiration = user_id_to_auth_token(app, user.id)
        return user_token


@api_router.get("/user", response_model=Optional[UserResponse])
async def get_user(request: Request):
    '''Get the current user.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, required=False)
        return user


###############################################################################
# STUDENTS
###############################################################################


@api_router.get("/students", response_model=List[StudentResponse])
async def get_students(request: Request):
    '''Get a list of students assigned to the current user.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        students = []
        for db_student in await user.students(session):
            student = Student(db_obj=db_student)
            await student.create(session)
            students.append(student)
        return students


@api_router.get("/students/{student_id}", response_model=StudentResponse)
async def get_student(request: Request, student_id: int):
    '''Get a single student.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        for db_student in await user.students(session):
            if db_student.id == student_id:
                student = Student(db_obj=db_student)
                await student.create(session)
                return student
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"User does not have permission for student id={student_id}")


@api_router.put("/students/{student_id}", response_model=StudentResponse)
async def put_update_student(request: Request, student_id: int, updated_student: StudentData):
    '''Update a student.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        for db_student in await user.students(session):
            if db_student.id == student_id:
                student = Student(db_obj=db_student)
                await student.create(session)
                student = student.copy(
                    update=updated_student.dict(exclude_unset=True))
                await student.update(session=session)
                return student
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"User does not have permission for student id={student_id}")


@api_router.post("/students", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def post_new_student(request: Request, new_student_data: StudentData):
    '''Create a new student.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        new_student = Student(**new_student_data.dict())
        await new_student.create(session)
        if new_student.id is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post new student failed")
        await user.add_student(session=session, student=new_student)
        await new_student.create(session)  # refresh from database (guardians)
        return new_student


@api_router.delete("/students/{student_id}")
async def delete_student(request: Request, student_id: int):
    '''Remove a student from the current user. Delete if orphaned.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        for db_student in await user.students(session):
            if db_student.id == student_id:
                student = Student(db_obj=db_student)
                await student.create(session)
                await user.remove_student(session=session, student=student)
                return
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"User does not have permission for student id={student_id}")


###############################################################################
# PROGRAMS
###############################################################################


@api_router.get("/programs", response_model=List[ProgramResponse])
async def get_programs(request: Request):
    '''Get a list of programs. If the current user is an administrator, returns all programs. Otherwise, returns the programs this user has been invited to design.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if user.has_role('ADMIN'):
            return await all_programs(session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        program_list = []
        for db_program in await user.programs(session):
            program = Program(db_obj=db_program)
            await program.create(session)
            program_list.append(program)
        return program_list


@api_router.get("/programs/{program_id}", response_model=ProgramResponse)
async def get_program(request: Request, program_id: int):
    '''Get a single program.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        program = Program(id=program_id)
        await program.create(session)
        if program.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Program id={program_id} does not exist")
        return program


@api_router.put("/programs/{program_id}", response_model=ProgramResponse)
async def put_update_program(request: Request, program_id: int, updated_program: ProgramData):
    '''Update a program.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        program = None
        if user.has_role('ADMIN'):
            program = Program(id=program_id)
            await program.create(session)
            if program.id is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                    detail=f"Program id={program_id} does not exist")
        else:
            for db_program in await user.programs(session):
                if db_program.id == program_id:
                    program = Program(db_obj=db_program)
                    await program.create(session)
                    break
        if program is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission for program id={program_id}")
        program = program.copy(update=updated_program.dict(exclude_unset=True))
        await program.update(session)
        return program


@api_router.post("/programs", response_model=ProgramResponse, status_code=status.HTTP_201_CREATED)
async def post_new_program(request: Request, new_program_data: ProgramData):
    '''Create a new program.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        new_program = Program(**new_program_data.dict())
        await new_program.create(session)
        if new_program.id is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post new program failed")
        await user.add_program(session=session, program=new_program)
        return new_program


@api_router.delete("/programs/{program_id}")
async def delete_program(request: Request, program_id: int):
    '''Delete a program.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        if user.has_role('ADMIN'):
            program = Program(id=program_id)
            await program.create(session)
            if program.id is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                    detail=f"Program id={program_id} does not exist")
            await program.delete(session)
            return
        else:
            for db_program in await user.programs(session):
                if db_program.id == program_id:
                    program = Program(db_obj=db_program)
                    await program.create(session)
                    await user.remove_program(session=session, program=program)
                    return
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"User does not have permission for program id={program_id}")


###############################################################################
# PROGRAMS -> LEVELS
###############################################################################


@api_router.get("/programs/{program_id}/levels", response_model=List[LevelResponse])
async def get_levels(request: Request, program_id: int):
    '''Get all levels within a program.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        program = Program(id=program_id)
        await program.create(session)
        level_list = []
        for db_level in await program.levels(session):
            level = Level(db_obj=db_level)
            await level.create(session)
            level_list.append(level)
        level_list.sort(key=lambda l: l.list_index)
        return level_list


@api_router.get("/programs/{program_id}/levels/{level_id}", response_model=LevelResponse)
async def get_level(request: Request, program_id: int, level_id: int):
    '''Get a single level within a program.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        program = Program(id=program_id)
        await program.create(session)
        if program.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Program id={program_id} does not exist")
        for db_level in await program.levels(session):
            if db_level.id == level_id:
                level = Level(db_obj=db_level)
                await level.create(session)
                return level
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Level id={level_id} does not exist for program id={program_id}")


@api_router.put("/programs/{program_id}/levels/{level_id}", response_model=LevelResponse)
async def put_update_level(request: Request, program_id: int, level_id: int, updated_level: LevelData):
    '''Update a level within a program.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        program = None
        if user.has_role('ADMIN'):
            program = Program(id=program_id)
            await program.create(session)
            if program.id is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                    detail=f"Program id={program_id} does not exist")
        else:
            for db_program in await user.programs(session):
                if db_program.id == program_id:
                    program = Program(db_obj=db_program)
                    await program.create(session)
                    break
        if program is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission for program id={program_id}")
        for db_level in await program.levels(session):
            if db_level.id == level_id:
                level = Level(db_obj=db_level)
                await level.create(session)
                level = level.copy(
                    update=updated_level.dict(exclude_unset=True))
                await level.update(session)
                return level
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Level id={level_id} does not exist for program id={program_id}")


@api_router.post("/programs/{program_id}/levels", response_model=LevelResponse, status_code=status.HTTP_201_CREATED)
async def post_new_level(request: Request, program_id: int, new_level_data: LevelData):
    '''Create a new level within a program.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        program = None
        if user.has_role('ADMIN'):
            program = Program(id=program_id)
            await program.create(session)
            if program.id is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                    detail=f"Program id={program_id} does not exist")
        else:
            for db_program in await user.programs(session):
                if db_program.id == program_id:
                    program = Program(db_obj=db_program)
                    await program.create(session)
                    break
        if program is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission for program id={program_id}")
        new_level = Level(**new_level_data.dict())
        new_level.program_id = program_id
        new_level.list_index = await program.get_next_level_index(session)
        await new_level.create(session)
        return new_level


@api_router.delete("/programs/{program_id}/levels/{level_id}")
async def delete_level(request: Request, program_id: int, level_id: int):
    '''Remove a level from its program and delete it.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('INSTRUCTOR'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to access programs.")
        program = None
        if user.has_role('ADMIN'):
            program = Program(id=program_id)
            await program.create(session)
            if program.id is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                    detail=f"Program id={program_id} does not exist")
        else:
            for db_program in await user.programs(session):
                if db_program.id == program_id:
                    program = Program(db_obj=db_program)
                    await program.create(session)
                    break
        if program is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission for program id={program_id}")
        for db_level in await program.levels(session):
            if db_level.id == level_id:
                level = Level(db_obj=db_level)
                await level.create(session)
                await level.delete(session)
                return
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Level id={level_id} does not exist for program id={program_id}")


###############################################################################
# CAMPS
###############################################################################


# When not requesting an instructor, this is a public route
@api_router.get("/camps", response_model=List[CampResponse])
async def get_camps(request: Request, is_published: Optional[bool] = None, instructor_id: Optional[int] = None):
    '''Get a list of camps, subject to filter conditions.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, required=False)
        if instructor_id:
            if user is None or (user.id != instructor_id and not user.has_role('ADMIN')):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                    detail=f"User not authorized for instructor id={instructor_id}.")
            if user.id == instructor_id:
                instructor = user
            else:
                instructor = User(id=instructor_id)
                await instructor.create(session)
                if instructor.id is None:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                        detail=f"Instructor id={instructor_id} not found.")
            camps = [Camp(db_obj=db_camp) for db_camp in await instructor.camps(session)]
            for camp in camps:
                await camp.create(session)
            if is_published is None:
                return camps
            camps = list(
                filter(lambda camp: camp.is_published == is_published, camps))
            return camps
        else:
            # Public access
            return await all_camps(session, is_published)


# Public route
@api_router.get("/camps/{camp_id}", response_model=CampResponse)
async def get_camp(request: Request, camp_id: int):
    '''Get a single camp.'''
    async with app.db_sessionmaker() as session:
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        return camp


@api_router.post("/camps", response_model=CampResponse, status_code=status.HTTP_201_CREATED)
async def post_new_camp(request: Request, new_camp_data: CampData):
    '''Create a new camp.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to create camps.")
        if new_camp_data.primary_instructor_id is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=f"Primary instructor id is required.")
        instructor = User(id=new_camp_data.primary_instructor_id)
        await instructor.create(session)
        if instructor.id is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=f"Instructor id={new_camp_data.primary_instructor_id} does not exist.")
        new_camp = Camp(**new_camp_data.dict())
        await new_camp.create(session)
        if new_camp.id is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Post new camp failed")
        return new_camp


@api_router.put("/camps/{camp_id}", response_model=CampResponse)
async def put_update_camp(request: Request, camp_id: int, updated_camp_data: CampData):
    '''Update a camp.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to update camps.")
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        instructor = User(id=updated_camp_data.primary_instructor_id)
        await instructor.create(session)
        if instructor.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Instructor id={updated_camp_data.primary_instructor_id} not found.")
        camp = camp.copy(update=updated_camp_data.dict(exclude_unset=True))
        await camp.update(session=session)
        return camp


@api_router.delete("/camps/{camp_id}")
async def delete_camp(request: Request, camp_id: int):
    '''Delete a camp.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to delete camps.")
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        await camp.delete(session=session)


###############################################################################
# CAMPS -> INSTRUCTORS
###############################################################################


# Public route
@api_router.get("/camps/{camp_id}/instructors", response_model=List[UserResponse])
async def get_camp_instructors(request: Request, camp_id: int):
    '''Get all instructors in a camp.'''
    async with app.db_sessionmaker() as session:
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Camp id={camp_id} does not exist.")
        instructors = []
        for db_instructor in await camp.instructors(session):
            instructor = User(db_obj=db_instructor)
            await instructor.create(session)
            instructors.append(instructor)
        return instructors


# Public route
@api_router.get("/camps/{camp_id}/instructors/{instructor_id}", response_model=UserResponse)
async def get_camp_instructor(request: Request, camp_id: int, instructor_id: int):
    '''Get a single instructor in a camp.'''
    async with app.db_sessionmaker() as session:
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Camp id={camp_id} does not exist.")
        for db_instructor in await camp.instructors(session):
            if db_instructor.id == instructor_id:
                instructor = User(db_obj=db_instructor)
                await instructor.create(session)
                return instructor
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Instructor id={instructor_id} does not exist for camp id={camp_id}")


@api_router.post("/camps/{camp_id}/instructors/{instructor_id}", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def add_instructor_to_camp(request: Request, camp_id: int, instructor_id: int):
    '''Assign an instructor to a camp.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to update camps.")
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        instructor = User(id=instructor_id)
        await instructor.create(session)
        if instructor.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Instructor_id id={instructor_id} not found.")
        await instructor.create(session)
        await camp.add_instructor(session=session, instructor=instructor)
        return instructor


@api_router.delete("/camps/{camp_id}/instructors/{instructor_id}")
async def remove_instructor_from_camp(request: Request, camp_id: int, instructor_id: int):
    '''Remove an instructor from a camp.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to update camps.")
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        instructor = User(id=instructor_id)
        await instructor.create(session)
        if instructor.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Instructor_id id={instructor_id} not found.")
        await camp.remove_instructor(session=session, instructor=instructor)


###############################################################################
# CAMPS -> STUDENTS
###############################################################################


@api_router.get("/camps/{camp_id}/students", response_model=List[StudentResponse])
async def get_camp_students(request: Request, camp_id: int):
    '''Get all students enrolled in a camp.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Camp id={camp_id} does not exist.")
        if not await camp.user_authorized(session, user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User not authorized for detailed view of camp id={camp_id}.")
        students = []
        for db_student in await camp.students(session):
            student = Student(db_obj=db_student)
            await student.create(session)
            students.append(student)
        return students


@api_router.get("/camps/{camp_id}/students/{student_id}", response_model=StudentResponse)
async def get_camp_student(request: Request, camp_id: int, student_id: int):
    '''Get a single student enrolled in a camp.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Camp id={camp_id} does not exist.")
        if not await camp.user_authorized(session, user):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User not authorized for detailed view of camp id={camp_id}.")
        for db_student in await camp.students(session):
            if db_student.id == student_id:
                student = Student(db_obj=db_student)
                await student.create(session)
                return student
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Student id={student_id} is not enrolled in camp id={camp_id}.")


@api_router.delete("/camps/{camp_id}/students/{student_id}")
async def remove_student_from_camp(request: Request, camp_id: int, student_id: int):
    '''Disenroll a student from a camp.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have permission to update camps.")
        camp = Camp(id=camp_id)
        await camp.create(session)
        if camp.id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
        if not camp.is_published:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"Camp id={camp_id} is not yet published for enrollment.")
        student = Student(id=student_id)
        await student.create(session)
        if student.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Student id={student_id} not found.")
        await camp.remove_student(session=session, student=student)


###############################################################################
# ENROLLMENTS
###############################################################################


class Enrollment(BaseModel):
    student: Student
    camp: Camp


@api_router.post("/enroll", response_model=List[StudentResponse], status_code=status.HTTP_201_CREATED)
async def enroll_students_in_camps(request: Request, enrollment_data: EnrollmentData):
    '''Enroll a student in a camp.'''
    async with app.db_sessionmaker() as db_session:
        user = await get_authorized_user(request, db_session)
        students = await user.students(db_session)

        # Verify each enrollment and get total cost
        total_cost = 0
        enrollments: List[Enrollment] = []
        for e_in in enrollment_data.enrollments:
            camp = Camp(id=e_in.camp_id)
            await camp.create(db_session)
            if camp.id is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={e_in.camp_id} not found.")
            if not camp.is_published:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                    detail=f"Camp id={e.camp_id} is not yet published for enrollment.")

            student = Student(id=e_in.student_id)
            await student.create(db_session)
            if student.id is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"Student id={e_in.student_id} not found.")
            if student._db_obj not in students:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail=f"Student id={e_in.student_id} does not belong to this user.")

            enrollment = Enrollment(student=student, camp=camp)
            enrollments.append(enrollment)
            total_cost = total_cost + (camp.cost or 0)

        # Check that the bill was paid in the correct amount
        if total_cost > 0:
            if enrollment_data.payment_token is None:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED,
                                    detail=f"Square payment token is required on non-free camps.")
            create_payment_request = Object()
            create_payment_request.source_id = enrollment_data.payment_token
            create_payment_request.idempotency_key = str(uuid4())
            create_payment_request.amount_money = Object()
            create_payment_request.amount_money.currency = "USD"
            create_payment_request.amount_money.amount = total_cost*100
            square_response = app.square_client.payments.create_payment(
                create_payment_request)

            if square_response.is_error():
                raise HTTPException(status_code=square_response.status_code,
                                    detail=f"From square: {square_response.errors[0]['detail']}")

            square_payment = square_response.body['payment']
            paid_amount = square_payment['amount_money']['amount']
            if paid_amount < total_cost*100:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED,
                                    detail=f"Paid amount, ${paid_amount/100}, was less than expected amount, ${total_cost}.")

            for enrollment in enrollments:
                camp = enrollment.camp
                student = enrollment.student
                payment_record = PaymentRecordDb(
                    square_payment_id=square_payment['id'],
                    square_order_id=square_payment['order_id'],
                    square_receipt_number=square_payment['receipt_number'],
                    camp_id=camp.id,
                    user_id=user.id,
                    student_id=student.id
                )
                db_session.add(payment_record)
            await db_session.commit()

        # Finally, execute enrollments and return the updated students
        response: List[StudentResponse] = []
        for enrollment in enrollments:
            camp = enrollment.camp
            student = enrollment.student
            await camp.add_student(session=db_session, student=student)
            await student.create(db_session)
            response.append(student)
        return response


@api_router.get("/enrollments", response_model=List[EnrollmentResponse])
async def get_all_enrollments(request: Request):
    '''Get all enrollments (admin only).'''
    async with app.db_sessionmaker() as db_session:
        user = await get_authorized_user(request, db_session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have access to enrollments.")

        enrollments: List[EnrollmentResponse] = []
        stmt = select(PaymentRecordDb)
        result = await db_session.execute(stmt)
        for result_row in result.unique():
            db_payment_record: PaymentRecordDb = result_row[0]
            guardian = User(id=db_payment_record.user_id)
            await guardian.create(db_session)
            student = Student(id=db_payment_record.student_id)
            await student.create(db_session)
            camp = Camp(id=db_payment_record.camp_id)
            await camp.create(db_session)
            enrollment = EnrollmentResponse(
                id=db_payment_record.id,
                guardian=guardian,
                student=student,
                camp=camp,
                square_receipt_number=db_payment_record.square_receipt_number
            )
            enrollments.append(enrollment)
        return enrollments


###############################################################################
# USERS
###############################################################################


@api_router.get("/users", response_model=List[UserResponse])
async def users_get_all(request: Request, role: Optional[Literal['ADMIN', 'INSTRUCTOR', 'GUARDIAN']] = None):
    '''Get all users, or all users of a given role.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if role != 'INSTRUCTOR' and not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have access to users with role={role or '(all)'}.")
        return await all_users(session, by_role=role)


@api_router.get("/roles", response_model=List[Literal['ADMIN', 'INSTRUCTOR', 'GUARDIAN']])
async def roles_get_all(request: Request):
    '''Get all valid roles.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User does not have access to full list of roles.")
        # cheating a little here - admin user (i.e. this user) will have all roles
        return user.roles


@api_router.post("/users/{user_id}/roles/{role_name}", response_model=str)
async def user_add_role(request: Request, user_id: int, role_name: Literal['ADMIN', 'INSTRUCTOR', 'GUARDIAN']):
    '''Add a role to a user.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User is not authorized to change user roles.")
        tgt_user = User(id=user_id)
        await tgt_user.create(session)
        if tgt_user.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"User id={tgt_user.id} not found.")
        if role_name not in RoleEnum.__members__:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Role={role_name} not found.")
        await tgt_user.add_role(session, role_name)
        return role_name


@api_router.delete("/users/{user_id}/roles/{role_name}")
async def user_remove_role(request: Request, user_id: int, role_name: Literal['ADMIN', 'INSTRUCTOR', 'GUARDIAN']):
    '''Remove a role from a user.'''
    async with app.db_sessionmaker() as session:
        if user_id == 1:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User id = {user_id} is special and cannot have roles removed.")
        user = await get_authorized_user(request, session)
        if not user.has_role('ADMIN'):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=f"User is not authorized to change user roles.")
        tgt_user = User(id=user_id)
        await tgt_user.create(session)
        if tgt_user.id is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"User id={tgt_user.id} not found.")
        if role_name not in RoleEnum.__members__:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Role={role_name} not found.")
        await tgt_user.remove_role(session, role_name)


@api_router.put("/user", response_model=UserResponse)
async def put_update_user(request: Request, updated_user: UserData):
    '''Update the current user's information.'''
    async with app.db_sessionmaker() as session:
        user = await get_authorized_user(request, session, required=True)
        user = user.copy(update=updated_user.dict(exclude_unset=True))
        await user.update(session=session)
        return user


###############################################################################
# INCLUDE ROUTER (must go last)
###############################################################################


app.include_router(api_router)
handler = Mangum(app)  # only needed for use with AWS Lambda
