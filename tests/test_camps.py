import pytest, json
from fastapi import status
from fastapi.testclient import TestClient
from user import User
from program import Program, Level
from camp import CampData, LevelSchedule, FastApiDatetime
from main import app


client = TestClient(app)
app.user = User(db = app.db, id = 1)
all_camps_json = []

# Seed program and level for use with camps tests
program = Program(db = app.db, title='Creative Writing Workshop', grade_range=(6,8), tags='writing creative', description='Creative writing description.')
levels = [
    Level(db = app.db, title='Creative Writing 101', description='First desc.', list_index = 1),
    Level(db = app.db, title='Creative Writing 102', description='Second desc.', list_index = 2),
    Level(db = app.db, title='Creative Writing 103', description='Third desc.', list_index = 3),
]
for level in levels:
    program.add_level(db = app.db, level_id = level.id)


# Test webpage reads
@pytest.mark.parametrize(('endpoint'), (
    '/camps',
    '/schedule',
))
def test_get_camps_html(endpoint: str):
    response = client.get(endpoint, headers={"accept": "text/html"})
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'text/html' in content_type


# Test adding camps
@pytest.mark.parametrize(('camp'), (
    (CampData(
        program_id = program.id,
        primary_instructor_id=app.user.id,
        instructor_ids = [app.user.id],
        level_schedules = [
            LevelSchedule(level_id = levels[0].id, start_time = FastApiDatetime(2023, 2, 6, 9, 0, 0, 0), end_time = FastApiDatetime(2023, 2, 6, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[1].id, start_time = FastApiDatetime(2023, 2, 7, 9, 0, 0, 0), end_time = FastApiDatetime(2023, 2, 7, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[2].id, start_time = FastApiDatetime(2023, 2, 8, 9, 0, 0, 0), end_time = FastApiDatetime(2023, 2, 8, 12, 0, 0, 0))
        ]
    )),
    (CampData(
        program_id = program.id,
        primary_instructor_id=app.user.id,
        instructor_ids = [app.user.id],
        level_schedules = [
            LevelSchedule(level_id = levels[0].id, start_time = FastApiDatetime(2023, 2, 13, 9, 0, 0, 0), end_time = FastApiDatetime(2023, 2, 13, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[1].id, start_time = FastApiDatetime(2023, 2, 14, 9, 0, 0, 0), end_time = None),
            LevelSchedule(level_id = levels[2].id, start_time = None, end_time = None)
        ]
    )),
))
def test_post_camp(camp: CampData):
    camp_json = json.loads(json.dumps(camp.dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/camps', json=camp_json)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {camp_json}'
    new_camp_json = response.json()
    camp_json['id'] = new_camp_json['id']
    assert camp_json == new_camp_json, f'Returned camp {new_camp_json} does not match posted camp {camp_json}.'
    all_camps_json.append(new_camp_json)


# Test getting camps
def test_get_camps():
    # Get individually
    compare_camp_list = []
    for camp_json in all_camps_json:
        response = client.get('/camps/' + str(camp_json['id']))
        content_type = response.headers['content-type']
        assert response.status_code == status.HTTP_200_OK, f'Error getting {camp_json}'
        assert 'application/json' in content_type
        got_camp_json = response.json()
        assert camp_json == got_camp_json, f'Returned camp {got_camp_json} does not match requested camp {camp_json}.'
        compare_camp_list.append(got_camp_json)
        # Also test getting webpage for individual camps
        response = client.get('/camps/' + str(camp_json['id']))
        assert response.status_code == status.HTTP_200_OK

    # Get as list
    response = client.get('/camps', headers={"accept": "application/json"})
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    camps_list = response.json()
    assert camps_list == compare_camp_list


# Test updating camps
@pytest.mark.parametrize(('camp_index', 'camp'), (
    (0, CampData(
        program_id = program.id,
        primary_instructor_id=app.instructor_user.id,
        instructor_ids = [app.user.id, app.instructor_user.id],
        level_schedules = [
            LevelSchedule(level_id = levels[0].id, start_time = FastApiDatetime(2024, 2, 6, 9, 0, 0, 0), end_time = FastApiDatetime(2024, 2, 6, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[1].id, start_time = FastApiDatetime(2024, 2, 7, 9, 0, 0, 0), end_time = FastApiDatetime(2024, 2, 7, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[2].id, start_time = FastApiDatetime(2024, 2, 8, 9, 0, 0, 0), end_time = FastApiDatetime(2024, 2, 8, 12, 0, 0, 0))
        ]
    )),
    (1, CampData(
        program_id = program.id,
        primary_instructor_id=app.user.id,
        instructor_ids = [app.user.id, app.instructor_user.id],
        level_schedules = [
            LevelSchedule(level_id = levels[0].id, start_time = FastApiDatetime(2023, 2, 6, 9, 0, 0, 0), end_time = FastApiDatetime(2023, 2, 6, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[1].id, start_time = FastApiDatetime(2023, 2, 7, 9, 0, 0, 0), end_time = FastApiDatetime(2023, 2, 7, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[2].id, start_time = FastApiDatetime(2023, 2, 8, 9, 0, 0, 0), end_time = FastApiDatetime(2023, 2, 8, 12, 0, 0, 0))
        ]
    )),
))
def test_put_camp(camp_index: int, camp: CampData):
    camp_id = all_camps_json[camp_index]['id']
    camp_json = json.loads(json.dumps(camp.dict(), indent=4, sort_keys=True, default=str))
    response = client.put('/camps/' + str(camp_id), json=camp_json)
    assert response.status_code == status.HTTP_200_OK, f'Error putting {camp_json}'
    new_camp_json = response.json()
    camp_json['id'] = camp_id
    assert camp_json == new_camp_json, f'Returned camp {new_camp_json} does not match put camp {camp_json}.'


# Test deleting a camp
def test_delete_camp():
    camp_json = all_camps_json[0]
    response = client.delete('/camps/' + str(camp_json['id']))
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {camp_json}'
    response = client.get('/camps/' + str(camp_json['id']))
    assert response.status_code == status.HTTP_404_NOT_FOUND


# Permission tests
def test_permission():
    max_camp_id = 0
    for camp_json in all_camps_json:
        max_camp_id = max(max_camp_id, camp_json['id'])
    bad_camp_id = max_camp_id + 1
    camp = CampData(
        program_id = program.id,
        primary_instructor_id=app.instructor_user.id,
        instructor_ids = [app.user.id, app.instructor_user.id],
        level_schedules = [
            LevelSchedule(level_id = levels[0].id, start_time = FastApiDatetime(2024, 2, 6, 9, 0, 0, 0), end_time = FastApiDatetime(2024, 2, 6, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[1].id, start_time = FastApiDatetime(2024, 2, 7, 9, 0, 0, 0), end_time = FastApiDatetime(2024, 2, 7, 12, 0, 0, 0)),
            LevelSchedule(level_id = levels[2].id, start_time = FastApiDatetime(2024, 2, 8, 9, 0, 0, 0), end_time = FastApiDatetime(2024, 2, 8, 12, 0, 0, 0))
        ]
    )
    camp_error_json = {'detail': f'Camp id={bad_camp_id} not found.'}

    # camp get with bad id
    response = client.get('/camps/' + str(bad_camp_id))
    assert response.status_code == status.HTTP_404_NOT_FOUND
    returned_json = response.json()
    assert returned_json == camp_error_json

    # camp put with bad id
    camp_json = json.loads(json.dumps(camp.dict(), indent=4, sort_keys=True, default=str))
    response = client.put('/camps/' + str(bad_camp_id), json=camp_json)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    returned_json = response.json()
    assert returned_json == camp_error_json


