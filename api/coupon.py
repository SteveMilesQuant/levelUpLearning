from typing import Optional, Any, List
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
            coupon_data = self.dict(include=CouponData().dict())
            self._db_obj = CouponDb(**coupon_data)
            session.add(self._db_obj)
            await session.commit()
            self.id = self._db_obj.id
        else:
            # Otherwise, update attributes from fetched object
            for key, value in CouponResponse():
                setattr(self, key, getattr(self._db_obj, key))

    async def update(self, session: Any):
        for key, value in CouponData():
            setattr(self._db_obj, key, getattr(self, key))
        await session.commit()

    async def delete(self, session: Any):
        await session.delete(self._db_obj)
        await session.commit()

    async def tickup(self, session: Any):
        self.used_count = self.used_count + 1
        await self.update(session)


async def all_coupons(session: Any) -> List[Coupon]:
    coupons: List[Coupon] = []
    stmt = select(CouponDb)
    result = await session.execute(stmt)
    for db_coupon in result.unique():
        user = Coupon(db_obj=db_coupon[0])
        await user.create(session)
        coupons.append(user)
    return coupons
