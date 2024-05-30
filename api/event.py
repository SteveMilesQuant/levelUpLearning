
from pydantic import PrivateAttr
from typing import Optional, Any
from sqlalchemy import select
from datamodels import EventData, EventResponse, ImageData, LinkData
from db import EventDb


class Event(EventResponse):
    _db_obj: Optional[EventDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[EventDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, db_session: Optional[Any]):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await db_session.get(EventDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return

        if self._db_obj is None:
            # If none found, create new
            event_data = self.dict(include=EventData().dict())
            self._db_obj = EventDb(**event_data)
            db_session.add(self._db_obj)
            await db_session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            for key, _ in EventResponse():
                if key not in ['title_image', 'carousel_images']:
                    setattr(self, key, getattr(self._db_obj, key))

        await db_session.refresh(self._db_obj, ['title_image', 'carousel_images'])
        if self._db_obj.title_image is not None:
            self.title_image = ImageData(**self._db_obj.title_image.dict())
        self.carousel_images = [
            ImageData(**db_image.dict()) for db_image in self._db_obj.carousel_images]

    async def update(self, db_session: Any):
        for key, _ in EventData():
            setattr(self._db_obj, key, getattr(self, key))
        await db_session.commit()

    async def delete(self, db_session: Any):
        await db_session.delete(self._db_obj)
        await db_session.commit()

    async def replace_title_image(self, db_session: Any, title_image_id: int):
        await db_session.refresh(self._db_obj, ['title_image'])
        if self._db_obj.title_image is not None:
            await db_session.delete(self._db_obj.title_image)
        self._db_obj.title_image_id = title_image_id
        await db_session.commit()

        await db_session.refresh(self._db_obj, ['title_image'])
        self.title_image = ImageData(**self._db_obj.title_image.dict())

    async def add_image(self, db_session: Any):
        pass


async def all_events(db_session: Any):
    stmt = select(EventDb)
    result = await db_session.execute(stmt)
    events = []
    for result_row in result.unique():
        event = Event(db_obj=result_row[0])
        await event.create(db_session)
        events.append(event)
    return events
