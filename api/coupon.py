from typing import Optional, Any, List
from camp import Camp
from pydantic import PrivateAttr
from sqlalchemy import select
from datamodels import CouponData, CouponResponse
from db import CouponDb


class Coupon(CouponResponse):
    _db_obj: Optional[CouponDb] = PrivateAttr()

    def __init__(self, db_obj: Optional[CouponDb] = None, **data):
        super().__init__(**data)
        self._db_obj = db_obj

    async def create(self, session: Optional[Any], read_only: Optional[bool] = False):
        if self._db_obj is None and self.id is not None:
            # Get by ID
            self._db_obj = await session.get(CouponDb, [self.id])
            if self._db_obj is None:
                self.id = None
                return
        else:
            stmt = select(CouponDb).where(
                CouponDb.code == self.code)
            results = await session.execute(stmt)
            result = results.first()
            if result:
                self._db_obj = result[0]
            if read_only and self._db_obj is None:
                return

        if self._db_obj is None:
            # If none found, create new
            coupon_data = self.dict(
                include=CouponData().dict(exclude={'camp_ids'}))
            self._db_obj = CouponDb(**coupon_data)
            self._db_obj.camps = []
            for camp_id in self.camp_ids or []:
                camp = Camp(id=camp_id)
                await camp.create(session)
                self._db_obj.camps.append(camp._db_obj)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            await session.refresh(self._db_obj, ['camps'])
            for key, _ in CouponData():
                if key == 'camp_ids':
                    self.camp_ids = [c.id for c in self._db_obj.camps]
                else:
                    setattr(self, key, getattr(self._db_obj, key))
            self.id = self._db_obj.id

    async def update(self, session: Any):
        await session.refresh(self._db_obj, ['camps'])
        for key, _ in CouponData():
            if key == 'camp_ids':
                self._db_obj.camps = []
                for camp_id in self.camp_ids:
                    camp = Camp(id=camp_id)
                    await camp.create(session)
                    self._db_obj.camps.append(camp._db_obj)
            else:
                setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.delete(self._db_obj)
        await session.commit()

    async def tickup(self, session: Any):
        self.used_count = self.used_count + 1
        self._db_obj.used_count = self.used_count
        await session.commit()


async def all_coupons(session: Any) -> List[Coupon]:
    coupons: List[Coupon] = []
    stmt = select(CouponDb)
    result = await session.execute(stmt)
    for db_coupon in result.unique():
        user = Coupon(db_obj=db_coupon[0])
        await user.create(session)
        coupons.append(user)
    return coupons
