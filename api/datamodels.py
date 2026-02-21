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


class HalfDayEnum(str, Enum):
    AM = "AM"
    PM = "PM"


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
    '''Empoyee editable data'''
    full_name: Optional[str] = ''
    instructor_subjects: Optional[str] = ''
    instructor_description: Optional[str] = ''


class UserPublicResponse(UserPublicData):
    '''Employee response'''
    id: Optional[int] = None


class UserData(UserPublicData):
    '''Login user data, editable by that user'''
    email_address: Optional[str] = ''
    phone_number: Optional[str] = ''
    email_verified: Optional[bool] = False
    receive_marketing_emails: Optional[bool] = True


class UserResponse(UserData):
    '''User response, with access roles assigned by admin'''
    id: Optional[int] = None
    roles: Optional[List[str]] = []


class ProgramData(BaseModel):
    '''Program data, editable by designers'''
    title: Optional[str] = ''
    grade_range: Optional[Tuple[int, int]]
    tags: Optional[str] = ''
    description: Optional[str] = ''


class ProgramResponse(ProgramData):
    '''Program response'''
    id: Optional[int]


class LevelData(BaseModel):
    '''Program level data, editable by designers (not yet fully implemented)'''
    title: Optional[str] = ''
    description: Optional[str] = ''
    list_index: Optional[int] = 0


class LevelResponse(LevelData):
    '''Program level response'''
    id: Optional[int]
    program_id: Optional[int]


class CampCore(BaseModel):
    '''Basic editable camp data'''
    program_id: Optional[int]
    primary_instructor_id: Optional[int]
    location: Optional[str]
    is_published: Optional[bool] = False
    daily_start_time: Optional[FastApiTime]
    daily_end_time: Optional[FastApiTime]
    daily_am_end_time: Optional[FastApiTime]
    daily_pm_start_time: Optional[FastApiTime]
    cost: Optional[float]
    half_day_cost: Optional[float]
    camp_type: Optional[str]
    enrollment_disabled: Optional[bool] = False
    capacity: Optional[int]
    coupons_allowed: Optional[bool] = True
    single_day_only: Optional[bool] = False
    enroll_full_day_allowed: Optional[bool] = True
    enroll_half_day_allowed: Optional[bool] = False


class CampData(CampCore):
    '''Editable camp data, including a list of dates'''
    dates: Optional[List[FastApiDate]] = []

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        ret['dates'] = [f'{date}' for date in self.dates]
        return ret


class CampResponse(CampData):
    '''Camp response, including program and primary instructor'''
    id: Optional[int]
    primary_instructor: Optional[UserPublicResponse] = None
    program: Optional[ProgramResponse] = None
    current_enrollment: Optional[int] = None
    current_am_enrollment: Optional[int] = None
    current_pm_enrollment: Optional[int] = None

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        return ret


class StudentCampResponse(CampResponse):
    '''Camp response, plus any enrollment metadata'''
    half_day: Optional[HalfDayEnum]


class StudentData(BaseModel):
    '''User-editable student data'''
    name: Optional[str] = None
    grade_level: Optional[int] = None


class StudentResponse(StudentData):
    '''Student response, including associated camps and guardians'''
    id: Optional[int] = None
    student_camps: Optional[List[StudentCampResponse]] = []
    guardians: Optional[List[UserResponse]] = []

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        ret['student_camps'] = [student_camp.dict()
                                for student_camp in self.student_camps]
        ret['guardians'] = [guardian.dict() for guardian in self.guardians]
        return ret


class CampStudentResponse(StudentResponse):
    '''Student response, plus any enrollment metadata'''
    half_day: Optional[HalfDayEnum]


class StudentMoveData(BaseModel):
    from_camp_id: int
    to_camp_id: int


class SingleEnrollmentData(BaseModel):
    student_id: int
    camp_id: int
    half_day: Optional[HalfDayEnum]


class EnrollmentData(BaseModel):
    execute_transaction: bool  # if false, we're just checking the coupons and enrollments
    payment_token: Optional[str] = None
    coupons: List[str]
    enrollments: List[SingleEnrollmentData]


class CouponData(BaseModel):
    code: Optional[str]
    discount_type: Optional[Literal['dollars', 'percent']]
    discount_amount: Optional[int]  # in pennies or whole percent
    expiration: Optional[FastApiDate]
    used_count: Optional[int] = 0
    max_count: Optional[int] = None
    camp_ids: Optional[List[int]] = []
    applies_to_all: Optional[bool] = False
    user_can_reuse: Optional[bool] = False


class CheckoutTotal(BaseModel):
    total_cost: int  # in cents
    disc_cost: int  # in cents
    coupons: List[CouponData]


class EnrollmentResponse(BaseModel):
    id: int
    guardian: Optional[UserResponse]
    student: Optional[StudentResponse]
    camp: Optional[CampResponse]
    square_receipt_number: Optional[str]
    coupon_code: Optional[str] = None


class CouponResponse(CouponData):
    id: Optional[int]


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
    url: Optional[str]


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
