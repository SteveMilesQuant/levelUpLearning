from db import UserDb, RoleDb, EndpointDb, StudentDb, ProgramDb
from pydantic import BaseModel, PrivateAttr
from typing import Dict, List, Optional, Any
from sqlalchemy import select


class Role(BaseModel):
    name: Optional[str] = ''
    permissible_endpoints: Optional[Dict[str, str]]
    _db_obj: Optional[RoleDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[RoleDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any]):
        if self._db_obj is None:
            self._db_obj = await session.get(RoleDb, [self.name])
        self.name = self._db_obj.name

        await session.refresh(self._db_obj, ['endpoints'])
        self.permissible_endpoints = {}
        for endpoint in self._db_obj.endpoints:
            self.permissible_endpoints[endpoint.url] = endpoint.title


async def init_roles(session: Any):
    stmt = select(RoleDb)
    result = await session.execute(stmt)
    if not result.first():
        session.add_all([
            RoleDb(name='GUARDIAN', endpoints=[EndpointDb(url='/students', title='My Students'), EndpointDb(url='/camps', title='Find Camps')]),
            RoleDb(name='INSTRUCTOR', endpoints=[EndpointDb(url='/teach', title='My Camps'), EndpointDb(url='/programs', title='Design Programs')]),
            RoleDb(name='ADMIN', endpoints=[EndpointDb(url='/schedule', title='Schedule Camps'), EndpointDb(url='/members', title='Manage Members')])
        ])
        await session.commit()


class UserData(BaseModel):
    full_name: Optional[str] = ''
    email_address: Optional[str] = ''
    phone_number: Optional[str] = ''
    instructor_subjects: Optional[str] = ''
    instructor_description: Optional[str] = ''


class UserResponse(UserData):
    id: Optional[int]


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
            roles = [Role(name = 'GUARDIAN')]
            if self._db_obj.id == 1:
                roles.append(Role(name = 'INSTRUCTOR'))
                roles.append(Role(name = 'ADMIN'))
            for role in roles:
                # TODO: use asyncio.gather (figure out problem with pytest)
                await role.create(session)
                await self.add_role(session, role)
        else:
            # Otherwise, update attributes from fetched object
            for key, value in UserResponse():
                setattr(self, key, getattr(self._db_obj, key))
            self.google_id = self._db_obj.google_id

        # A couple cases require the id from the database (new or lookup by google_id)
        self.id = self._db_obj.id

    async def update(self, session: Any):
        for key, value in UserData():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.delete(self._db_obj)
        await session.commit()

    async def add_role(self, session: Any, role: Role):
        await session.refresh(self._db_obj, ['roles'])
        for db_role in self._db_obj.roles:
            if db_role.name == role.name:
                return
        self._db_obj.roles.append(role._db_obj)
        await session.commit()

    async def remove_role(self, session: Any, role: Role):
        await session.refresh(self._db_obj, ['roles'])
        self._db_obj.roles.remove(role._db_obj)
        await session.commit()

    async def roles(self, session: Any) -> List[Role]:
        await session.refresh(self._db_obj, ['roles'])
        roles = []
        for db_role in self._db_obj.roles:
            role = Role(db_obj=db_role)
            roles.append(role)
            await role.create(session) # not really async when we use db_obj
        return roles

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
        await session.refresh(student._db_obj, ['guardians'])
        if len(student._db_obj.guardians) == 0:
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


async def all_users(session: Any, by_role: Optional[str] = None):
    users = []
    if by_role:
        role = Role(name = by_role)
        await role.create(session)
        await session.refresh(role._db_obj, ['users'])
        for db_user in role.users:
            user = User(db_obj = db_user)
            await user.create(session)
            users.append(user.dict(include=UserResponse().dict()))
    else:
        stmt = select(UserDb)
        result = await session.execute(stmt)
        for db_user in result.scalars():
            user = User(db_obj = db_user)
            await user.create(session)
            users.append(user.dict(include=UserResponse().dict()))
    return users


