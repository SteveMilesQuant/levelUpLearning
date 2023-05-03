import pytest, json, asyncio, os
from fastapi import status
from fastapi.testclient import TestClient
from datamodels import UserResponse
from datamodels import ProgramResponse, LevelResponse
from datamodels import StudentData, FastApiDate
from datamodels import CampData, FastApiDatetime
from user import User
from program import Program, Level
from camp import LevelSchedule
from main import app


client = TestClient(app)
all_camps_json = []


# Seed program and level for use with camps tests
program = Program(title='Creative Writing Workshop', grade_range=(6,8), tags='writing creative', description='Creative writing description.')
levels = [
    Level(title='Creative Writing 101', description='First desc.', list_index = 1),
    Level(title='Creative Writing 102', description='Second desc.', list_index = 2),
    Level(title='Creative Writing 103', description='Third desc.', list_index = 3),
]
alt_program = Program(title='Mathletes Anonymous', grade_range=(6,8), tags='math', description='Math anon description.')
alt_level = Level(title='Math 101', description='First desc.', list_index = 1)
async def seed_program():
    async with app.db_sessionmaker() as session:
        await program.create(session)
        for level in levels:
            level.program_id = program.id
            await level.create(session)

        await alt_program.create(session)
        alt_level.program_id = alt_program.id
        await alt_level.create(session)
asyncio.run(seed_program())

program_response = program.dict(include=ProgramResponse().dict())
program_response['grade_range'] = [program.grade_range[0], program.grade_range[1]] # comes back like this for some reason


# Test adding camps
@pytest.mark.parametrize(('camp'), (
    (CampData(program_id = program.id, primary_instructor_id=app.test.users.admin.id, is_published=True)),
    (CampData(program_id = program.id, primary_instructor_id=app.test.users.instructor.id, is_published=True)),
))
def test_post_camp(camp: CampData):
    camp_json = json.loads(json.dumps(camp.dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/camps', json=camp_json, headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {camp_json}'
    new_camp_json = response.json()
    camp_json['id'] = new_camp_json['id']
    camp_json['primary_instructor'] = app.test.users.map[camp_json['primary_instructor_id']].dict(include=UserResponse().dict())
    camp_json['program'] = program_response
    assert camp_json == new_camp_json, f'Returned camp {new_camp_json} does not match posted camp {camp_json}.'
    all_camps_json.append(new_camp_json)


# Test getting camps
def test_get_camps():
    # Get individually
    compare_camp_list = []
    for camp_json in all_camps_json:
        camp_id = camp_json['id']
        response = client.get(f'/camps/{camp_id}', headers = app.test.users.admin_headers)
        content_type = response.headers['content-type']
        assert response.status_code == status.HTTP_200_OK, f'Error getting {camp_json}'
        assert 'application/json' in content_type
        got_camp_json = response.json()
        assert camp_json == got_camp_json, f'Returned camp {got_camp_json} does not match requested camp {camp_json}.'
        compare_camp_list.append(got_camp_json)
        # Also test getting webpage for individual camps
        response = client.get(f'/camps/{camp_id}', headers = app.test.users.admin_headers)
        assert response.status_code == status.HTTP_200_OK

    # Get as list
    response = client.get('/camps', headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    camps_list = response.json()
    assert camps_list == compare_camp_list


# Test adding instructors
@pytest.mark.parametrize(('camp_index', 'instructor'), (
    (0, app.test.users.instructor),
    (1, app.test.users.admin),
))
def test_add_instructor_to_camp(camp_index: int, instructor: User):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']
    response = client.post(f'/camps/{camp_id}/instructors/{instructor.id}', json={}, headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    new_instructor_json = response.json()
    instructor_json = json.loads(json.dumps(instructor.dict(include=UserResponse().dict()), indent=4, sort_keys=True, default=str))
    assert new_instructor_json == instructor_json


# Test getting instructors
def test_getting_camp_instructors():
    # Get all instructors at once
    camp_json = all_camps_json[0]
    camp_id = camp_json['id']
    primary_instructor_id = camp_json['primary_instructor_id']
    admin_user_json = json.loads(json.dumps(app.test.users.admin.dict(include=UserResponse().dict()), indent=4, sort_keys=True, default=str))
    admin_user_json['is_primary'] = (admin_user_json['id'] == primary_instructor_id)
    instructor_user_json = json.loads(json.dumps(app.test.users.instructor.dict(include=UserResponse().dict()), indent=4, sort_keys=True, default=str))
    instructor_user_json['is_primary'] = (instructor_user_json['id'] == primary_instructor_id)
    instructors_json = [admin_user_json, instructor_user_json]
    response = client.get(f'/camps/{camp_id}/instructors', headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    got_instructors_json = response.json()
    assert got_instructors_json == instructors_json

    # Get instructors individually
    for instructor_json in instructors_json:
        instructor_id = instructor_json['id']
        response = client.get(f'/camps/{camp_id}/instructors/{instructor_id}', headers = app.test.users.admin_headers)
        content_type = response.headers['content-type']
        assert 'application/json' in content_type
        got_instructor_json = response.json()
        got_instructor_json['is_primary'] = (instructor_id == primary_instructor_id)
        assert got_instructor_json == instructor_json


# Test changing primary instructor
@pytest.mark.parametrize(('camp_index', 'instructor_id'), (
    (0, app.test.users.instructor.id),
    (1, app.test.users.admin.id),
))
def test_change_primary_instructor(camp_index: int, instructor_id: int):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']
    camp_json['primary_instructor_id'] = instructor_id
    camp_json['primary_instructor'] = app.test.users.map[instructor_id].dict(include=UserResponse().dict())
    response = client.put(f'/camps/{camp_id}', json=camp_json, headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    new_camp_json = response.json()
    assert new_camp_json == camp_json

    response = client.get(f'/camps/{camp_id}', headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    got_camp_json = response.json()
    assert got_camp_json == camp_json


# Test updating the level schedules
@pytest.mark.parametrize(('camp_index', 'level_index', 'level_schedule'), (
    (0, 0, LevelSchedule(start_time=FastApiDatetime(2023, 2, 6, 9, 0, 0), end_time=FastApiDatetime(2023, 2, 6, 12, 0, 0))),
    (0, 1, LevelSchedule(start_time=None, end_time=FastApiDatetime(2023, 2, 6, 16, 0, 0))),
    (0, 1, LevelSchedule(start_time=FastApiDatetime(2023, 2, 7, 9, 0, 0), end_time=None)),
))
def test_update_level_schedules(camp_index: int, level_index: int, level_schedule: LevelSchedule):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']
    level = levels[level_index]
    level_schedule_json = json.loads(json.dumps(level_schedule.dict(), indent=4, sort_keys=True, default=str))
    response = client.put(f'/camps/{camp_id}/levels/{level.id}', json=level_schedule_json, headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    new_level_schedule_json = response.json()
    level_schedule_json['camp_id'] = camp_id
    level_schedule_json['level_id'] = level.id
    level_schedule_json['id'] = level.id
    level_schedule_json['level'] = level.dict(include=LevelResponse().dict())
    assert new_level_schedule_json == level_schedule_json

    response = client.get(f'/camps/{camp_id}/levels/{level.id}', headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    get_level_schedule_json = response.json()
    assert get_level_schedule_json == level_schedule_json


# Test enrolling, getting, and disenrolling students
@pytest.mark.parametrize(('camp_index', 'student'), (
    (0, StudentData(name='Karen Tester', birthdate=FastApiDate(1987, 6, 15), grade_level=6)),
    (1, StudentData(name='Cheri Tester', birthdate=FastApiDate(1988, 7, 16), grade_level=7)),
))
def test_camp_student(camp_index: int, student: StudentData):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']

    student_data_json = json.loads(json.dumps(student.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/students', json=student_data_json, headers = app.test.users.admin_headers)
    student_json = response.json()
    student_id = student_json['id']

    response = client.post(f'/camps/{camp_id}/students/{student_id}', json={}, headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    new_student_json = response.json()
    assert new_student_json == student_json

    response = client.get(f'/camps/{camp_id}/students/{student_id}', headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    get_student_json = response.json()
    assert get_student_json == student_json

    response = client.get(f'/camps/{camp_id}/students', headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    student_list_json = response.json()
    assert student_list_json[0] == student_json

    response = client.get(f'/students/{student_id}/camps', headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    camp_list_json = response.json()
    assert camp_list_json[0] == camp_json

    response = client.delete(f'/camps/{camp_id}/students/{student_id}', headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {camp_json}'
    response = client.get(f'/camps/{camp_id}/students/{student_id}', headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    response = client.get(f'/camps/{camp_id}/students', headers = app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    assert response.json() == []


# Test removing instructors
@pytest.mark.parametrize(('camp_index', 'instructor_id'), (
    (0, app.test.users.instructor.id),
    (1, app.test.users.instructor.id),
))
def test_remove_instructor(camp_index: int, instructor_id: int):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']
    response = client.delete(f'/camps/{camp_id}/instructors/{instructor_id}', headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {camp_json}'
    response = client.get(f'/camps/{camp_id}/instructors/{instructor_id}', headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    response = client.get(f'/camps/{camp_id}', headers = app.test.users.admin_headers)
    got_camp_json = response.json()
    assert got_camp_json['primary_instructor_id'] != instructor_id


# Test deleting a camp
def test_delete_camp():
    camp_json = all_camps_json[0]
    camp_id = camp_json['id']
    response = client.delete(f'/camps/{camp_id}', headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {camp_json}'
    response = client.get(f'/camps/{camp_id}', headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND


# Permission tests
def test_permission():
    max_camp_id = 0
    for camp_json in all_camps_json:
        max_camp_id = max(max_camp_id, camp_json['id'])
    bad_camp_id = max_camp_id + 1
    camp = CampData(program_id = program.id, primary_instructor_id=app.test.users.instructor.id, is_published=True)
    camp_json = json.loads(json.dumps(camp.dict(), indent=4, sort_keys=True, default=str))
    camp_id = all_camps_json[1]['id']
    camp_error_json = {'detail': f'Camp id={bad_camp_id} not found.'}
    bad_program_id = alt_program.id
    bad_level_id = alt_level.id

    # camp get with bad id
    response = client.get(f'/camps/{bad_camp_id}', headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    returned_json = response.json()
    assert returned_json == camp_error_json

    # camp put with bad camp id
    response = client.put(f'/camps/{bad_camp_id}', json=camp_json, headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    returned_json = response.json()
    assert returned_json == camp_error_json

    # Try to change program_id (not allowed)
    camp_json['program_id'] = bad_program_id
    response = client.put(f'/camps/{camp_id}', json=camp_json, headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Get bad level id
    response = client.get(f'/camps/{camp_id}/levels/{bad_level_id}', headers = app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND


