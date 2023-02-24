from pydantic import BaseModel
from typing import Optional, Any, List, Dict
from db import execute_read, execute_write
from datetime import datetime
from program import Program


class FastApiDatetime(datetime):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%dT%H:%M:%S')


class LevelSchedule(BaseModel):
    start_time: Optional[FastApiDatetime]
    end_time: Optional[FastApiDatetime]


class CampData(BaseModel):
    program_id: Optional[int]
    primary_instructor_id: Optional[int]
    is_published: Optional[bool]


class CampResponse(CampData):
    id: Optional[int]


class Camp(CampResponse):
    instructor_ids: Optional[List[int]] = []
    level_schedules: Optional[Dict[int, LevelSchedule]] = {}

    def _load(self, db: Any) -> bool:
        select_stmt = f'''
            SELECT *
                FROM camp
                WHERE id = {self.id}
        '''
        result = execute_read(db, select_stmt)
        if result is None:
            return False
        row = result[0] # should only be one
        self.program_id = row['program_id']
        if row['is_published'] == 'True':
            self.is_published = True
        else:
            self.is_published = False

        select_stmt = f'''
            SELECT instructor_id, is_primary
                FROM camp_x_instructors
                WHERE camp_id = {self.id}
        '''
        result = execute_read(db, select_stmt)
        self.instructor_ids = []
        self.primary_instructor_id = None
        for row in result or []:
            instructor_id = row['instructor_id']
            self.instructor_ids.append(instructor_id)
            if row['is_primary']:
                self.primary_instructor_id = instructor_id

        select_stmt = f'''
            SELECT level_id, start_time, end_time
                FROM camp_x_levels, level
                WHERE camp_id = {self.id} and level_id = id
                ORDER BY list_index
        '''
        result = execute_read(db, select_stmt)
        self.level_schedules = {}
        for row in result or []:
            level_id = row['level_id']
            if row['start_time'] == 'null' or row['start_time'] is None:
                start_time = None
            else:
                date, time = row['start_time'].split(' ')
                year, month, day = date.split('-')
                hours, minutes, seconds = time.split(':')
                start_time = FastApiDatetime(int(year), int(month), int(day), int(hours), int(minutes), int(seconds))

            if row['end_time'] == 'null' or row['end_time'] is None:
                end_time = None
            else:
                date, time = row['end_time'].split(' ')
                year, month, day = date.split('-')
                hours, minutes, seconds = time.split(':')
                end_time = FastApiDatetime(int(year), int(month), int(day), int(hours), int(minutes), int(seconds))
            level_schedule = LevelSchedule(start_time=start_time, end_time=end_time)
            self.level_schedules[level_id] = level_schedule

        return True

    def _create(self, db: Any):
        insert_stmt = f'''
            INSERT INTO camp (program_id, is_published)
                VALUES ({self.program_id}, {self.is_published});
        '''
        self.id = execute_write(db, insert_stmt)
        if self.id is None:
            return

        if self.primary_instructor_id is not None:
            primary_instructor_id = self.primary_instructor_id
            self.primary_instructor_id = None # temporarily make none, so that make_instructor_primary isn't skipped
            self.add_instructor(db = db, instructor_id = primary_instructor_id)
            self.make_instructor_primary(db = db, instructor_id = primary_instructor_id)

        program = Program(db = db, id = self.program_id)
        if len(program.level_ids or []) > 0:
            insert_stmt = f'''
                INSERT INTO camp_x_levels (camp_id, level_id)
                    VALUES
            '''
            for level_id in program.level_ids:
                insert_stmt += f'({self.id}, {level_id}), '
            insert_stmt = insert_stmt.rstrip()[:-1] + ';'
            execute_write(db, insert_stmt)

    def __init__(self, db: Any, **data):
        super().__init__(**data)
        if self.id is None:
            self._create(db = db)
        elif not self._load(db = db):
            self.id = None

    async def update_basic(self, db: Any):
        update_stmt = f'''
            UPDATE camp
                SET is_published="{self.is_published}"
                WHERE id = {self.id};
        '''
        execute_write(db, update_stmt)

    def delete(self, db: Any):
        delete_stmt = f'''
            DELETE FROM camp_x_levels
                WHERE camp_id = {self.id};
        '''
        execute_write(db, delete_stmt)
        delete_stmt = f'''
            DELETE FROM camp_x_instructors
                WHERE camp_id = {self.id};
        '''
        execute_write(db, delete_stmt)
        delete_stmt = f'''
            DELETE FROM camp
                WHERE id = {self.id};
        '''
        execute_write(db, delete_stmt)

    def add_instructor(self, db: Any, instructor_id: int):
        if instructor_id in self.instructor_ids:
            return

        # Check for valid user id
        select_stmt = f'''
            SELECT id
                FROM user
                WHERE id = {instructor_id}
        '''
        result = execute_read(db, select_stmt)
        if result is None:
            return

        # Insert
        self.instructor_ids.append(instructor_id)
        insert_stmt = f'''
            INSERT INTO camp_x_instructors (camp_id, instructor_id, is_primary)
                VALUES ({self.id}, {instructor_id}, 0);
        '''
        execute_write(db, insert_stmt)

    def remove_instructor(self, db: Any, instructor_id: int):
        if instructor_id not in self.instructor_ids:
            return
        was_primary = (self.primary_instructor_id == instructor_id)
        delete_stmt = f'''
            DELETE FROM camp_x_instructors
                WHERE camp_id = {self.id} and instructor_id = {instructor_id};
        '''
        execute_write(db, delete_stmt)
        self.instructor_ids.remove(instructor_id)
        if was_primary:
            if len(self.instructor_ids) == 0:
                self.primary_instructor_id = None
            else:
                self.make_instructor_primary(db = db, instructor_id = self.instructor_ids[0])

    def make_instructor_primary(self, db: Any, instructor_id: int):
        if instructor_id == self.primary_instructor_id or instructor_id not in self.instructor_ids:
            return
        if self.primary_instructor_id is not None:
            update_stmt = f'''
                UPDATE camp_x_instructors
                    SET is_primary=0
                    WHERE camp_id = {self.id} and instructor_id = {self.primary_instructor_id};
            '''
            execute_write(db, update_stmt)
        update_stmt = f'''
            UPDATE camp_x_instructors
                SET is_primary=1
                WHERE camp_id = {self.id} and instructor_id = {instructor_id};
        '''
        execute_write(db, update_stmt)
        self.primary_instructor_id = instructor_id

    def update_level_schedule(self, db: Any, level_id: int, level_schedule: LevelSchedule):
        if self.level_schedules.get(level_id) is None:
            return
        if level_schedule.start_time is None:
            start_time_str = 'null'
        else:
            start_time_str = f'"{level_schedule.start_time}"'
        if level_schedule.end_time is None:
            end_time_str = 'null'
        else:
            end_time_str = f'"{level_schedule.end_time}"'
        update_stmt = f'''
            UPDATE camp_x_levels
                SET start_time = {start_time_str}, end_time = {end_time_str}
                WHERE camp_id = {self.id} and level_id = {level_id};
        '''
        execute_write(db, update_stmt)
        self.level_schedules[level_id] = level_schedule


def load_all_camps(db: Any) -> List[Camp]:
    camps = []
    select_stmt = f'''
        SELECT *
            FROM camp
    '''
    result = execute_read(db, select_stmt)
    for row in result or []:
        camps.append(Camp(db = db, id = row['id']))
    return camps

