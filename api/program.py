from enum import Enum
from pydantic import BaseModel, PrivateAttr
from typing import List, Tuple, Optional, Any
from sqlalchemy import select
from datamodels import ProgramData, ProgramResponse, LevelResponse
from db import ProgramDb, LevelDb


class Level(LevelResponse):
    _db_obj: Optional[LevelDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[LevelDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any]):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await session.get(LevelDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return

        if self._db_obj is None:
            # If none found, create new
            level_data = self.dict(include=LevelResponse().dict())
            self._db_obj = LevelDb(**level_data)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            for key, value in LevelResponse():
                setattr(self, key, getattr(self._db_obj, key))

    async def update(self, session: Any):
        if self.list_index != self._db_obj.list_index:
            await session.refresh(self._db_obj, ['program'])
            db_program = self._db_obj.program
            await session.refresh(db_program, ['levels'])
            for db_level in db_program.levels:
                if self._db_obj.list_index < db_level.list_index <= self.list_index:
                    db_level.list_index -= 1
                elif self.list_index <= db_level.list_index < self._db_obj.list_index:
                    db_level.list_index += 1
        for key, value in LevelResponse():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.refresh(self._db_obj, ['program'])
        db_program = self._db_obj.program
        await session.refresh(db_program, ['levels'])
        for level in db_program.levels:
            if level.list_index > self.list_index:
                level.list_index -= 1
        await session.delete(self._db_obj)
        await session.commit()


class Program(ProgramResponse):
    _db_obj: Optional[ProgramDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[ProgramDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any]):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await session.get(ProgramDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return

        if self._db_obj is None:
            # If none found, create new
            program_data = self.dict(include=ProgramData().dict())
            program_data['from_grade'], program_data['to_grade'] = program_data['grade_range']
            program_data.pop('grade_range')
            self._db_obj = ProgramDb(**program_data)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            for key, value in ProgramResponse():
                if key == 'grade_range':
                    self.grade_range = (
                        self._db_obj.from_grade, self._db_obj.to_grade)
                else:
                    setattr(self, key, getattr(self._db_obj, key))

    async def update(self, session: Any):
        for key, value in ProgramData():
            if key == 'grade_range':
                self._db_obj.from_grade, self._db_obj.to_grade = self.grade_range
            else:
                setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.refresh(self._db_obj, ['levels', 'camps'])
        await session.delete(self._db_obj)
        await session.commit()

    async def levels(self, session: Any) -> List[LevelDb]:
        await session.refresh(self._db_obj, ['levels'])
        return self._db_obj.levels

    async def get_next_level_index(self, session: Any):
        next_index = 1
        for db_level in await self.levels(session):
            next_index = max(next_index, db_level.list_index + 1)
        return next_index


async def all_programs(session: Any):
    stmt = select(ProgramDb)
    result = await session.execute(stmt)
    programs = []
    for db_program in result.scalars():
        program = Program(db_obj=db_program)
        await program.create(session)
        programs.append(program.dict(include=ProgramResponse().dict()))
    return programs
