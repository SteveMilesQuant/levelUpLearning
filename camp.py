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

        select_stmt = f'''
            SELECT instructor_id, is_primary
                FROM camp_x_instructors
                WHERE camp_id = {self.id}
        '''
        result = execute_read(db, select_stmt)
        self.instructor_ids = []
        self.primary_instructor_id = None
        if result is not None:
            for row in result:
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
        if result is not None:
            for row in result:
                if row['start_time'] == 'null':
                    start_time = None
                else:
                    date, time = row['start_time'].split(' ')
                    year, month, day = date.split('-')
                    hours, minutes, seconds = time.split(':')
                    start_time = FastApiDatetime(int(year), int(month), int(day), int(hours), int(minutes), int(seconds))

                if row['end_time'] == 'null':
                    end_time = None
                else:
                    date, time = row['end_time'].split(' ')
                    year, month, day = date.split('-')
                    hours, minutes, seconds = time.split(':')
                    end_time = FastApiDatetime(int(year), int(month), int(day), int(hours), int(minutes), int(seconds))
                level_schedule = LevelSchedule(start_time=start_time, end_time=end_time)
                self.level_schedules[row['level_id']].append(level_schedule)

        return True

    def _create(self, db: Any):
        insert_stmt = f'''
            INSERT INTO camp (program_id)
                VALUES ({self.program_id});
        '''
        self.id = execute_write(db, insert_stmt)
        if self.id is None:
            return

        if self.primary_instructor_id is not None:
            primary_instructor_id = self.primary_instructor_id
            self.primary_instructor_id = None # temporarily make none, so that make_instructor_primary isn't skipped
            self.add_instructor(db = db, instructor_id = primary_instructor_id)
            self.make_instructor_primary(db = db, instructor_id = primary_instructor_id)

    def __init__(self, db: Any, **data):
        super().__init__(**data)
        if self.id is None:
            self._create(db = db)
        elif not self._load(db = db):
            self.id = None

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
        update_stmt = f'''
            UPDATE camp_x_levels
                SET start_time = {level_schedule.start_time or "null"}, end_time = {level_schedule.end_time or "null"}
                WHERE camp_id = {self.id} and level_id = {level_id};
        '''
        execute_write(db, update_stmt)


def load_all_camps(db: Any) -> List[Camp]:
    camps = []
    select_stmt = f'''
        SELECT *
            FROM camp
    '''
    result = execute_read(db, select_stmt)
    if result is not None:
        for row in result:
            camps.append(Camp(db = db, id = row['id']))
    return camps

