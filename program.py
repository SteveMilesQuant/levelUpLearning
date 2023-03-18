from enum import Enum
from pydantic import BaseModel, PrivateAttr
from typing import List, Tuple, Optional, Any
from db import ProgramDb, LevelDb


class LevelData(BaseModel):
    title: Optional[str] = ''
    description: Optional[str] = ''
    list_index: Optional[int] = 0


class LevelResponse(LevelData):
    id: Optional[int]


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
            level_data = self.dict(include=LevelData().dict())
            self._db_obj = LevelDb(**level_data)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            for key, value in LevelResponse():
                setattr(self, key, getattr(self._db_obj, key))

    async def update(self, session: Any):
        for key, value in LevelData():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.delete(self._db_obj)
        await session.commit()


class ProgramData(BaseModel):
    title: Optional[str] = ''
    grade_range: Optional[Tuple[int, int]]
    tags: Optional[str] = ''
    description: Optional[str] = ''


class ProgramResponse(ProgramData):
    id: Optional[int]


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
                    self.grade_range = (self._db_obj.from_grade, self._db_obj.to_grade)
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
        await session.refresh(self._db_obj, ['levels'])
        await session.delete(self._db_obj)
        await session.commit()

    async def add_level(self, session: Any, level: Any):
        await session.refresh(self._db_obj, ['levels'])
        for db_level in self._db_obj.levels:
            if db_level.id == level.id:
                return
        self._db_obj.levels.append(level._db_obj)
        await session.commit()

    async def remove_level(self, session: Any, level: Any):
        await session.refresh(self._db_obj, ['levels'])
        self._db_obj.levels.remove(level._db_obj)
        await session.commit()

    async def levels(self, session: Any) -> List[LevelDb]:
        await session.refresh(self._db_obj, ['levels'])
        return self._db_obj.levels

    async def get_next_level_index(self, session: Any):
        next_index = 1
        for db_level in await self.levels(session):
            next_index = max(next_index, db_level.list_index + 1)
        return next_index

    async def move_level_index(self, session: Any, level: Level, new_list_index: int):
        if level.list_index == new_list_index:
            return
        # await session.refresh(self._db_obj, ['levels']) -- there isn't currently a context where we need to do this
        for db_level in self._db_obj.levels:
            if level.list_index < db_level.list_index <= new_list_index:
                db_level.list_index -= 1
            elif new_list_index <= db_level.list_index < level.list_index:
                db_level.list_index += 1
        await session.commit()


async def all_programs(session: Any):
    stmt = select(ProgramDb)
    result = await session.execute(stmt)
    programs = []
    for db_program in result.scalars():
        program = Program(db_obj = db_program)
        await program.create(session)
        programs.append(program.dict(include=ProgramResponse().dict()))
    return programs


