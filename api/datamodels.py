from pydantic import BaseModel
from typing import Optional, Tuple, List, Literal
from datetime import date, datetime, time
from enum import Enum


class FastApiDate(date):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%d')


class FastApiDatetime(datetime):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%dT%H:%M:%S')


class FastApiTime(time):
    def __str__(self) -> str:
        return self.strftime('%H:%M:%S')


class RoleEnum(Enum):
    GUARDIAN = 0
    INSTRUCTOR = 1
    ADMIN = 2


class RoleResponse(BaseModel):
    name: Optional[str] = ''

    def __eq__(self, other):
        return (self.name == other.name)

    def __lt__(self, other):
        return (RoleEnum[self.name].value < RoleEnum[other.name].value)


class UserData(BaseModel):
    full_name: Optional[str] = ''
    email_address: Optional[str] = ''
    phone_number: Optional[str] = ''
    instructor_subjects: Optional[str] = ''
    instructor_description: Optional[str] = ''


class UserResponse(UserData):
    id: Optional[int] = None
    roles: Optional[List[str]] = []


class ProgramData(BaseModel):
    title: Optional[str] = ''
    grade_range: Optional[Tuple[int, int]]
    tags: Optional[str] = ''
    description: Optional[str] = ''


class ProgramResponse(ProgramData):
    id: Optional[int]


class LevelData(BaseModel):
    title: Optional[str] = ''
    description: Optional[str] = ''
    list_index: Optional[int] = 0


class LevelResponse(LevelData):
    id: Optional[int]
    program_id: Optional[int]


class CampCore(BaseModel):
    program_id: Optional[int]
    primary_instructor_id: Optional[int]
    is_published: Optional[bool] = False
    daily_start_time: Optional[FastApiTime]
    daily_end_time: Optional[FastApiTime]
    cost: Optional[float]


class CampData(CampCore):
    dates: Optional[List[FastApiDate]] = []

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        ret['dates'] = [f'{date}' for date in self.dates]
        return ret


class CampResponse(CampData):
    id: Optional[int]
    primary_instructor: Optional[UserResponse] = None
    program: Optional[ProgramResponse] = None

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        return ret


class StudentData(BaseModel):
    name: Optional[str] = None
    grade_level: Optional[int] = None


class StudentResponse(StudentData):
    id: Optional[int] = None
    camps: Optional[List[CampResponse]] = []
    guardians: Optional[List[UserResponse]] = []

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        ret['camps'] = [camp.dict() for camp in self.camps]
        ret['guardians'] = [guardian.dict() for guardian in self.guardians]
        return ret


class SingleEnrollment(BaseModel):
    student_id: int
    camp_id: int


class EnrollmentData(BaseModel):
    payment_token: Optional[str] = None
    coupon_code: Optional[str] = None
    enrollments: List[SingleEnrollment]


class EnrollmentResponse(BaseModel):
    id: int
    guardian: Optional[UserResponse]
    student: Optional[StudentResponse]
    camp: Optional[CampResponse]
    square_receipt_number: Optional[str]
    coupon_code: Optional[str] = None


class CouponData(BaseModel):
    code: Optional[str]
    discount_type: Optional[Literal['dollars', 'percent']]
    discount_amount: Optional[int]  # in pennies or whole percent
    expiration: Optional[FastApiDate]
    used_count: Optional[int] = 0


class CouponResponse(CouponData):
    id: Optional[int]
