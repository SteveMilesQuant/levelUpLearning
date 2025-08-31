import os
import sys
import asyncio
from main import app
from db import UserDb, StudentDb, CampDb, CampDateDb
from datetime import date, timedelta
from camp import Camp
from sqlalchemy import select, func
from emailserver import EmailServer
from enrollment import CONFIRMATION_SENDER_EMAIL_KEY


def next_saturday(d):
    days_ahead = (5 - d.weekday()) % 7  # Saturday is weekday 5 (Mon=0...Sun=6)
    # if today is Saturday, go to next Saturday
    days_ahead = 7 if days_ahead == 0 else days_ahead
    return d + timedelta(days=days_ahead)


async def email_reminders():
    await app.router.on_startup[0]()
    async with app.db_sessionmaker() as db_session:
        start_saturday = next_saturday(date.today())
        end_friday = start_saturday + timedelta(days=6)
        eligible_camp_ids = (
            select(CampDb.id)
            .join(CampDb.dates)
            .group_by(CampDb.id)
            .having(
                func.min(CampDateDb.date).between(start_saturday, end_friday)
            )
        ).subquery()

        stmt = (
            select(UserDb, CampDb, StudentDb)
            .join(UserDb.students)
            .join(StudentDb.camps)
            .where(CampDb.id.in_(select(eligible_camp_ids)))
            .distinct()
        )
        result = await db_session.execute(stmt)
        last_user = None
        last_camp = None
        for db_user, db_camp, db_student in result.unique():
            if last_user != db_user:
                if last_user is not None:
                    print(user_list)
                else:
                    user_list = ""
            if last_camp != db_camp:
                camp = Camp(db_obj=db_camp)
                await camp.create(db_session)
                date_range = camp.date_range()
                daily_time_range = camp.daily_time_range()
                location = camp.location if camp.location and camp.location != "" else "TBD"
                user_list = user_list + \
                    f"\t{camp.program.title} ({date_range} from {daily_time_range}) at location: {location}\n"
            user_list = user_list + f"\t\t{db_student.name}\n"
            last_user = db_user
            last_camp = db_camp
        print(user_list)
    await app.router.on_shutdown[0]()

if __name__ == "__main__":
    email_server = EmailServer(
        host=os.environ.get("SMTP_HOST", None),
        port=os.environ.get("SMTP_PORT", None),
        user=os.environ.get("SMTP_USER", None),
        password=os.environ.get("SMTP_PASSWORD", None),
        sender_emails={CONFIRMATION_SENDER_EMAIL_KEY: os.environ.get(
            "CONFIRMATION_EMAIL_SENDER", None)}
    )

    asyncio.run(email_reminders())

    sys.exit(1)  # check with $?
