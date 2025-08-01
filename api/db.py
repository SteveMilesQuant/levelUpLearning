from datetime import date as dt_date, time
from typing import Optional, List
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy import Text, String, Date, Time
from sqlalchemy.types import LargeBinary
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.pool import NullPool
from datamodels import FastApiDate, UserResponse, StudentResponse, ProgramResponse, LevelResponse, CampResponse, ImageData


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

event_x_images = Table(
    'event_x_images',
    Base.metadata,
    Column('event_id', ForeignKey('event.id'), primary_key=True),
    Column('image_id', ForeignKey('image.id'), primary_key=True),
)

coupon_x_camps = Table(
    'coupon_x_camps',
    Base.metadata,
    Column('coupon_id', ForeignKey('coupon.id'), primary_key=True),
    Column('camp_id', ForeignKey('camp.id'), primary_key=True),
)


class RoleDb(Base):
    __tablename__ = 'role'

    name: Mapped[str] = mapped_column(String(32), primary_key=True)

    users: Mapped[List['UserDb']] = relationship(
        secondary=user_x_roles, back_populates='roles', lazy='raise')


class UserDb(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    google_id: Mapped[str] = mapped_column(Text, nullable=False)
    full_name: Mapped[str] = mapped_column(Text)
    email_address: Mapped[str] = mapped_column(Text)
    phone_number: Mapped[str] = mapped_column(Text, nullable=True)
    instructor_subjects: Mapped[str] = mapped_column(Text, nullable=True)
    instructor_description: Mapped[str] = mapped_column(Text, nullable=True)
    email_verified: Mapped[bool]
    receive_marketing_emails: Mapped[bool]

    roles: Mapped[List[RoleDb]] = relationship(
        secondary=user_x_roles, back_populates='users', lazy='joined')
    students: Mapped[List['StudentDb']] = relationship(
        secondary=user_x_students, back_populates='guardians', lazy='raise')
    programs: Mapped[List['ProgramDb']] = relationship(
        secondary=user_x_programs, back_populates='designers', lazy='raise')
    camps: Mapped[List['CampDb']] = relationship(
        secondary=camp_x_instructors, back_populates='instructors', lazy='raise')

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

    guardians: Mapped[List['UserDb']] = relationship(
        secondary=user_x_students, back_populates='students', lazy='joined')
    camps: Mapped[List['CampDb']] = relationship(
        secondary=camp_x_students, back_populates='students', lazy='joined')

    def dict(self):
        returnVal = {}
        for key, _ in StudentResponse():
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

    levels: Mapped[List['LevelDb']] = relationship(
        back_populates='program', lazy='raise', cascade='all, delete')
    designers: Mapped[List['UserDb']] = relationship(
        secondary=user_x_programs, back_populates='programs', lazy='raise')
    camps: Mapped[List['CampDb']] = relationship(
        back_populates='program', lazy='raise', cascade='all, delete')

    def dict(self):
        returnVal = {'grade_range': (self.from_grade, self.to_grade)}
        for key, _ in ProgramResponse():
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

    program: Mapped['ProgramDb'] = relationship(
        back_populates='levels', lazy='raise')

    def dict(self):
        returnVal = {}
        for key, _ in LevelResponse():
            returnVal[key] = getattr(self, key)
        return returnVal


class CampDateDb(Base):
    __tablename__ = 'camp_x_dates'

    date: Mapped[dt_date] = mapped_column(Date, primary_key=True)
    camp_id: Mapped[int] = mapped_column(
        ForeignKey('camp.id'), primary_key=True)

    def __str__(self) -> str:
        fastApiDate = FastApiDate(
            self.date.year, self.date.month, self.date.day)
        return f'{fastApiDate}'


class CampDb(Base):
    __tablename__ = 'camp'

    id: Mapped[int] = mapped_column(primary_key=True)
    program_id: Mapped[int] = mapped_column(ForeignKey('program.id'))
    primary_instructor_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    location: Mapped[Text] = mapped_column(Text, nullable=True)
    is_published: Mapped[bool]
    daily_start_time: Mapped[time] = mapped_column(Time, nullable=True)
    daily_end_time: Mapped[time] = mapped_column(Time, nullable=True)
    cost: Mapped[float] = mapped_column(nullable=True)
    camp_type: Mapped[str] = mapped_column(Text, nullable=True)
    enrollment_disabled: Mapped[bool] = mapped_column(nullable=True)
    capacity: Mapped[int] = mapped_column(nullable=True)

    program: Mapped['ProgramDb'] = relationship(
        back_populates='camps', lazy='joined')
    primary_instructor: Mapped['UserDb'] = relationship(lazy='joined')
    dates: Mapped[List['CampDateDb']] = relationship(
        lazy='joined', cascade='all, delete')
    instructors: Mapped[List['UserDb']] = relationship(
        secondary=camp_x_instructors, back_populates='camps', lazy='raise')
    students: Mapped[List['StudentDb']] = relationship(
        secondary=camp_x_students, back_populates='camps', lazy='raise')

    def dict(self):
        returnVal = {}
        for key, _ in CampResponse():
            if key not in ['program', 'primary_instructor', 'start_time', 'current_enrollment']:
                returnVal[key] = getattr(self, key)
        return returnVal


class PaymentRecordDb(Base):
    __tablename__ = 'payment_record'

    id: Mapped[int] = mapped_column(primary_key=True)
    square_payment_id: Mapped[Text] = mapped_column(Text, nullable=True)
    square_order_id: Mapped[Text] = mapped_column(Text, nullable=True)
    square_receipt_number: Mapped[Text] = mapped_column(Text, nullable=True)
    coupon_id: Mapped[int] = mapped_column(
        ForeignKey('coupon.id'), nullable=True)
    camp_id: Mapped[int] = mapped_column(ForeignKey('camp.id'))
    student_id: Mapped[int] = mapped_column(ForeignKey('student.id'))
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    total_cost: Mapped[int] = mapped_column(nullable=True)
    disc_cost: Mapped[int] = mapped_column(nullable=True)


class CouponDb(Base):
    __tablename__ = 'coupon'

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[Text] = mapped_column(Text)
    discount_type: Mapped[Text] = mapped_column(Text)
    discount_amount: Mapped[int] = mapped_column()
    expiration: Mapped[dt_date] = mapped_column(Date, nullable=True)
    used_count: Mapped[int] = mapped_column(default=0)
    max_count: Mapped[int] = mapped_column(nullable=True)
    camps: Mapped[List['CampDb']] = relationship(
        secondary=coupon_x_camps, lazy='raise')


class ResourceDb(Base):
    __tablename__ = 'resource'

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey('resource_group.id'))
    list_index: Mapped[int] = mapped_column()
    title: Mapped[Text] = mapped_column(Text)
    url: Mapped[Text] = mapped_column(Text)

    group: Mapped[List['ResourceGroupDb']] = relationship(
        back_populates='resources', lazy='joined')


class ResourceGroupDb(Base):
    __tablename__ = 'resource_group'

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[Text] = mapped_column(Text)

    resources: Mapped[List['ResourceDb']] = relationship(
        back_populates='group', lazy='joined', cascade='all, delete')


class ImageDb(Base):
    __tablename__ = 'image'

    id: Mapped[int] = mapped_column(primary_key=True)
    list_index: Mapped[int] = mapped_column(nullable=True)
    filename: Mapped[Text] = mapped_column(Text)
    filetype: Mapped[Text] = mapped_column(Text)
    image: Mapped[LargeBinary] = mapped_column(LargeBinary(length=(2**32)-1))

    def dict(self):
        returnVal = {}
        for key, _ in ImageData():
            returnVal[key] = getattr(self, key)
        return returnVal


class EventDb(Base):
    __tablename__ = 'event'

    id: Mapped[int] = mapped_column(primary_key=True)
    title_image_id: Mapped[int] = mapped_column(
        ForeignKey('image.id'), nullable=True)
    list_index: Mapped[int] = mapped_column()
    title: Mapped[Text] = mapped_column(Text)
    intro: Mapped[Text] = mapped_column(Text, nullable=True)
    link_url: Mapped[Text] = mapped_column(Text, nullable=True)
    link_text: Mapped[Text] = mapped_column(Text, nullable=True)

    title_image: Mapped['ImageDb'] = relationship(
        lazy='joined', cascade="all, delete-orphan", single_parent=True)
    carousel_images: Mapped[List['ImageDb']] = relationship(
        secondary=event_x_images, lazy='raise', cascade="all, delete-orphan", single_parent=True)


async def init_db(user: str, password: str, url: str, port: str, schema_name: str, for_pytest: Optional[bool] = False):
    if for_pytest:
        # Workaround for pytest issues
        engine = create_async_engine(
            f'mysql+aiomysql://{user}:{password}@{url}:{port}/{schema_name}?charset=utf8mb4', poolclass=NullPool)
    else:
        engine = create_async_engine(
            f'mysql+aiomysql://{user}:{password}@{url}:{port}/{schema_name}?charset=utf8mb4')
    sessionmaker = async_sessionmaker(engine, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    return engine, sessionmaker


async def close_db(engine):
    await engine.dispose()
