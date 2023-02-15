import pytest, os, httpx
from user import User
from authentication import user_id_to_auth_token

db_path = os.path.join(os.path.dirname(__file__), 'test.db')
if os.path.isfile(db_path):
    os.remove(db_path)
os.environ['DB_PATH'] = db_path
from main import app, Object


def pytest_sessionstart(session):
    app.test = Object()
    app.test.users = Object()

    app.test.users.admin = User(
        db = app.db,
        google_id = 1,
        given_name = 'Steve',
        family_name = 'Admin',
        full_name = 'Steve Admin',
        picture = ''
    )
    app.test.users.admin.add_email_address(app.db, 'steve.admin@fake.com')

    app.test.users.instructor = User(
        db = app.db,
        google_id = 2,
        given_name = 'Steve',
        family_name = 'Instructor',
        full_name = 'Steve Instructor',
        picture = ''
    )
    app.test.users.instructor.add_role(app.db, 'INSTRUCTOR')

    app.test.users.guardian = User(
        db = app.db,
        google_id = 3,
        given_name = 'Steve',
        family_name = 'Guardian',
        full_name = 'Steve Guardian',
        picture = ''
    )

    app.test.auth_token, token_expiration = user_id_to_auth_token(app, app.test.users.admin.id)
    app.test.cookies = httpx.Cookies()
    app.test.cookies.set(app.config.jwt_cookie_name, app.test.auth_token)


def pytest_sessionfinish(session, exitstatus):
    os.remove(db_path)


