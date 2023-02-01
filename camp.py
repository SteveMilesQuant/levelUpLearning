import copy, pandas
from pydantic import BaseModel
from typing import List, Optional, Any
from db import execute_read, execute_write


class CampData(BaseModel):
    program_id: Optional[int]
    primary_instructor_id: Optional[int]
    instructor_ids: Optional[List[int]]
    # time slot for each level


class CampResponse(CampData):
    id: Optional[int]


class Camp(CampResponse):
    def _load(self, db: Any) -> bool:
        select_stmt = f'''
            SELECT *
                FROM camp
                WHERE id = {self.id}
        '''
        result = execute_read(db, select_stmt)
        if result is None:
            return False;
        row = result[0] # should only be one
        self.program_id = row['program_id']

        select_stmt = f'''
            SELECT user_id, is_primary
                FROM camp_x_instructors
                WHERE camp_id = {self.id}
        '''
        result = execute_read(db, select_stmt)
        self.instructors.clear()
        if result is not None:
            for row in result:
                self.instructor_ids.append(row['user_id'])
                if row['is_primary']:
                    self.primary_instructor_id = row['user_id']
        return True

    def _create(self, db: Any):
        insert_stmt = f'''
            INSERT INTO camp (program_id)
                VALUES ({self.program_id});
        '''
        self.id = execute_write(db, insert_stmt)

    def __init__(self, db: Any, **data):
        super().__init__(**data)
        if self.id is None:
            self._create(db = db)
        elif not self._load(db = db):
            self._create(db = db)

    def delete(self, db: Any):
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




