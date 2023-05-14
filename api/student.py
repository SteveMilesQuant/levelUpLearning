from pydantic import BaseModel, PrivateAttr
from typing import Dict, List, Optional, Any
from datetime import date
from db import StudentDb, UserDb, CampDb
from datamodels import StudentData, StudentResponse, CampResponse
from camp import Camp


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
            for key, value in StudentResponse():
                if key != 'camps':
                    setattr(self, key, getattr(self._db_obj, key))

        self.camps = []
        await session.refresh(self._db_obj, ['camps'])
        for db_camp in self._db_obj.camps:
            camp = Camp(db_obj = db_camp)
            await camp.create(session)
            self.camps.append(CampResponse(**camp.dict()))

    async def update(self, session: Any):
        for key, value in StudentData():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.delete(self._db_obj)
        await session.commit()

    async def guardians(self, session: Any) -> List[UserDb]:
        await session.refresh(self._db_obj, ['guardians'])
        return self._db_obj.guardians


