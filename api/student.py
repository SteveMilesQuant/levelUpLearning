from pydantic import PrivateAttr
from typing import Optional, Any
from db import StudentDb
from datamodels import StudentCampResponse, StudentData, StudentResponse, UserResponse
from camp import Camp
from user import User


class Student(StudentResponse):
    _db_obj: Optional[StudentDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[StudentDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any]):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await session.get(StudentDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return

        if self._db_obj is None:
            # If none found, create new
            student_data = self.dict(include=StudentData().dict())
            self._db_obj = StudentDb(**student_data)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            for key, _ in StudentResponse():
                if key not in ['student_camps', 'guardians']:
                    setattr(self, key, getattr(self._db_obj, key))

        await session.refresh(self._db_obj, ['student_camps'])
        self.student_camps = []
        for db_student_camp in self._db_obj.student_camps:
            camp = Camp(db_obj=db_student_camp.camp)
            await camp.create(session)
            self.student_camps.append(StudentCampResponse(
                **camp.dict(), half_day=db_student_camp.half_day))

        self.guardians = []
        for db_guardian in self._db_obj.guardians:
            guardian = User(db_obj=db_guardian)
            await guardian.create(session)
            self.guardians.append(UserResponse(**guardian.dict()))

    async def update(self, session: Any):
        for key, _ in StudentData():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        for db_camp_student in self._db_obj.student_camps:
            await session.delete(db_camp_student)
        await session.delete(self._db_obj)
        await session.commit()
