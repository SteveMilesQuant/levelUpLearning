from pydantic import BaseModel
from typing import Optional, Any, List, Dict
import db
from datetime import datetime
from program import Program


class FastApiDatetime(datetime):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%dT%H:%M:%S')


class LevelSchedule(BaseModel):
    start_time: Optional[FastApiDatetime]
    end_time: Optional[FastApiDatetime]


class CampData(BaseModel):
    program_id: Optional[int]
    primary_instructor_id: Optional[int]
    is_published: Optional[bool] = False


class CampResponse(CampData):
    id: Optional[int]


class Camp(CampResponse):
    instructor_ids: Optional[List[int]] = []
    student_ids: Optional[List[int]] = []
    level_schedules: Optional[Dict[int, LevelSchedule]] = {}

    def __init__(self, session: Any, **data):
        super().__init__(**data)

    async def update(self, session: Any):
        pass

    def delete(self, session: Any):
        pass

    def add_instructor(self, session: Any, instructor: Any):
        pass

    def remove_instructor(self, session: Any, instructor: Any):
        pass

    def make_instructor_primary(self, session: Any, instructor: Any):
        pass

    def add_student(self, session: Any, student: Any):
        pass

    def remove_student(self, session: Any, student: Any):
        pass

    def update_level_schedule(self, session: Any, level: Any, level_schedule: LevelSchedule):
        pass


def load_all_camps(session: Any) -> List[Camp]:
    pass

def load_all_published_camps(session: Any) -> List[Camp]:
    pass

