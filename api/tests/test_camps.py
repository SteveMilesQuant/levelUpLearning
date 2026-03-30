import pytest
import json
import asyncio
from fastapi import status
from fastapi.testclient import TestClient
from datamodels import EnrollmentData, SingleEnrollmentData, UserPublicResponse, UserResponse
from datamodels import ProgramResponse
from datamodels import StudentData, FastApiDate
from datamodels import CampData
from user import User
from program import Program, Level
from main import app


client = TestClient(app)
all_camps_json = []


# Seed program and level for use with camps tests
program = Program(title='Creative Writing Workshop', grade_range=(
    6, 8), tags='writing creative', description='Creative writing description.')
levels = [
    Level(title='Creative Writing 101', description='First desc.', list_index=1),
    Level(title='Creative Writing 102',
          description='Second desc.', list_index=2),
    Level(title='Creative Writing 103', description='Third desc.', list_index=3),
]
alt_program = Program(title='Mathletes Anonymous', grade_range=(
    6, 8), tags='math', description='Math anon description.')
alt_level = Level(title='Math 101', description='First desc.', list_index=1)


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
program_response['grade_range'] = [program.grade_range[0],
                                   program.grade_range[1]]  # comes back like this for some reason


# Test adding camps
@pytest.mark.parametrize(('camp'), (
    (CampData(program_id=program.id,
     primary_instructor_id=app.test.users.admin.id, is_published=True, capacity=10)),
    (CampData(program_id=program.id,
     primary_instructor_id=app.test.users.instructor.id, is_published=True, capacity=20)),
    (CampData(program_id=program.id,
     primary_instructor_id=app.test.users.instructor.id, is_published=False, capacity=30)),
))
def test_post_camp(camp: CampData):
    camp_json = json.loads(json.dumps(
        camp.dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/camps', json=camp_json,
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {camp_json}'
    new_camp_json = response.json()
    camp_json['id'] = new_camp_json['id']
    camp_json['primary_instructor'] = app.test.users.map[camp_json['primary_instructor_id']].dict(
        include=UserPublicResponse().dict())
    camp_json['program'] = program_response
    camp_json['current_enrollment'] = 0
    camp_json['current_am_enrollment'] = 0
    camp_json['current_pm_enrollment'] = 0
    camp_json['pickup_codes_generated'] = False
    assert camp_json == new_camp_json, f'Returned camp {new_camp_json} does not match posted camp {camp_json}.'
    all_camps_json.append(new_camp_json)


# Test getting camps
def test_get_camps():
    # Get individually
    compare_camp_list = []
    for camp_json in all_camps_json:
        camp_id = camp_json['id']
        response = client.get(
            f'/camps/{camp_id}', headers=app.test.users.admin_headers)
        content_type = response.headers['content-type']
        assert response.status_code == status.HTTP_200_OK, f'Error getting {camp_json}'
        assert 'application/json' in content_type
        got_camp_json = response.json()
        assert camp_json == got_camp_json, f'Returned camp {got_camp_json} does not match requested camp {camp_json}.'
        compare_camp_list.append(got_camp_json)
        # Also test getting webpage for individual camps
        response = client.get(
            f'/camps/{camp_id}', headers=app.test.users.admin_headers)
        assert response.status_code == status.HTTP_200_OK

    # Get as list
    response = client.get('/camps', headers=app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    camps_list = response.json()
    assert camps_list == compare_camp_list

    # Get only published camps
    response = client.get(
        '/camps', headers=app.test.users.admin_headers, params={'is_published': True})
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    camps_list = response.json()
    assert camps_list == list(
        filter(lambda camp: camp['is_published'], compare_camp_list))

    # Get only only camps for a particular instructor
    response = client.get('/camps', headers=app.test.users.admin_headers,
                          params={'instructor_id': app.test.users.instructor.id})
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    camps_list = response.json()
    assert camps_list == list(filter(
        lambda camp: camp['primary_instructor_id'] == app.test.users.instructor.id, compare_camp_list))

    # Get only only camps for a particular instructor that have been published
    response = client.get('/camps', headers=app.test.users.admin_headers, params={
        'instructor_id': app.test.users.instructor.id, 'is_published': True})
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    camps_list = response.json()
    assert camps_list == list(filter(
        lambda camp: camp['primary_instructor_id'] == app.test.users.instructor.id and camp['is_published'], compare_camp_list))


# Test adding instructors
@pytest.mark.parametrize(('camp_index', 'instructor'), (
    (0, app.test.users.instructor),
    (1, app.test.users.admin),
))
def test_add_instructor_to_camp(camp_index: int, instructor: User):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']
    response = client.post(f'/camps/{camp_id}/instructors/{instructor.id}',
                           json={}, headers=app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    new_instructor_json = response.json()
    instructor_json = json.loads(json.dumps(instructor.dict(
        include=UserResponse().dict()), indent=4, sort_keys=True, default=str))
    assert new_instructor_json == instructor_json


# Test getting instructors
def test_getting_camp_instructors():
    # Get all instructors at once
    camp_json = all_camps_json[0]
    camp_id = camp_json['id']
    admin_user_json = json.loads(json.dumps(app.test.users.admin.dict(
        include=UserResponse().dict()), indent=4, sort_keys=True, default=str))
    instructor_user_json = json.loads(json.dumps(app.test.users.instructor.dict(
        include=UserResponse().dict()), indent=4, sort_keys=True, default=str))
    instructors_json = [admin_user_json, instructor_user_json]
    response = client.get(
        f'/camps/{camp_id}/instructors', headers=app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    got_instructors_json = response.json()
    public_instructors_json = [UserPublicResponse(
        **instructor_json).dict() for instructor_json in instructors_json]
    assert got_instructors_json == public_instructors_json, 'Camp instructors list is wrong'

    # Get instructors individually
    for instructor_json in instructors_json:
        instructor_id = instructor_json['id']
        response = client.get(
            f'/camps/{camp_id}/instructors/{instructor_id}', headers=app.test.users.admin_headers)
        content_type = response.headers['content-type']
        assert 'application/json' in content_type
        got_instructor_json = response.json()
        public_instructor_json = UserPublicResponse(**instructor_json).dict()
        assert got_instructor_json == public_instructor_json, 'Camp instructor (individual) is wrong'


# Test changing primary instructor
@pytest.mark.parametrize(('camp_index', 'instructor_id'), (
    (0, app.test.users.instructor.id),
    (1, app.test.users.admin.id),
))
def test_change_primary_instructor(camp_index: int, instructor_id: int):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']
    camp_json['primary_instructor_id'] = instructor_id
    camp_json['primary_instructor'] = app.test.users.map[instructor_id].dict(
        include=UserPublicResponse().dict())
    response = client.put(
        f'/camps/{camp_id}', json=camp_json, headers=app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    new_camp_json = response.json()
    assert new_camp_json == camp_json, 'Change instructor response is wrong'

    response = client.get(f'/camps/{camp_id}',
                          headers=app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    got_camp_json = response.json()
    assert got_camp_json == camp_json, 'Get after change instructor is wrong'


# Test enrolling, getting, and disenrolling students
@pytest.mark.parametrize(('camp_index', 'student'), (
    (0, StudentData(name='Karen Tester',
     birthdate=FastApiDate(1987, 6, 15), grade_level=6)),
    (1, StudentData(name='Cheri Tester',
     birthdate=FastApiDate(1988, 7, 16), grade_level=7)),
))
def test_camp_student(camp_index: int, student: StudentData):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']

    student_data_json = json.loads(json.dumps(
        student.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/students', json=student_data_json,
                           headers=app.test.users.admin_headers)
    student_json = response.json()
    student_id = student_json['id']

    single_enrollment = SingleEnrollmentData(
        camp_id=camp_id, student_id=student_id)
    enrollment_data = EnrollmentData(
        enrollments=[single_enrollment], coupons=[], execute_transaction=True)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_201_CREATED, f'Error enrolling'
    content_type = response.headers['content-type']
    assert 'application/json' in content_type

    camp_json['current_enrollment'] = camp_json['current_enrollment'] + 1
    camp_json['current_am_enrollment'] = camp_json['current_am_enrollment'] + 1
    camp_json['current_pm_enrollment'] = camp_json['current_pm_enrollment'] + 1
    student_camp_json = camp_json.copy()
    student_camp_json['half_day'] = None
    student_json['student_camps'] = [student_camp_json]
    student_json['guardians'] = [
        app.test.users.admin.dict(include=UserResponse().dict())]
    camp_student_json = student_json.copy()
    camp_student_json['half_day'] = None

    response = client.get(
        f'/camps/{camp_id}/students/{student_id}', headers=app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    get_student_json = response.json()
    assert get_student_json == camp_student_json, 'Get student failed'

    response = client.get(
        f'/camps/{camp_id}/students', headers=app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    student_list_json = response.json()
    assert student_list_json[0] == camp_student_json, 'Get students failed'

    response = client.delete(
        f'/camps/{camp_id}/students/{student_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {camp_json}'
    response = client.get(
        f'/camps/{camp_id}/students/{student_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    response = client.get(
        f'/camps/{camp_id}/students', headers=app.test.users.admin_headers)
    content_type = response.headers['content-type']
    assert 'application/json' in content_type
    assert response.json() == []


# Test the pickup endpoint: valid code, invalid code, and unenrolled student
def test_pickup():
    camp_json = all_camps_json[0]
    camp_id = camp_json['id']

    # Create a student enrolled by the admin guardian
    student_data_json = {'name': 'Pickup Test Student', 'grade_level': 6}
    response = client.post('/students', json=student_data_json,
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_201_CREATED
    student_id = response.json()['id']

    # Create a second student (not enrolled) to test the unenrolled case
    response2 = client.post('/students', json={'name': 'Unenrolled Student', 'grade_level': 7},
                            headers=app.test.users.admin_headers)
    assert response2.status_code == status.HTTP_201_CREATED
    unenrolled_student_id = response2.json()['id']

    # Enroll the first student
    enrollment_data_json = json.loads(json.dumps(
        EnrollmentData(
            enrollments=[SingleEnrollmentData(
                camp_id=camp_id, student_id=student_id)],
            coupons=[],
            execute_transaction=True,
        ).dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/enroll', json=enrollment_data_json,
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_201_CREATED

    # Give the admin user a pickup person
    pickup_name = 'Grandma Smith'
    pickup_phone = '555-0199'
    response = client.put('/pickup-persons',
                          json={'pickup_persons': [
                              {'name': pickup_name, 'phone': pickup_phone}]},
                          headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK

    # Generate pickup codes for the camp
    response = client.post(f'/camps/{camp_id}/generate-codes',
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Retrieve generated code directly from DB (not exposed in API response)
    async def get_code():
        from db import PickupPersonCodeDb
        from sqlalchemy import select
        async with app.db_sessionmaker() as session:
            result = await session.execute(
                select(PickupPersonCodeDb).where(
                    PickupPersonCodeDb.camp_id == camp_id)
            )
            code_entry = result.scalars().first()
            return code_entry.code
    code = asyncio.run(get_code())
    assert code is not None and len(code) == 6

    # Invalid code → 400
    response = client.post(f'/camps/{camp_id}/pickup',
                           json={'student_ids': [
                               student_id], 'code': 'XXXXXX'},
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # GET lookup: invalid code → 400
    response = client.get(f'/camps/{camp_id}/pickup',
                          params={'code': 'XXXXXX'},
                          headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # GET lookup: valid code → 200 with pickup person name + students
    response = client.get(f'/camps/{camp_id}/pickup',
                          params={'code': code},
                          headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    lookup_data = response.json()
    assert lookup_data['pickup_person_name'] == pickup_name
    assert len(lookup_data['students']) >= 1
    lookup_student_ids = [s['id'] for s in lookup_data['students']]
    assert student_id in lookup_student_ids

    # GET lookup: guardian (non-instructor) should be forbidden
    response = client.get(f'/camps/{camp_id}/pickup',
                          params={'code': code},
                          headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Unenrolled student with valid code → 400
    response = client.post(f'/camps/{camp_id}/pickup',
                           json={'student_ids': [
                               unenrolled_student_id], 'code': code},
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # Valid code, enrolled student → 200 with pickup person name
    response = client.post(f'/camps/{camp_id}/pickup',
                           json={'student_ids': [student_id], 'code': code},
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['pickup_person_name'] == pickup_name

    # --- Test student pickup persons endpoint ---
    response = client.get(f'/camps/{camp_id}/students/{student_id}/pickup-persons',
                          headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    pp_list = response.json()
    assert len(pp_list) >= 1
    pp = next(p for p in pp_list if p['name'] == pickup_name)
    assert pp['phone'] == pickup_phone
    assert pp['sms_consent'] is None
    assert 'guardian_name' in pp
    pickup_person_id = pp['id']

    # Guardian should be forbidden
    response = client.get(f'/camps/{camp_id}/students/{student_id}/pickup-persons',
                          headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Non-enrolled student should 404
    response = client.get(f'/camps/{camp_id}/students/{unenrolled_student_id}/pickup-persons',
                          headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    # --- Test PATCH sms_consent ---
    response = client.patch(f'/pickup-persons/{pickup_person_id}',
                            json={'sms_consent': True},
                            headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['sms_consent'] is True

    # Verify it persists
    response = client.get(f'/camps/{camp_id}/students/{student_id}/pickup-persons',
                          headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    pp = next(p for p in response.json() if p['id'] == pickup_person_id)
    assert pp['sms_consent'] is True

    # Set to denied
    response = client.patch(f'/pickup-persons/{pickup_person_id}',
                            json={'sms_consent': False},
                            headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['sms_consent'] is False

    # Reset to null (unconfirmed)
    response = client.patch(f'/pickup-persons/{pickup_person_id}',
                            json={'sms_consent': None},
                            headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['sms_consent'] is None

    # Non-admin should be forbidden
    response = client.patch(f'/pickup-persons/{pickup_person_id}',
                            json={'sms_consent': True},
                            headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Non-existent pickup person should 404
    response = client.patch(f'/pickup-persons/99999',
                            json={'sms_consent': True},
                            headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    # Disenroll the student
    response = client.delete(f'/camps/{camp_id}/students/{student_id}',
                             headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK


# Test removing instructors
@pytest.mark.parametrize(('camp_index', 'instructor_id'), (
    (0, app.test.users.instructor.id),
    (1, app.test.users.instructor.id),
))
def test_remove_instructor(camp_index: int, instructor_id: int):
    camp_json = all_camps_json[camp_index]
    camp_id = camp_json['id']
    response = client.delete(
        f'/camps/{camp_id}/instructors/{instructor_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {camp_json}'
    response = client.get(
        f'/camps/{camp_id}/instructors/{instructor_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    response = client.get(f'/camps/{camp_id}',
                          headers=app.test.users.admin_headers)
    got_camp_json = response.json()
    assert got_camp_json['primary_instructor_id'] != instructor_id


# Test deleting a camp
def test_delete_camp():
    # you won't be able to delete camps with payment records, so "delete" the unpublished camp at index 2
    camp_json = all_camps_json[2]
    camp_id = camp_json['id']
    response = client.delete(
        f'/camps/{camp_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {camp_json}'
    response = client.get(f'/camps/{camp_id}',
                          headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND


# Permission tests
def test_permission():
    max_camp_id = 0
    for camp_json in all_camps_json:
        max_camp_id = max(max_camp_id, camp_json['id'])
    bad_camp_id = max_camp_id + 1
    camp = CampData(program_id=program.id,
                    primary_instructor_id=app.test.users.instructor.id, is_published=True)
    camp_json = json.loads(json.dumps(
        camp.dict(), indent=4, sort_keys=True, default=str))
    camp_id = all_camps_json[1]['id']
    camp_error_json = {'detail': f'Camp id={bad_camp_id} not found.'}
    bad_program_id = alt_program.id
    bad_level_id = alt_level.id

    instructor_id = app.test.users.instructor.id

    response = client.get(f'/students', headers=app.test.users.admin_headers)
    student_list_json = response.json()
    student_id = student_list_json[0]['id']

    # camp get with bad id
    response = client.get(
        f'/camps/{bad_camp_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    returned_json = response.json()
    assert returned_json == camp_error_json

    # camp put with bad camp id
    response = client.put(
        f'/camps/{bad_camp_id}', json=camp_json, headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    returned_json = response.json()
    assert returned_json == camp_error_json

    # Get bad level id
    response = client.get(
        f'/camps/{camp_id}/levels/{bad_level_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    # Instructors and guardians should be blocked from updating camps
    response = client.post(f'/camps', json=camp_json,
                           headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.post(f'/camps', json=camp_json,
                           headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    response = client.put(
        f'/camps/{camp_id}', json=camp_json, headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.put(
        f'/camps/{camp_id}', json=camp_json, headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    response = client.delete(
        f'/camps/{camp_id}', headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.delete(
        f'/camps/{camp_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Instructors and guardians should be blocked from adding or removing instructors to/from camps
    response = client.post(
        f'/camps/{camp_id}/instructors/{instructor_id}', headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.post(
        f'/camps/{camp_id}/instructors/{instructor_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    response = client.delete(
        f'/camps/{camp_id}/instructors/{instructor_id}', headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.delete(
        f'/camps/{camp_id}/instructors/{instructor_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Instructors and guardians should be blocked from removing students from camps
    response = client.delete(
        f'/camps/{camp_id}/students/{student_id}', headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.delete(
        f'/camps/{camp_id}/students/{student_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Non-admins should be blocked from generating pickup codes
    response = client.post(
        f'/camps/{camp_id}/generate-codes', headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    response = client.post(
        f'/camps/{camp_id}/generate-codes', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Bad camp id should 404
    response = client.post(
        f'/camps/{bad_camp_id}/generate-codes', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_generate_pickup_codes():
    camp_json = all_camps_json[0]
    camp_id = camp_json['id']

    # Admin should succeed with 204 No Content
    response = client.post(f'/camps/{camp_id}/generate-codes',
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_204_NO_CONTENT

    # Camp should now report pickup_codes_generated: True
    response = client.get(f'/camps/{camp_id}',
                          headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    got_camp_json = response.json()
    assert got_camp_json['pickup_codes_generated'] is True
    camp_json['pickup_codes_generated'] = True
