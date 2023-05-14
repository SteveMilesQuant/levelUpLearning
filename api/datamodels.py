from pydantic import BaseModel
from typing import Optional, Tuple, Dict, List
from datetime import date, datetime
from enum import Enum


class FastApiDate(date):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%d')


class FastApiDatetime(datetime):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%dT%H:%M:%S')


class RoleEnum(Enum):
    GUARDIAN = 0
    INSTRUCTOR = 1
    ADMIN = 2


class RoleResponse(BaseModel):
    name: Optional[str] = ''
    permissible_endpoints: Optional[Dict[str, str]]

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
    roles: Optional[List[RoleResponse]] = []

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        ret['roles'] = [role.dict() for role in self.roles]
        return ret


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


class StudentData(BaseModel):
    name: Optional[str] = None
    grade_level: Optional[int] = None


class StudentResponse(StudentData):
    id: Optional[int] = None
    camps: Optional[List[CampResponse]] = []

    def dict(self, *args, **kwargs):
        ret = super().dict(*args, **kwargs)
        ret['camps'] = [camp.dict() for camp in self.camps]
        return ret

