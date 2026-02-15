from pydantic import PrivateAttr
from typing import Optional, Any, List
from calendar import month_name
from datamodels import CampData, CampResponse, HalfDayEnum
from datamodels import UserResponse, ProgramResponse
from db import CampDb, CampDateDb, CampStudentDb, UserDb
from datetime import date, datetime
from sqlalchemy import select


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
            del camp_data['dates']
            self._db_obj = CampDb(**camp_data)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id

            for date in self.dates:
                if isinstance(date, str):
                    date = datetime.strptime(date, '%Y-%m-%d').date()
                dbDate = CampDateDb(camp_id=self.id, date=date)
                session.add(dbDate)

            # not sure why I have to refresh program here
            await session.refresh(self._db_obj, ['program'])
            await session.refresh(self._db_obj.program, ['levels'])
            await session.commit()

            await session.refresh(self._db_obj, ['instructors'])
            self._db_obj.instructors.append(self._db_obj.primary_instructor)
            await session.commit()
        else:
            # Otherwise, update attributes from fetched object
            for key, value in self._db_obj.dict().items():
                if key == 'dates':
                    self.dates = [dbDate.date for dbDate in self._db_obj.dates]
                else:
                    setattr(self, key, value)

        # Always get the associated primary instructor, program, and start time
        self.primary_instructor = UserResponse(
            **self._db_obj.primary_instructor.dict())
        self.program = ProgramResponse(**self._db_obj.program.dict())

        await session.refresh(self._db_obj, ['camp_students'])
        self.current_am_enrollment = sum(
            1 for cs in (self._db_obj.camp_students or [])
            if cs.half_day != HalfDayEnum.PM
        )
        self.current_pm_enrollment = sum(
            1 for cs in (self._db_obj.camp_students or [])
            if cs.half_day != HalfDayEnum.AM
        )
        self.current_enrollment = max(
            self.current_am_enrollment, self.current_pm_enrollment
        )

    async def update(self, session: Any):
        if self.single_day_only:
            self.enroll_full_day_allowed = False
            self.enroll_half_day_allowed = False
        for dbDate in self._db_obj.dates:
            await session.delete(dbDate)
        await session.commit()
        for date in self.dates:
            if isinstance(date, str):
                date = datetime.strptime(date, '%Y-%m-%d').date()
            dbDate = CampDateDb(camp_id=self.id, date=date)
            session.add(dbDate)
        for key, _ in CampData():
            if key != 'dates':
                setattr(self._db_obj, key, getattr(self, key))
        await session.commit()
        if self.primary_instructor_id != self.primary_instructor.id:
            await session.refresh(self._db_obj, ['primary_instructor'])
            self.primary_instructor = UserResponse(
                **self._db_obj.primary_instructor.dict())

    async def delete(self, session: Any):
        await session.refresh(self._db_obj, ['camp_students'])
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
            self.primary_instructor = UserResponse(
                **self._db_obj.primary_instructor.dict())
        await session.commit()

    async def instructors(self, session: Any) -> List[UserDb]:
        await session.refresh(self._db_obj, ['instructors'])
        return self._db_obj.instructors

    async def add_student(self, session: Any, student: Any, half_day: Optional[HalfDayEnum]):
        await session.refresh(self._db_obj, ['camp_students'])
        for db_camp_student in self._db_obj.camp_students:
            if db_camp_student.student.id == student.id:
                return
        dbCampStudent = CampStudentDb(
            camp_id=self.id, student_id=student.id, half_day=half_day)
        session.add(dbCampStudent)
        await session.commit()

    async def remove_student(self, session: Any, student: Any):
        await session.refresh(self._db_obj, ['camp_students'])
        for db_camp_student in self._db_obj.camp_students:
            if db_camp_student.student.id == student.id:
                await session.delete(db_camp_student)
        await session.commit()

    async def camp_students(self, session: Any) -> List[CampStudentDb]:
        await session.refresh(self._db_obj, ['camp_students'])
        return self._db_obj.camp_students

    async def user_authorized(self, session: Any, user: Any) -> bool:
        if user.has_role('ADMIN'):
            return True
        return (user._db_obj in await self.instructors(session))

    def date_range(self) -> str:
        if len(self.dates) == 1:
            return self.dates[0]
        prev_date = None
        consecutive_dates = True
        for date in self.dates:
            if prev_date is not None:
                delta = date-prev_date
                if delta.days != 1:
                    consecutive_dates = False
                    break
            prev_date = date
        if not consecutive_dates:
            return ', '.join([f'{month_name[date.month]} {date.day}' if i < len(self.dates)-1 else f'and {month_name[date.month]} {date.day}' for i, date in enumerate(self.dates)])
        from_date = self.dates[0]
        to_date = self.dates[len(self.dates)-1]
        return f'{month_name[from_date.month]} {from_date.day}-{month_name[to_date.month]} {to_date.day}'

    def daily_time_range(self) -> str:
        start = self.daily_start_time
        end = self.daily_end_time
        start_hour = start.hour
        if start_hour > 12:
            start_hour = start_hour - 12
        end_hour = end.hour
        if end_hour > 12:
            end_hour = end_hour - 12
        return f"{start_hour}{start.strftime(':%M%p')}-{end_hour}{end.strftime(':%M%p')}"


def camp_sort(camp: Camp) -> date:
    if len(camp.dates) > 0:
        return camp.dates[0]
    return date.min


async def all_camps(session: Any, is_published=None, enroll_full_day_allowed=None, enroll_half_day_allowed=None, single_day_only=None):
    stmt = select(CampDb)
    if is_published is not None:
        stmt = stmt.where(CampDb.is_published == is_published)
    if enroll_full_day_allowed is not None:
        stmt = stmt.where(
            CampDb.enroll_full_day_allowed == enroll_full_day_allowed)
    if enroll_half_day_allowed is not None:
        stmt = stmt.where(
            CampDb.enroll_half_day_allowed == enroll_half_day_allowed)
    if single_day_only is not None:
        stmt = stmt.where(CampDb.single_day_only == single_day_only)
    result = await session.execute(stmt)
    camps = []
    for db_camp in result.unique():
        camp = Camp(db_obj=db_camp[0])
        await camp.create(session)
        camps.append(camp)
    camps.sort(key=camp_sort)
    return camps
