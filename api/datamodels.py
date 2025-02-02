from pydantic import BaseModel
from typing import Optional, Tuple, List, Literal
from datetime import date, datetime, time
from enum import Enum


class Object(object):
    pass


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


class UserPublicData(BaseModel):
    full_name: Optional[str] = ''
    instructor_subjects: Optional[str] = ''
    instructor_description: Optional[str] = ''


class UserPublicResponse(UserPublicData):
    id: Optional[int] = None


class UserData(UserPublicData):
    email_address: Optional[str] = ''
    phone_number: Optional[str] = ''
    email_verified: Optional[bool] = False
    receive_marketing_emails: Optional[bool] = True


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
    location: Optional[str]
    is_published: Optional[bool] = False
    daily_start_time: Optional[FastApiTime]
    daily_end_time: Optional[FastApiTime]
    cost: Optional[float]
    camp_type: Optional[str]
    enrollment_disabled: Optional[bool] = False
    capacity: Optional[int]


class CampData(CampCore):
    dates: Optional[List[FastApiDate]] = []

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        ret['dates'] = [f'{date}' for date in self.dates]
        return ret


class CampResponse(CampData):
    id: Optional[int]
    primary_instructor: Optional[UserPublicResponse] = None
    program: Optional[ProgramResponse] = None
    current_enrollment: Optional[int] = None

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


class SingleEnrollmentData(BaseModel):
    student_id: int
    camp_id: int


class EnrollmentData(BaseModel):
    payment_token: Optional[str] = None
    coupon_code: Optional[str] = None
    enrollments: List[SingleEnrollmentData]


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
    max_count: Optional[int] = None


class CouponResponse(CouponData):
    id: Optional[int]
    been_used: Optional[bool]


class ResourceData(BaseModel):
    title: Optional[str]
    url: Optional[str]
    list_index: Optional[int]


class ResourceResponse(ResourceData):
    id: Optional[int]
    group_id: Optional[int]


class ResourceGroupData(BaseModel):
    title: Optional[str]


class ResourceGroupResponse(ResourceGroupData):
    id: Optional[int]
    resources: Optional[List[ResourceResponse]]


class LinkData(BaseModel):
    url: Optional[str]
    text: Optional[str]


class ImageData(BaseModel):
    id: Optional[int]
    list_index: Optional[int]
    filename: Optional[str]
    filetype: Optional[str]
    image: Optional[bytes]


class EventData(BaseModel):
    title: Optional[str]
    list_index: Optional[int]
    intro: Optional[str]
    link_url: Optional[str]
    link_text: Optional[str]


class EventResponse(EventData):
    id: Optional[int]
    title_image: Optional[ImageData]
    carousel_images: Optional[List[ImageData]]
