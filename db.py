from datetime import date
from typing import List
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy import BigInteger, Text, String
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


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

class EndpointDb(Base):
    __tablename__ = 'endpoint'

    role: Mapped[str] = mapped_column(ForeignKey('role.name'), primary_key=True)
    url: Mapped[str] = mapped_column(String(32), primary_key=True)
    title: Mapped[str] = mapped_column(Text)


class RoleDb(Base):
    __tablename__ = 'role'

    name: Mapped[str] = mapped_column(String(32), primary_key=True)
    endpoints: Mapped[List[EndpointDb]] = relationship(lazy='raise')


class UserDb(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    google_id: Mapped[str] = mapped_column(Text, nullable=False)
    full_name: Mapped[str] = mapped_column(Text)
    email_address: Mapped[str] = mapped_column(Text)
    phone_number: Mapped[str] = mapped_column(Text, nullable=True)
    instructor_subjects: Mapped[str] = mapped_column(Text, nullable=True)
    instructor_description: Mapped[str] = mapped_column(Text, nullable=True)

    roles: Mapped[List[RoleDb]] = relationship(secondary=user_x_roles, lazy='raise')
    students: Mapped[List['StudentDb']] = relationship(secondary=user_x_students, back_populates='guardians', lazy='raise')


class StudentDb(Base):
    __tablename__ = 'student'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(Text)
    birthdate: Mapped[date] = mapped_column(nullable=True)
    grade_level: Mapped[int] = mapped_column(nullable=True)

    guardians: Mapped[List[UserDb]] = relationship(secondary=user_x_students, back_populates='students', lazy='raise')


async def init_db(db_user: str, db_password: str, db_url: str, db_port: str, db_schema_name: str):
    engine = create_async_engine(f'mysql+aiomysql://{db_user}:{db_password}@{db_url}:{db_port}/{db_schema_name}?charset=utf8mb4')
    sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with sessionmaker() as session:
        pass
        # TODO: if zero observations in roles, add initial roles
    return engine, sessionmaker


async def close_db(engine):
    await engine.dispose()
