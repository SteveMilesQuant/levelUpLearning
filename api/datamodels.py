from pydantic import BaseModel
from typing import Optional, Tuple
from datetime import date, datetime


class FastApiDate(date):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%d')


class FastApiDatetime(datetime):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%dT%H:%M:%S')


class UserData(BaseModel):
    full_name: Optional[str] = ''
    email_address: Optional[str] = ''
    phone_number: Optional[str] = ''
    instructor_subjects: Optional[str] = ''
    instructor_description: Optional[str] = ''


class UserResponse(UserData):
    id: Optional[int]


class StudentData(BaseModel):
    name: Optional[str] = None
    grade_level: Optional[int] = None


class StudentResponse(StudentData):
    id: Optional[int] = None


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


class CampData(BaseModel):
    program_id: Optional[int]
    primary_instructor_id: Optional[int]
    is_published: Optional[bool] = False


class CampResponse(CampData):
    id: Optional[int]
    primary_instructor: Optional[UserResponse] = None
    program: Optional[ProgramResponse] = None


class LevelScheduleData(BaseModel):
    start_time: Optional[FastApiDatetime]
    end_time: Optional[FastApiDatetime]


class LevelScheduleResponse(LevelScheduleData):
    camp_id: Optional[int]
    level_id: Optional[int]
    id: Optional[int]
    level: Optional[LevelResponse] = None