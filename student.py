from db import execute_read, execute_write
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import date

class FastApiDate(date):
    def __str__(self) -> str:
        return self.strftime('%Y-%m-%d')

class StudentData(BaseModel):
    name: Optional[str] = None
    birthdate: Optional[FastApiDate] = None
    grade_level: Optional[int] = None


class StudentResponse(StudentData):
    id: Optional[int] = None


class Student(StudentResponse):
    def _load(self, db: Any) -> bool:
        select_stmt = f'''
            SELECT *
                FROM student
                WHERE id = {self.id}
        '''
        result = execute_read(db, select_stmt)
        if result is None:
            return False;
        row = result[0] # should only be one
        self.name = row['name']
        year, month, day = row['birthdate'].split('-')
        self.birthdate = FastApiDate(int(year), int(month), int(day))
        self.grade_level = row['grade_level']
        return True

    def _create(self, db: Any):
        insert_stmt = f'''
            INSERT INTO student (name, birthdate, grade_level)
                VALUES ("{self.name}", "{self.birthdate}", {self.grade_level});
        '''
        self.id = execute_write(db, insert_stmt)

    def __init__(self, db: Any, **data):
        super().__init__(**data)
        if self.id is None:
            self._create(db = db)
        elif not self._load(db = db):
            self._create(db = db)

    async def update_basic(self, db: Any):
        update_stmt = f'''
            UPDATE student
                SET name="{self.name}", birthdate="{self.birthdate}",
                    grade_level={self.grade_level}
                WHERE id = {self.id};
        '''
        execute_write(db, update_stmt)

    def delete(self, db: Any):
        delete_stmt = f'''
            DELETE FROM user_x_students
                WHERE student_id = {self.id};
        '''
        execute_write(db, delete_stmt)
        delete_stmt = f'''
            DELETE FROM student
                WHERE id = {self.id};
        '''
        execute_write(db, delete_stmt)


