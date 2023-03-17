from enum import Enum
from pydantic import BaseModel
from typing import List, Tuple, Optional, Any
import db


class LevelData(BaseModel):
    title: Optional[str]
    description: Optional[str] = ''
    list_index: Optional[int] = 0


class LevelResponse(LevelData):
    id: Optional[int]


class Level(LevelResponse):
    def __init__(self, session: Any, **data):
        super().__init__(**data)

    async def update(self, session: Any):
        pass

    def delete(self, session: Any):
        pass


class ProgramData(BaseModel):
    title: Optional[str]
    grade_range: Optional[Tuple[int, int]]
    tags: Optional[str] = ''
    description: Optional[str] = ''


class ProgramResponse(ProgramData):
    id: Optional[int]


class Program(ProgramResponse):
    level_ids: Optional[List[int]] = []

    def __init__(self, session: Any, **data):
        super().__init__(**data)

    async def update(self, session: Any):
        pass

    def delete(self, session: Any):
        pass

    def add_level(self, session: Any, level: Level):
        pass

    async def remove_level(self, session: Any, level: Level):
        pass

    def get_next_level_index(self):
        pass

    async def move_level_index(self, session: Any, level: Level, new_list_index: int):
        pass


def load_all_programs(session: Any):
    pass


