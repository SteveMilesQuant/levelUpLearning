from pydantic import BaseModel, PrivateAttr
from typing import Optional, Any, List, Dict
from api.db import LevelScheduleDb, CampDb, UserDb, StudentDb
from datetime import datetime
from sqlalchemy import select


class FastApiDatetime(datetime):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%dT%H:%M:%S')


class LevelScheduleData(BaseModel):
    start_time: Optional[FastApiDatetime]
    end_time: Optional[FastApiDatetime]


class LevelScheduleResponse(LevelScheduleData):
    camp_id: Optional[int]
    level_id: Optional[int]


class LevelSchedule(LevelScheduleResponse):
    _db_obj: Optional[LevelScheduleDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[LevelScheduleDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any]):
        if self._db_obj is None:
            # If none found, create new
            level_schedule_data = self.dict(include=LevelScheduleResponse().dict())
            self._db_obj = LevelScheduleDb(**level_schedule_data)
            session.add(self._db_obj)
            await session.commit()
        else:
            # Otherwise, update attributes from fetched object
            for key, value in LevelScheduleResponse():
                setattr(self, key, getattr(self._db_obj, key))

    async def update(self, session: Any):
        for key, value in LevelScheduleResponse():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.refresh(self._db_obj, ['program'])
        db_program = self._db_obj.program
        await session.refresh(self._db_obj, ['levels'])
        for db_level in db_program.levels:
            if db_level.list_index > self.list_index:
               db_level.list_index -= 1
        await session.delete(self._db_obj)
        await session.commit()


class CampData(BaseModel):
    program_id: Optional[int]
    primary_instructor_id: Optional[int]
    is_published: Optional[bool] = False


class CampResponse(CampData):
    id: Optional[int]


class Camp(CampResponse):
    _db_obj: Optional[CampDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[CampDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any]):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await session.get(CampDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return

        if self._db_obj is None:
            # If none found, create new
            camp_data = self.dict(include=CampData().dict())
            self._db_obj = CampDb(**camp_data)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id

            await session.refresh(self._db_obj, ['program', 'level_schedules'])
            db_program = self._db_obj.program
            await session.refresh(db_program, ['levels'])
            for db_level in db_program.levels:
                level_schedule = LevelSchedule(camp_id = self.id, level_id = db_level.id)
                await level_schedule.create(session)
                self._db_obj.level_schedules.append(level_schedule._db_obj)
            await session.commit()
        else:
            # Otherwise, update attributes from fetched object
            for key, value in CampResponse():
                setattr(self, key, getattr(self._db_obj, key))

    async def update(self, session: Any):
        for key, value in CampData():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.refresh(self._db_obj, ['level_schedules'])
        await session.delete(self._db_obj)
        await session.commit()

    async def add_instructor(self, session: Any, instructor: Any):
        await session.refresh(self._db_obj, ['instructors'])
        for db_instructor in self._db_obj.instructors:
            if db_instructor.id == instructor.id:
                return
        self._db_obj.instructors.append(instructor._db_obj)
        await session.commit()

    async def remove_instructor(self, session: Any, instructor: Any):
        await session.refresh(self._db_obj, ['instructors'])
        if len(self._db_obj.instructors) == 1:
            return
        self._db_obj.instructors.remove(instructor._db_obj)
        if instructor.id == self.primary_instructor_id:
            self.primary_instructor_id = self._db_obj.instructors[0].id
            self._db_obj.primary_instructor_id = self._db_obj.instructors[0].id
        await session.commit()

    async def instructors(self, session: Any) -> List[UserDb]:
        await session.refresh(self._db_obj, ['instructors'])
        return self._db_obj.instructors

    async def add_student(self, session: Any, student: Any):
        await session.refresh(self._db_obj, ['students'])
        for db_student in self._db_obj.students:
            if db_student.id == student.id:
                return
        self._db_obj.students.append(student._db_obj)
        await session.commit()

    async def remove_student(self, session: Any, student: Any):
        await session.refresh(self._db_obj, ['students'])
        self._db_obj.students.remove(student._db_obj)
        await session.refresh(student._db_obj, ['guardians', 'camps'])
        if len(student._db_obj.guardians) == 0 and len(student._db_obj.camps) == 0:
            await student.delete(session)
        await session.commit()

    async def students(self, session: Any) -> List[StudentDb]:
        await session.refresh(self._db_obj, ['students'])
        return self._db_obj.students

    async def level_schedules(self, session: Any) -> List[LevelScheduleDb]:
        await session.refresh(self._db_obj, ['level_schedules'])
        return self._db_obj.level_schedules

    async def user_authorized(self, session: Any, user: Any) -> bool:
        for role in await user.roles(session):
            if role.name == 'ADMIN':
                return True
        return (user._db_obj in await self.instructors(session))


async def all_camps(session: Any, published = None):
    if published is None:
        stmt = select(CampDb)
    else:
        stmt = select(CampDb).where(CampDb.is_published == published)
    result = await session.execute(stmt)
    camps = []
    for db_camp in result.scalars():
        camp = Camp(db_obj = db_camp)
        await camp.create(session)
        camps.append(camp.dict(include=CampResponse().dict()))
    return camps

