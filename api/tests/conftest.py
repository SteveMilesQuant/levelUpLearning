from main import app, Object
import httpx
import asyncio
import os
import pymysql
from user import User
from authentication import user_id_to_auth_token

os.environ['API_ROOT_PATH'] = ''


async def startup():
    os.environ['PYTEST_RUN'] = '1'
    os.environ['DB_SCHEMA_NAME'] = 'pytest'
    create_schema()

    await app.router.on_startup[0]()
    async with app.db_sessionmaker() as session:
        app.test = Object()
        app.test.users = Object()

        app.test.users.admin = User(
            google_id=1,
            full_name='Steve Admin',
            email_address='steve.admin@fake.com'
        )
        await app.test.users.admin.create(session)
        await app.test.users.admin.add_role(session, 'GUARDIAN')
        await app.test.users.admin.add_role(session, 'INSTRUCTOR')
        await app.test.users.admin.add_role(session, 'ADMIN')
        auth_token, token_expiration = user_id_to_auth_token(
            app, app.test.users.admin.id)
        app.test.users.admin_headers = {'Authorization': auth_token}

        app.test.users.instructor = User(
            google_id=2,
            full_name='Steve Instructor'
        )
        await app.test.users.instructor.create(session)
        await app.test.users.instructor.add_role(session, 'GUARDIAN')
        await app.test.users.instructor.add_role(session, 'INSTRUCTOR')
        await app.test.users.instructor.remove_role(session, 'ADMIN')
        auth_token, token_expiration = user_id_to_auth_token(
            app, app.test.users.instructor.id)
        app.test.users.instructor_headers = {'Authorization': auth_token}

        app.test.users.guardian = User(
            google_id=3,
            full_name='Steve Guardian'
        )
        await app.test.users.guardian.create(session)
        await app.test.users.guardian.add_role(session, 'GUARDIAN')
        await app.test.users.guardian.remove_role(session, 'INSTRUCTOR')
        await app.test.users.guardian.remove_role(session, 'ADMIN')
        auth_token, token_expiration = user_id_to_auth_token(
            app, app.test.users.guardian.id)
        app.test.users.guardian_headers = {'Authorization': auth_token}

        app.test.users.test_enroll = User(
            google_id=4,
            full_name='Test Enroll'
        )
        await app.test.users.test_enroll.create(session)
        await app.test.users.test_enroll.add_role(session, 'GUARDIAN')
        await app.test.users.test_enroll.add_role(session, 'INSTRUCTOR')
        await app.test.users.test_enroll.add_role(session, 'ADMIN')
        auth_token, token_expiration = user_id_to_auth_token(
            app, app.test.users.test_enroll.id)
        app.test.users.test_enroll_headers = {'Authorization': auth_token}

        app.test.users.map = {
            app.test.users.admin.id: app.test.users.admin,
            app.test.users.instructor.id: app.test.users.instructor,
            app.test.users.guardian.id: app.test.users.guardian,
            app.test.users.test_enroll.id: app.test.users.test_enroll
        }


def pytest_sessionstart(session):
    asyncio.run(startup())


async def shutdown():
    await app.router.on_shutdown[0]()
    delete_schema()


def pytest_sessionfinish(session, exitstatus):
    asyncio.run(shutdown())


def create_schema():
    connection = pymysql.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    try:
        cursor = connection.cursor()
        stmt = f'CREATE DATABASE {os.environ["DB_SCHEMA_NAME"]};'
        cursor.execute(stmt)
    except Exception as e:
        pass
    finally:
        connection.close()


def delete_schema():
    connection = pymysql.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    try:
        cursor = connection.cursor()
        stmt = f'DROP DATABASE {os.environ["DB_SCHEMA_NAME"]};'
        cursor.execute(stmt)
    except Exception as e:
        pass
    finally:
        connection.close()
