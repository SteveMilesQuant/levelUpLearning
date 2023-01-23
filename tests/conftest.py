import pytest, os
from user import User

db_path = os.path.join(os.path.dirname(__file__), 'test.db')
if os.path.isfile(db_path):
    os.remove(db_path)
os.environ['DB_PATH'] = db_path
from main import app


def pytest_sessionstart(session):
    app.user = User(
        db = app.db,
        google_id = 1,
        given_name = 'Steve',
        family_name = 'Tester',
        full_name = 'Steve Tester',
        picture = ''
    )
    app.user.add_email_address(app.db, 'steve.tester@fake.com')


def pytest_sessionfinish(session, exitstatus):
    os.remove(db_path)


