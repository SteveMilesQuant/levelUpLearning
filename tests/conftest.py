import httpx, asyncio, os, pymysql
from user import User, Role
from authentication import user_id_to_auth_token
from main import app, Object
from fastapi.testclient import TestClient


async def startup():
    os.environ['PYTEST_RUN'] = '1'
    os.environ['DB_SCHEMA_NAME'] = 'pytest'
    create_schema()

    await app.router.on_startup[0]()
    async with app.db_sessionmaker() as session:
        app.test = Object()
        app.test.users = Object()

        instructor_role = Role(name = 'INSTRUCTOR')
        await instructor_role.create(session)

        app.test.users.admin = User(
            google_id = 1,
            full_name = 'Steve Admin',
            email_address = 'steve.admin@fake.com'
        )
        await app.test.users.admin.create(session)
        auth_token, token_expiration = user_id_to_auth_token(app, app.test.users.admin.id)
        app.test.users.admin_cookies = httpx.Cookies()
        app.test.users.admin_cookies.set(app.config.jwt_cookie_name, auth_token)

        app.test.users.instructor = User(
            google_id = 2,
            full_name = 'Steve Instructor'
        )
        await app.test.users.instructor.create(session)
        await app.test.users.instructor.add_role(session, instructor_role)
        auth_token, token_expiration = user_id_to_auth_token(app, app.test.users.instructor.id)
        app.test.users.instructor_cookies = httpx.Cookies()
        app.test.users.instructor_cookies.set(app.config.jwt_cookie_name, auth_token)

        app.test.users.guardian = User(
            google_id = 3,
            full_name = 'Steve Guardian'
        )
        await app.test.users.guardian.create(session)
        auth_token, token_expiration = user_id_to_auth_token(app, app.test.users.guardian.id)
        app.test.users.guardian_cookies = httpx.Cookies()
        app.test.users.guardian_cookies.set(app.config.jwt_cookie_name, auth_token)


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

