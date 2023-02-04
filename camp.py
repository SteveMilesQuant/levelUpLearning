from pydantic import BaseModel
from typing import Optional, Any, List, Dict
from db import execute_read, execute_write
from datetime import datetime
from program import Program


class FastApiDatetime(datetime):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%dT%H:%M:%S')

class LevelSchedule(BaseModel):
    level_id: int
    start_time: Optional[FastApiDatetime]
    end_time: Optional[FastApiDatetime]


class CampData(BaseModel):
    program_id: Optional[int]
    primary_instructor_id: Optional[int]
    instructor_ids: Optional[List[int]]
    level_schedules: Optional[List[LevelSchedule]] = []


class CampResponse(CampData):
    id: Optional[int]


class Camp(CampResponse):
    level_schedules_lookup: Optional[Dict[int, LevelSchedule]]

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
        if result is not None:
            for row in result:
                self.instructor_ids.append(row['instructor_id'])
                if row['is_primary']:
                    self.primary_instructor_id = row['instructor_id']

        select_stmt = f'''
            SELECT level_id, start_time, end_time
                FROM camp_x_levels, level
                WHERE camp_id = {self.id} and level_id = id
                ORDER BY list_index
        '''
        result = execute_read(db, select_stmt)
        self.level_schedules = []
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

                level_schedule = LevelSchedule(level_id=row['level_id'], start_time=start_time, end_time=end_time)
                self.level_schedules.append(level_schedule)
        self.reset_level_schedules_lookup()

        return True

    def _create(self, db: Any):
        insert_stmt = f'''
            INSERT INTO camp (program_id)
                VALUES ({self.program_id});
        '''
        self.id = execute_write(db, insert_stmt)
        if self.id is None:
            return

        if self.instructor_ids is not None and len(self.instructor_ids) > 0:
            insert_stmt = f'''
                INSERT INTO camp_x_instructors (camp_id, instructor_id, is_primary)
                    VALUES
            '''
            values_list = []
            for instructor_id in self.instructor_ids:
                if instructor_id == self.primary_instructor_id:
                    is_primary = True
                else:
                    is_primary = False
                values_list.append(f'({self.id}, {instructor_id}, {is_primary})')
            insert_stmt = insert_stmt + ', '.join(values_list) + ';'
            execute_write(db, insert_stmt)

        self.update_level_schedules(db = db)

    def __init__(self, db: Any, **data):
        super().__init__(**data)
        if self.id is None:
            self._create(db = db)
        elif not self._load(db = db):
            self.id = None

    async def update_basic(self, db: Any):
        update_stmt = f'''
            UPDATE camp
                SET program_id={self.program_id}
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

    def reset_level_schedules_lookup(self):
        self.level_schedules_lookup = {}
        for level_schedule in self.level_schedules:
            self.level_schedules_lookup[level_schedule.level_id] = level_schedule

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
        delete_stmt = f'''
            DELETE FROM camp_x_instructors
                WHERE camp_id = {self.id} and instructor_id = {instructor_id};
        '''
        execute_write(db, delete_stmt)
        self.instructor_ids.remove(instructor_id)

    def make_instructor_primary(self, db: Any, instructor_id: int):
        if instructor_id == self.primary_instructor_id or instructor_id not in self.instructor_ids:
            return
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

    def update_level_schedules(self, db: Any):
        # Ensure level schedules correspond one-to-one with the program's levels
        # And is in the same order (TODO: find a faster way to sort this; fine for now)
        self.reset_level_schedules_lookup()
        program = Program(db = db, id = self.program_id)
        self.level_schedules = []
        for level_id in program.level_ids:
            level_schedule = self.level_schedules_lookup.get(level_id)
            if level_schedule is None:
                level_schedule = LevelSchedule(level_id = level_id)
            self.level_schedules.append(level_schedule)
        self.reset_level_schedules_lookup()

        delete_stmt = f'''
            DELETE FROM camp_x_levels
                WHERE camp_id = {self.id};
        '''
        execute_write(db, delete_stmt)
        insert_stmt = f'''
            INSERT INTO camp_x_levels (camp_id, level_id, start_time, end_time)
                VALUES
        '''
        values_list = []
        for level_schedule in self.level_schedules:
            values_list.append(f'({self.id}, {level_schedule.level_id}, "{level_schedule.start_time or "null"}", "{level_schedule.end_time or "null"}")')
        insert_stmt = insert_stmt + ', '.join(values_list) + ';'
        execute_write(db, insert_stmt)

    def remove_level_schedule(self, db: Any, level_id: int):
        level_schedule = self.level_schedules_lookup.pop(level_id)
        if level_schedule is None:
            return
        delete_stmt = f'''
            DELETE FROM camp_x_levels
                WHERE camp_id = {self.id} and level_id = {level_id};
        '''
        execute_write(db, delete_stmt)
        self.level_schedules.remove(level_schedule)


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

