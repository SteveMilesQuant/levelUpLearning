from pydantic import PrivateAttr
from typing import Optional, Any
from sqlalchemy import select
from datamodels import ResourceResponse, ResourceGroupData, ResourceGroupResponse
from db import ResourceDb, ResourceGroupDb


class Resource(ResourceResponse):
    _db_obj: Optional[ResourceDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[ResourceDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, db_session: Optional[Any]):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await db_session.get(ResourceDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return

        if self._db_obj is None:
            # If none found, create new
            resource_data = self.dict(include=ResourceResponse().dict())
            self._db_obj = ResourceDb(**resource_data)
            db_session.add(self._db_obj)
            await db_session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            for key, _ in ResourceResponse():
                setattr(self, key, getattr(self._db_obj, key))

    async def update(self, db_session: Any):
        if self.list_index != self._db_obj.list_index:
            await db_session.refresh(self._db_obj, ['group'])
            resource_group_db = self._db_obj.group
            await db_session.refresh(resource_group_db, ['resources'])
            for resource_db in resource_group_db.resources:
                if self._db_obj.list_index < resource_db.list_index <= self.list_index:
                    resource_db.list_index -= 1
                elif self.list_index <= resource_db.list_index < self._db_obj.list_index:
                    resource_db.list_index += 1
        for key, _ in ResourceResponse():
            setattr(self._db_obj, key, getattr(self, key))
        await db_session.commit()

    async def delete(self, db_session: Any):
        await db_session.refresh(self._db_obj, ['group'])
        resource_group_db = self._db_obj.group
        await db_session.refresh(resource_group_db, ['resources'])
        for resource_db in resource_group_db.resources:
            if resource_db.list_index > self.list_index:
                resource_db.list_index -= 1
        await db_session.delete(self._db_obj)
        await db_session.commit()


class ResourceGroup(ResourceGroupResponse):
    _db_obj: Optional[ResourceGroupDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[ResourceGroupDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, db_session: Optional[Any]):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await db_session.get(ResourceGroupDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return

        if self._db_obj is None:
            # If none found, create new
            resource_group_data = self.dict(include=ResourceGroupData().dict())
            self._db_obj = ResourceGroupDb(**resource_group_data)
            db_session.add(self._db_obj)
            await db_session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            for key, _ in ResourceGroupResponse():
                if key != 'resources':
                    setattr(self, key, getattr(self._db_obj, key))

        await db_session.refresh(self._db_obj, ['resources'])
        self.resources = []
        for resource_db in self._db_obj.resources:
            resource = Resource(db_obj=resource_db)
            await resource.create(db_session)
            self.resources.append(resource)
        self.resources.sort(key=lambda r: r.list_index)

    async def update(self, db_session: Any):
        for key, _ in ResourceGroupResponse():
            if key != 'resources':
                setattr(self._db_obj, key, getattr(self, key))
        await db_session.commit()

    async def delete(self, db_session: Any):
        await db_session.delete(self._db_obj)
        await db_session.commit()


async def all_resource_groups(db_session: Any):
    stmt = select(ResourceGroupDb)
    result = await db_session.execute(stmt)
    resource_groups = []
    for result_row in result.unique():
        resource_group = ResourceGroup(db_obj=result_row[0])
        await resource_group.create(db_session)
        resource_groups.append(resource_group)
    return resource_groups
