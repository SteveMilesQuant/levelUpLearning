import pytest, json
from fastapi import status
from fastapi.testclient import TestClient
from user import User
from program import ProgramData, LevelData
from main import app

client = TestClient(app)
app.user = User(db = app.db, id = 1)
all_programs_json = {}
all_levels_json = {}


# Test webpage read
def test_get_programs_html():
    response = client.get('/programs', headers={"accept": "text/html"})
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'text/html' in content_type


# Test adding programs
@pytest.mark.parametrize(('program'), (
    (ProgramData(title='Creative Writing Workshop', grade_range=(6,8), tags='writing creative', description='')),
    (ProgramData(title='Mathletes Anonymous', grade_range=(9,12), tags='math hands-on therapy', description='')),
))
def test_post_program(program: ProgramData):
    program_json = json.loads(json.dumps(program.dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/programs', json=program_json)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {program_json}'
    new_program_json = response.json()
    program_json['id'] = new_program_json['id']
    assert program_json == new_program_json, f'Returned program {new_program_json} does not match posted program {program_json}.'
    all_programs_json[program.title] = new_program_json


# Test getting programs
def test_get_programs():
    # Get individually
    compare_program_list = []
    for program_json in all_programs_json.values():
        program_id = program_json['id']
        response = client.get(f'/programs/{program_id}')
        content_type = response.headers['content-type']
        assert response.status_code == status.HTTP_200_OK, f'Error getting {program_json}'
        assert 'application/json' in content_type
        got_program_json = response.json()
        assert program_json == got_program_json, f'Returned program {got_program_json} does not match requested program {program_json}.'
        compare_program_list.append(got_program_json)
        # Also test getting webpage for individual programs
        response = client.get(f'/programs/{program_id}')
        assert response.status_code == status.HTTP_200_OK

    # Get as list
    response = client.get('/programs', headers={"accept": "application/json"})
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    programs_list = response.json()
    assert programs_list == compare_program_list


# Test updating programs
@pytest.mark.parametrize(('program'), (
    (ProgramData(title='Creative Writing Workshop', grade_range=(4,12), tags='writing creative', description='Creative writing working desc.')),
    (ProgramData(title='Mathletes Anonymous', grade_range=(6,11), tags='math hands-on', description='Admitting you have a problem is the first step to recovery.')),
))
def test_put_program(program: ProgramData):
    program_id = all_programs_json[program.title]['id']
    program_json = json.loads(json.dumps(program.dict(), indent=4, sort_keys=True, default=str))
    response = client.put(f'/programs/{program_id}', json=program_json)
    assert response.status_code == status.HTTP_200_OK, f'Error putting {program_json}'
    new_program_json = response.json()
    program_json['id'] = program_id
    assert program_json == new_program_json, f'Returned program {new_program_json} does not match put program {program_json}.'


# Test adding levels
@pytest.mark.parametrize(('level'), (
    (LevelData(title='Admitting you have a problem')),
    (LevelData(title='Getting help for being a Mathlete')),
    (LevelData(title='Taking up sports')),
    (LevelData(title='Being normal')),
))
def test_post_level(level: LevelData):
    program_json = all_programs_json['Mathletes Anonymous']
    program_id = program_json["id"]
    level_json = json.loads(json.dumps(level.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/programs/{program_id}/levels', json=level_json)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {level_json}'
    new_level_json = response.json()
    level_json['id'] = new_level_json['id']
    level_json['list_index'] = new_level_json['list_index']
    assert level_json == new_level_json, f'Returned level {new_level_json} does not match posted level {level_json}.'
    all_levels_json[level.title] = new_level_json


# Test getting levels
def test_get_levels():
    program_json = all_programs_json['Mathletes Anonymous']
    program_id = program_json["id"]
    compare_levels_list = []

    # Get individually
    for level_json in all_levels_json.values():
        level_id = level_json['id']
        response = client.get(f'/programs/{program_id}/levels/{level_id}')
        assert response.status_code == status.HTTP_200_OK, f'Error getting {level_json}'
        got_level_json = response.json()
        assert level_json == got_level_json, f'Returned level {got_level_json} does not match requested level {level_json}.'
        compare_levels_list.append(got_level_json)

    # Get as a list
    response = client.get(f'/programs/{program_id}/levels/')
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    levels_list = response.json()
    assert levels_list == compare_levels_list


# Test updating levels
@pytest.mark.parametrize(('level'), (
    (LevelData(title='Admitting you have a problem', description='Admit desc.', list_index = 1)),
    (LevelData(title='Getting help for being a Mathlete', description='Help desc.', list_index = 2)),
    (LevelData(title='Taking up sports', description='Sports desc.', list_index = 3)),
    (LevelData(title='Being normal', description='Normal desc', list_index = 2)),
))
def test_put_level(level: LevelData):
    program_json = all_programs_json['Mathletes Anonymous']
    program_id = program_json["id"]
    level_id = all_levels_json[level.title]['id']
    level_json = json.loads(json.dumps(level.dict(), indent=4, sort_keys=True, default=str))
    response = client.put(f'/programs/{program_id}/levels/{level_id}', json=level_json)
    assert response.status_code == status.HTTP_200_OK, f'Error putting {level_json}'
    new_level_json = response.json()
    level_json['id'] = level_id
    assert level_json == new_level_json, f'Returned level {new_level_json} does not match put level {level_json}.'

    # Also test post-put get
    response = client.get(f'/programs/{program_id}/levels/{level_id}')
    assert response.status_code == status.HTTP_200_OK, f'Error getting {level_json}'
    got_level_json = response.json()
    assert level_json == got_level_json, f'Returned level {got_level_json} does not match requested level {level_json}.'


# Test deleting a level
def test_delete_level():
    program_json = all_programs_json['Mathletes Anonymous']
    program_id = program_json["id"]
    level_json = all_levels_json['Admitting you have a problem']
    level_id = level_json['id']
    response = client.delete(f'/programs/{program_id}/levels/{level_id}')
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {level_json}'
    response = client.get(f'/programs/{program_id}/levels/{level_id}')
    assert response.status_code == status.HTTP_404_NOT_FOUND


# Test deleting a program
def test_delete_program():
    program_json = all_programs_json['Creative Writing Workshop']
    program_id = program_json['id']
    response = client.delete(f'/programs/{program_id}')
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {program_json}'
    response = client.get(f'/programs/{program_id}')
    assert response.status_code == status.HTTP_404_NOT_FOUND


# Permission tests
def test_permission():
    max_program_id = 0
    for program_json in all_programs_json.values():
        max_program_id = max(max_program_id, program_json['id'])
    bad_program_id = max_program_id + 1
    program = ProgramData(title='Creative Writing Workshop', grade_range=(6,8), tags='writing creative', description='')
    program_error_json = {'detail': f'User does not have permission for program id={bad_program_id}'}

    # Program get with bad id
    response = client.get(f'/programs/{bad_program_id}')
    assert response.status_code == status.HTTP_404_NOT_FOUND

    # Program put with bad id
    program_json = json.loads(json.dumps(program.dict(), indent=4, sort_keys=True, default=str))
    response = client.put(f'/programs/{bad_program_id}', json=program_json)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    returned_json = response.json()
    assert returned_json == program_error_json

    max_level_id = 0
    for level_json in all_levels_json.values():
        max_level_id = max(max_level_id, level_json['id'])
    level_json = all_levels_json['Getting help for being a Mathlete']
    level_id = level_json['id']
    bad_level_id = max_level_id + 1
    program_json = all_programs_json['Mathletes Anonymous']
    program_id = program_json["id"]

    # Level get with bad level id
    response = client.get(f'/programs/{program_id}/levels/{bad_level_id}')
    assert response.status_code == status.HTTP_404_NOT_FOUND

    # Level put with bad program id
    response = client.put(f'/programs/{bad_program_id}/levels/{level_id}', json=level_json)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Level put with bad level id, but good program id
    response = client.put(f'/programs/{program_id}/levels/{bad_level_id}', json=level_json)
    assert response.status_code == status.HTTP_404_NOT_FOUND

