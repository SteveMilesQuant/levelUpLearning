from enum import Enum
from pydantic import BaseModel
from typing import List, Tuple, Optional, Any
from db import execute_read, execute_write


class LevelData(BaseModel):
    title: Optional[str]
    description: Optional[str] = ''
    list_index: Optional[int] = 0


class LevelResponse(LevelData):
    id: Optional[int]


class Level(LevelResponse):
    def _load(self, db: Any) -> bool:
        select_stmt = f'''
            SELECT *
                FROM level
                WHERE id = {self.id}
        '''
        result = execute_read(db, select_stmt)
        if result is None:
            return False
        row = result[0] # should only be one
        self.title = row['title']
        self.description = row['description']
        self.list_index = row['list_index']
        return True

    def _create(self, db: Any):
        insert_stmt = f'''
            INSERT INTO level (title, description, list_index)
                VALUES ("{self.title}", "{self.description}", {self.list_index});
        '''
        self.id = execute_write(db, insert_stmt)

    def __init__(self, db: Any, **data):
        super().__init__(**data)
        if self.id is None:
            self._create(db = db)
        elif not self._load(db = db):
            self.id = None

    async def update_basic(self, db: Any):
        update_stmt = f'''
            UPDATE level
                SET title="{self.title}",
                    description="{self.description}",
                    list_index={self.list_index}
                WHERE id = {self.id};
        '''
        execute_write(db, update_stmt)

    def delete(self, db: Any):
        delete_stmt = f'''
            DELETE FROM program_x_levels
                WHERE level_id = {self.id};
        '''
        execute_write(db, delete_stmt)
        delete_stmt = f'''
            DELETE FROM camp_x_levels
                WHERE level_id = {self.id};
        '''
        execute_write(db, delete_stmt)
        delete_stmt = f'''
            DELETE FROM level
                WHERE id = {self.id};
        '''
        execute_write(db, delete_stmt)


class ProgramData(BaseModel):
    title: Optional[str]
    grade_range: Optional[Tuple[int, int]]
    tags: Optional[str] = ''
    description: Optional[str] = ''


class ProgramResponse(ProgramData):
    id: Optional[int]


class Program(ProgramResponse):
    level_ids: Optional[List[int]] = []

    def _load(self, db: Any) -> bool:
        select_stmt = f'''
            SELECT *
                FROM program
                WHERE id = {self.id}
        '''
        result = execute_read(db, select_stmt)
        if result is None:
            return False;
        row = result[0] # should only be one
        self.title = row['title']
        self.grade_range = (row['from_grade'], row['to_grade'])
        self.tags = row['tags']
        self.description = row['description']

        select_stmt = f'''
            SELECT level_id
                FROM program_x_levels, level
                WHERE program_id = {self.id} and level_id = id
                ORDER BY list_index
        '''
        result = execute_read(db, select_stmt)
        self.level_ids = [row['level_id'] for row in result or []]
        return True

    def _create(self, db: Any):
        self.tags = self.tags.lower()
        insert_stmt = f'''
            INSERT INTO program (title, from_grade, to_grade, tags, description)
                VALUES ("{self.title}", {self.grade_range[0]}, {self.grade_range[1]}, "{self.tags}", "{self.description}");
        '''
        self.id = execute_write(db, insert_stmt)

    def __init__(self, db: Any, **data):
        super().__init__(**data)
        if self.id is None:
            self._create(db = db)
        elif not self._load(db = db):
            self.id = None

    async def update_basic(self, db: Any):
        update_stmt = f'''
            UPDATE program
                SET title="{self.title}",
                    from_grade={self.grade_range[0]},
                    to_grade={self.grade_range[1]},
                    tags="{self.tags}",
                    description="{self.description}"
                WHERE id = {self.id};
        '''
        execute_write(db, update_stmt)

    def delete(self, db: Any):
        # Levels are not shared across programs, so they are safe to delete when we delete the program
        delete_stmt = f'''
            DELETE FROM user_x_programs
                WHERE program_id = {self.id};
        '''
        execute_write(db, delete_stmt)
        delete_stmt = f'''
            DELETE FROM program_x_levels
                WHERE program_id = {self.id};
        '''
        execute_write(db, delete_stmt)
        delete_stmt = f'''
            DELETE FROM program
                WHERE id = {self.id};
        '''
        execute_write(db, delete_stmt)

    def add_level(self, db: Any, level_id: int):
        if level_id not in self.level_ids:
            self.level_ids.append(level_id)
            insert_stmt = f'''
                INSERT INTO program_x_levels (program_id, level_id)
                    VALUES ({self.id}, "{level_id}");
            '''
            execute_write(db, insert_stmt)

            select_stmt = f'''
                SELECT id
                    FROM camp
                    WHERE program_id = {self.id}
            '''
            result = execute_read(db, select_stmt)
            for row in result or []:
                camp_id = row['id']
                insert_stmt = f'''
                    INSERT INTO camp_x_levels (camp_id, level_id)
                        VALUES ({camp_id}, "{level_id}");
                '''
                execute_write(db, insert_stmt)

    async def remove_level(self, db: Any, level_id: int):
        try:
            self.level_ids.remove(level_id)
        except ValueError:
            return
        del_level = Level(db = db, id = level_id)
        for level_id in self.level_ids:
            level = Level(db = db, id = level_id)
            if level.list_index > del_level.list_index:
                level.list_index = level.list_index - 1
                await level.update_basic(db = db)
        del_level.delete(db = db)

    def get_next_level_index(self):
        return len(self.level_ids)+1

    async def move_level_index(self, db: Any, level_id: int, new_list_index: int):
        if level_id not in self.level_ids:
            return
        move_level = Level(db = db, id = level_id)
        if move_level is not None and new_list_index != move_level.list_index:
            for level_id in self.level_ids:
                level = Level(db = db, id = level_id)
                if new_list_index <= level.list_index < move_level.list_index:
                    level.list_index = level.list_index + 1
                    await level.update_basic(db = db)
                elif move_level.list_index < level.list_index <= new_list_index:
                    level.list_index = level.list_index - 1
                    await level.update_basic(db = db)
            move_level.list_index = new_list_index
            await move_level.update_basic(db = db)





