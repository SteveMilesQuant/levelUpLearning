from pydantic import PrivateAttr
from typing import Optional, Any
from datetime import datetime, timezone
from db import StudentFormDb
from datamodels import StudentFormData, StudentFormResponse


class StudentForm(StudentFormResponse):
    _db_obj: Optional[StudentFormDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[StudentFormDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any], create_if_missing: bool = True):
        if self._db_obj is None and self.id is not None:
            self._db_obj = await session.get(StudentFormDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return

        if self._db_obj is None and self.student_id is not None:
            # Try to find by student_id
            from sqlalchemy import select
            result = await session.execute(
                select(StudentFormDb).where(
                    StudentFormDb.student_id == self.student_id)
            )
            self._db_obj = result.unique().scalar_one_or_none()

        if self._db_obj is None:
            if not create_if_missing:
                return
            # Create new
            form_data = self.dict(include=StudentFormData().dict())
            self._db_obj = StudentFormDb(**form_data)
            self._db_obj.updated_at = datetime.now(timezone.utc)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id
            self.updated_at = self._db_obj.updated_at.isoformat()
        else:
            # Populate from DB
            for key, _ in StudentFormResponse():
                if key not in ['student_name', 'student_grade_level']:
                    val = getattr(self._db_obj, key)
                    if key == 'updated_at' and val is not None:
                        val = val.isoformat()
                    setattr(self, key, val)

        # Populate denormalized student fields
        await session.refresh(self._db_obj, ['student'])
        if self._db_obj.student:
            self.student_name = self._db_obj.student.name
            self.student_grade_level = self._db_obj.student.grade_level

    async def update(self, session: Any):
        for key, _ in StudentFormData():
            if key != 'student_id':
                setattr(self._db_obj, key, getattr(self, key))
        self._db_obj.updated_at = datetime.now(timezone.utc)
        await session.commit()
        self.updated_at = self._db_obj.updated_at.isoformat()

    async def delete(self, session: Any):
        await session.delete(self._db_obj)
        await session.commit()
