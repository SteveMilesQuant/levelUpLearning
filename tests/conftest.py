import pytest, os
from user import User

db_path = os.path.join(os.path.dirname(__file__), 'test.db')
if os.path.isfile(db_path):
    os.remove(db_path)
os.environ['DB_PATH'] = db_path
from main import app


def pytest_sessionstart(session):
    app.admin_user = User(
        db = app.db,
        google_id = 1,
        given_name = 'Steve',
        family_name = 'Admin',
        full_name = 'Steve Admin',
        picture = ''
    )
    app.admin_user.add_email_address(app.db, 'steve.admin@fake.com')
    app.user = app.admin_user

    app.instructor_user = User(
        db = app.db,
        google_id = 2,
        given_name = 'Steve',
        family_name = 'Instructor',
        full_name = 'Steve Instructor',
        picture = ''
    )
    app.instructor_user.add_role(app.db, 'INSTRUCTOR')

    app.guardian_user = User(
        db = app.db,
        google_id = 3,
        given_name = 'Steve',
        family_name = 'Guardian',
        full_name = 'Steve Guardian',
        picture = ''
    )


def pytest_sessionfinish(session, exitstatus):
    os.remove(db_path)


