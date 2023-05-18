from datetime import date, datetime
from typing import Optional, List
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy import BigInteger, Text, String
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.pool import NullPool
from datamodels import UserResponse, StudentResponse, ProgramResponse, LevelResponse, CampResponse, LevelScheduleResponse


class Base(DeclarativeBase):
    pass


user_x_roles = Table(
    'user_x_roles',
    Base.metadata,
    Column('user_id', ForeignKey('user.id'), primary_key=True),
    Column('role', ForeignKey('role.name'), primary_key=True),
)

user_x_students = Table(
    'user_x_students',
    Base.metadata,
    Column('user_id', ForeignKey('user.id'), primary_key=True),
    Column('student_id', ForeignKey('student.id'), primary_key=True),
)

user_x_programs = Table(
    'user_x_programs',
    Base.metadata,
    Column('user_id', ForeignKey('user.id'), primary_key=True),
    Column('program_id', ForeignKey('program.id'), primary_key=True),
)

camp_x_instructors = Table(
    'camp_x_instructors',
    Base.metadata,
    Column('camp_id', ForeignKey('camp.id'), primary_key=True),
    Column('instructor_id', ForeignKey('user.id'), primary_key=True),
)

camp_x_students = Table(
    'camp_x_students',
    Base.metadata,
    Column('camp_id', ForeignKey('camp.id'), primary_key=True),
    Column('student_id', ForeignKey('student.id'), primary_key=True),
)


class EndpointDb(Base):
    __tablename__ = 'endpoint'

    role: Mapped[str] = mapped_column(ForeignKey('role.name'), primary_key=True)
    url: Mapped[str] = mapped_column(String(32), primary_key=True)
    title: Mapped[str] = mapped_column(Text)


class RoleDb(Base):
    __tablename__ = 'role'

    name: Mapped[str] = mapped_column(String(32), primary_key=True)
    endpoints: Mapped[List[EndpointDb]] = relationship(lazy='raise')

    users: Mapped[List['UserDb']] = relationship(secondary=user_x_roles, back_populates='roles', lazy='raise')


class UserDb(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    google_id: Mapped[str] = mapped_column(Text, nullable=False)
    full_name: Mapped[str] = mapped_column(Text)
    email_address: Mapped[str] = mapped_column(Text)
    phone_number: Mapped[str] = mapped_column(Text, nullable=True)
    instructor_subjects: Mapped[str] = mapped_column(Text, nullable=True)
    instructor_description: Mapped[str] = mapped_column(Text, nullable=True)

    roles: Mapped[List[RoleDb]] = relationship(secondary=user_x_roles, back_populates='users', lazy='joined')
    students: Mapped[List['StudentDb']] = relationship(secondary=user_x_students, back_populates='guardians', lazy='raise')
    programs: Mapped[List['ProgramDb']] = relationship(secondary=user_x_programs, back_populates='designers', lazy='raise')
    camps: Mapped[List['CampDb']] = relationship(secondary=camp_x_instructors, back_populates='instructors', lazy='raise')

    def dict(self):
        returnVal = {}
        for key, value in UserResponse():
            if key != 'roles':
                returnVal[key] = getattr(self, key)
        return returnVal


class StudentDb(Base):
    __tablename__ = 'student'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    grade_level: Mapped[int] = mapped_column(nullable=True)

    guardians: Mapped[List['UserDb']] = relationship(secondary=user_x_students, back_populates='students', lazy='joined')
    camps: Mapped[List['CampDb']] = relationship(secondary=camp_x_students, back_populates='students', lazy='joined')

    def dict(self):
        returnVal = {}
        for key, value in StudentResponse():
            if key not in ['camps', 'guardians']:
                returnVal[key] = getattr(self, key)
        return returnVal


class ProgramDb(Base):
    __tablename__ = 'program'

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    from_grade: Mapped[int] = mapped_column(nullable=True)
    to_grade: Mapped[int] = mapped_column(nullable=True)
    tags: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)

    levels: Mapped[List['LevelDb']] = relationship(back_populates='program', lazy='raise', cascade='all, delete')
    designers: Mapped[List['UserDb']] = relationship(secondary=user_x_programs, back_populates='programs', lazy='raise')
    camps: Mapped[List['CampDb']] = relationship(back_populates='program', lazy='raise', cascade='all, delete')

    def dict(self):
        returnVal = {'grade_range': (self.from_grade, self.to_grade)}
        for key, value in ProgramResponse():
            if key != 'grade_range':
                returnVal[key] = getattr(self, key)
        return returnVal


class LevelDb(Base):
    __tablename__ = 'level'

    id: Mapped[int] = mapped_column(primary_key=True)
    program_id: Mapped[int] = mapped_column(ForeignKey('program.id'))
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)
    list_index: Mapped[int] = mapped_column(nullable=True)

    level_schedules: Mapped[List['LevelScheduleDb']] = relationship(back_populates='level', lazy='raise', cascade='all, delete')
    program: Mapped['ProgramDb'] = relationship(back_populates='levels', lazy='raise')

    def dict(self):
        returnVal = {}
        for key, value in LevelResponse():
            returnVal[key] = getattr(self, key)
        return returnVal


class CampDb(Base):
    __tablename__ = 'camp'

    id: Mapped[int] = mapped_column(primary_key=True)
    program_id: Mapped[int] = mapped_column(ForeignKey('program.id'))
    primary_instructor_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    is_published: Mapped[bool]

    program: Mapped['ProgramDb'] = relationship(back_populates='camps', lazy='joined')
    primary_instructor: Mapped['UserDb'] = relationship(lazy='joined')
    level_schedules: Mapped[List['LevelScheduleDb']] = relationship(back_populates='camp', lazy='raise', cascade='all, delete')
    instructors: Mapped[List['UserDb']] = relationship(secondary=camp_x_instructors, back_populates='camps', lazy='raise')
    students: Mapped[List['StudentDb']] = relationship(secondary=camp_x_students, back_populates='camps', lazy='raise')

    def dict(self):
        returnVal = {}
        for key, value in CampResponse():
            if key not in ['program', 'primary_instructor']:
                returnVal[key] = getattr(self, key)
        return returnVal


class LevelScheduleDb(Base):
    __tablename__ = 'level_schedule'

    camp_id: Mapped[int] = mapped_column(ForeignKey('camp.id'), primary_key=True)
    level_id: Mapped[int] = mapped_column(ForeignKey('level.id'), primary_key=True)
    start_time: Mapped[datetime] = mapped_column(nullable=True)
    end_time: Mapped[datetime] = mapped_column(nullable=True)

    camp: Mapped['CampDb'] = relationship(back_populates='level_schedules', lazy='raise')
    level: Mapped['LevelDb'] = relationship(back_populates='level_schedules', lazy='joined')

    def dict(self):
        returnVal = {}
        for key, value in LevelScheduleResponse():
            if key not in ['id', 'level']:
                returnVal[key] = getattr(self, key)
        return returnVal


async def init_db(user: str, password: str, url: str, port: str, schema_name: str, for_pytest: Optional[bool] = False):
    if for_pytest:
        # Workaround for pytest issues
        engine = create_async_engine(f'mysql+aiomysql://{user}:{password}@{url}:{port}/{schema_name}?charset=utf8mb4', poolclass=NullPool)
    else:
        engine = create_async_engine(f'mysql+aiomysql://{user}:{password}@{url}:{port}/{schema_name}?charset=utf8mb4')
    sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    return engine, sessionmaker


async def close_db(engine):
    await engine.dispose()
