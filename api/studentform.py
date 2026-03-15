from pydantic import PrivateAttr
from typing import Optional, Any
from datetime import datetime, timezone
from db import StudentFormDb, PickupPersonDb
from datamodels import StudentFormData, StudentFormResponse, PickupPersonResponse


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
            pickup_persons_data = form_data.pop('pickup_persons', []) or []
            self._db_obj = StudentFormDb(**form_data)
            self._db_obj.updated_at = datetime.now(timezone.utc)
            for i, p in enumerate(pickup_persons_data):
                name = p.get('name', '') if isinstance(p, dict) else p.name
                phone = p.get('phone', '') if isinstance(p, dict) else p.phone
                self._db_obj.pickup_persons.append(
                    PickupPersonDb(name=name, phone=phone, sort_order=i))
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id
            self.updated_at = self._db_obj.updated_at.isoformat()
        else:
            # Populate from DB
            for key, _ in StudentFormResponse():
                if key not in ['student_name', 'student_grade_level', 'pickup_persons']:
                    val = getattr(self._db_obj, key)
                    if key == 'updated_at' and val is not None:
                        val = val.isoformat()
                    setattr(self, key, val)
            self.pickup_persons = [
                PickupPersonResponse(id=p.id, name=p.name,
                                     phone=p.phone, sort_order=p.sort_order)
                for p in self._db_obj.pickup_persons
            ]

        # Populate denormalized student fields
        await session.refresh(self._db_obj, ['student'])
        if self._db_obj.student:
            self.student_name = self._db_obj.student.name
            self.student_grade_level = self._db_obj.student.grade_level

    async def update(self, session: Any):
        for key, _ in StudentFormData():
            if key not in ('student_id', 'pickup_persons'):
                setattr(self._db_obj, key, getattr(self, key))
        # Replace pickup_persons: clear existing and re-insert in order
        self._db_obj.pickup_persons.clear()
        for i, p in enumerate(self.pickup_persons or []):
            name = p.get('name', '') if isinstance(p, dict) else p.name
            phone = p.get('phone', '') if isinstance(p, dict) else p.phone
            self._db_obj.pickup_persons.append(
                PickupPersonDb(name=name, phone=phone, sort_order=i))
        self._db_obj.updated_at = datetime.now(timezone.utc)
        await session.commit()
        self.updated_at = self._db_obj.updated_at.isoformat()

    async def delete(self, session: Any):
        await session.delete(self._db_obj)
        await session.commit()
