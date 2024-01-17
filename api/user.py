from pydantic import PrivateAttr
from typing import List, Optional, Any
from sqlalchemy import select
from datamodels import RoleEnum, RoleResponse, UserData, UserResponse
from db import UserDb, RoleDb, StudentDb, ProgramDb, CampDb


class Role(RoleResponse):
    _db_obj: Optional[RoleDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[RoleDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any]):
        if self._db_obj is None:
            self._db_obj = await session.get(RoleDb, [self.name])
            if self._db_obj is None:
                self.name = None
                return
        self.name = self._db_obj.name


async def init_roles(session: Any):
    stmt = select(RoleDb)
    result = await session.execute(stmt)
    if not result.first():
        session.add_all([
            RoleDb(name='GUARDIAN'),
            RoleDb(name='INSTRUCTOR'),
            RoleDb(name='ADMIN')
        ])
        await session.commit()


class User(UserResponse):
    google_id: Optional[str] = ''
    _db_obj: Optional[UserDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[UserDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any]):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await session.get(UserDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return
        else:
            # Get by google id
            stmt = select(UserDb).where(UserDb.google_id == self.google_id)
            results = await session.execute(stmt)
            result = results.first()
            if result:
                self._db_obj = result[0]

        if self._db_obj is None:
            # If none found, create new user
            data = self.dict(include=UserData().dict())
            data['google_id'] = self.google_id
            self._db_obj = UserDb(**data)
            session.add(self._db_obj)
            await session.commit()

            # Create initial role(s)
            # again, not sure why I have to do this when I have lazy='joined'
            await session.refresh(self._db_obj, ['roles'])
            roles = ['GUARDIAN']
            if self._db_obj.id == 1:
                roles.append('INSTRUCTOR')
                roles.append('ADMIN')
            for role in roles:
                await self.add_role(session, role)
        else:
            # Otherwise, update attributes from fetched object
            for key, value in UserResponse():
                if key != 'roles':
                    setattr(self, key, getattr(self._db_obj, key))
            self.google_id = self._db_obj.google_id

            self.roles = []
            for db_role in self._db_obj.roles:
                role = Role(db_obj=db_role)
                # not really async when we use db_obj
                await role.create(session)
                self.roles.append(role.name)
            self.roles.sort(key=lambda role: RoleEnum[role].value)

        # A couple cases require the id from the database (new or lookup by google_id)
        self.id = self._db_obj.id

    async def update(self, session: Any):
        for key, value in UserData():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.delete(self._db_obj)
        await session.commit()

    async def add_role(self, session: Any, role_name: str):
        if role_name in self.roles:
            return
        role = Role(name=role_name)
        await role.create(session)
        self._db_obj.roles.append(role._db_obj)
        await session.commit()
        self.roles.append(role_name)
        self.roles.sort(key=lambda role: RoleEnum[role].value)

    async def remove_role(self, session: Any, role_name: str):
        if role_name not in self.roles:
            return
        role = Role(name=role_name)
        await role.create(session)
        self._db_obj.roles.remove(role._db_obj)
        await session.commit()
        self.roles.remove(role_name)

    def has_role(self, role_name: str) -> bool:
        return (role_name in self.roles)

    async def add_student(self, session: Any, student: Any):
        await session.refresh(self._db_obj, ['students'])
        for db_student in self._db_obj.students:
            if db_student.id == student.id:
                return
        self._db_obj.students.append(student._db_obj)
        await session.commit()

    async def remove_student(self, session: Any, student: Any):
        await session.refresh(self._db_obj, ['students'])
        self._db_obj.students.remove(student._db_obj)
        if len(student._db_obj.guardians) == 0:
            student.camps = []
            await student.delete(session)
        await session.commit()

    async def students(self, session: Any) -> List[StudentDb]:
        await session.refresh(self._db_obj, ['students'])
        return self._db_obj.students

    async def add_program(self, session: Any, program: Any):
        await session.refresh(self._db_obj, ['programs'])
        for db_program in self._db_obj.programs:
            if db_program.id == program.id:
                return
        self._db_obj.programs.append(program._db_obj)
        await session.commit()

    async def remove_program(self, session: Any, program: Any):
        await session.refresh(self._db_obj, ['programs'])
        self._db_obj.programs.remove(program._db_obj)
        await session.refresh(program._db_obj, ['designers', 'camps'])
        if len(program._db_obj.designers) == 0 and len(program._db_obj.camps) == 0:
            await program.delete(session)
        await session.commit()

    async def programs(self, session: Any) -> List[ProgramDb]:
        await session.refresh(self._db_obj, ['programs'])
        return self._db_obj.programs

    async def camps(self, session: Any) -> List[CampDb]:
        await session.refresh(self._db_obj, ['camps'])
        return self._db_obj.camps


async def all_users(session: Any, by_role: Optional[str] = None):
    users = []
    if by_role:
        role = Role(name=by_role)
        await role.create(session)
        await session.refresh(role._db_obj, ['users'])
        for db_user in role._db_obj.users:
            user = User(db_obj=db_user)
            await user.create(session)
            users.append(user)
    else:
        stmt = select(UserDb)
        result = await session.execute(stmt)
        for db_user in result.unique():
            user = User(db_obj=db_user[0])
            await user.create(session)
            users.append(user)
    return users
