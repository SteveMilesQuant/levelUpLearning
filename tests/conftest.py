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
        full_name = 'Steve Admin',
        email_address = 'steve.admin@fake.com'
    )
    auth_token, token_expiration = user_id_to_auth_token(app, app.test.users.admin.id)
    app.test.users.admin_cookies = httpx.Cookies()
    app.test.users.admin_cookies.set(app.config.jwt_cookie_name, auth_token)

    app.test.users.instructor = User(
        db = app.db,
        google_id = 2,
        full_name = 'Steve Instructor'
    )
    app.test.users.instructor.add_role(app.db, 'INSTRUCTOR')
    auth_token, token_expiration = user_id_to_auth_token(app, app.test.users.instructor.id)
    app.test.users.instructor_cookies = httpx.Cookies()
    app.test.users.instructor_cookies.set(app.config.jwt_cookie_name, auth_token)

    app.test.users.guardian = User(
        db = app.db,
        google_id = 3,
        full_name = 'Steve Guardian'
    )
    auth_token, token_expiration = user_id_to_auth_token(app, app.test.users.guardian.id)
    app.test.users.guardian_cookies = httpx.Cookies()
    app.test.users.guardian_cookies.set(app.config.jwt_cookie_name, auth_token)


def pytest_sessionfinish(session, exitstatus):
    os.remove(db_path)


