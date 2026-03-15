import pytest
import json
import os
from fastapi import status
from fastapi.testclient import TestClient
from datamodels import StudentData, StudentFormData, PickupPersonData, UserPickupFormData, FastApiDate, UserResponse
from main import app

client = TestClient(app)
all_students_json = {}
all_forms_json = {}
all_pickup_form_json = {}


# Test adding students
@pytest.mark.parametrize(('student'), (
    (StudentData(name='Karen Tester', birthdate=FastApiDate(1987, 6, 15), grade_level=6)),
    (StudentData(name='Cheri Tester', birthdate=FastApiDate(1988, 7, 16), grade_level=7)),
    (StudentData(name='Renee Tester', birthdate=FastApiDate(1989, 8, 17), grade_level=8)),
))
def test_post_students(student: StudentData):
    student_json = json.loads(json.dumps(
        student.dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/students', json=student_json,
                           headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {student_json}'
    new_student_json = response.json()
    student_json['id'] = new_student_json['id']
    student_json['student_camps'] = []
    student_json['guardians'] = [
        app.test.users.guardian.dict(include=UserResponse().dict())]
    assert student_json == new_student_json, f'Returned student {new_student_json} does not match posted student {student_json}.'
    all_students_json[new_student_json['name']] = new_student_json


# Test getting students
def test_get_students():
    # Get them individually
    compare_student_list = []
    for student_json in all_students_json.values():
        student_id = student_json['id']
        response = client.get(
            f'/students/{student_id}', headers=app.test.users.guardian_headers)
        assert response.status_code == status.HTTP_200_OK, f'Error getting {student_json}'
        got_student_json = response.json()
        assert student_json == got_student_json, f'Returned student {got_student_json} does not match requested student {student_json}.'
        compare_student_list.append(got_student_json)

    # Get all as a list
    response = client.get('/students', headers=app.test.users.guardian_headers)
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'application/json' in content_type
    student_list = response.json()
    assert student_list == compare_student_list


# Test updating students
@pytest.mark.parametrize(('student'), (
    (StudentData(name='Karen Tester', birthdate=FastApiDate(1997, 6, 15), grade_level=1)),
    (StudentData(name='Cheri Tester', birthdate=FastApiDate(1998, 7, 16), grade_level=2)),
    (StudentData(name='Renee Tester', birthdate=FastApiDate(1999, 8, 17), grade_level=3)),
))
def test_put_student(student: StudentData):
    student_id = all_students_json[student.name]['id']
    student_json = json.loads(json.dumps(
        student.dict(), indent=4, sort_keys=True, default=str))
    response = client.put(
        f'/students/{student_id}', json=student_json, headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error putting {student_json}'
    new_student_json = response.json()
    student_json['id'] = student_id
    student_json['student_camps'] = []
    student_json['guardians'] = [
        app.test.users.guardian.dict(include=UserResponse().dict())]
    assert student_json == new_student_json, f'Returned student {new_student_json} does not match put student {student_json}.'

    response = client.get(
        f'/students/{student_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error getting {student_json}'
    got_student_json = response.json()
    assert student_json == got_student_json, f'Returned student {got_student_json} does not match requested student {student_json}.'


# Test deleting a student
def test_delete_student():
    student_json = all_students_json['Karen Tester']
    student_id = student_json['id']
    response = client.delete(
        f'/students/{student_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {student_json}'
    response = client.get(
        f'/students/{student_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


# Permission test: student not in user's list
def test_student_permission():
    max_student_id = 0
    for student_json in all_students_json.values():
        max_student_id = max(max_student_id, student_json['id'])
    bad_student_id = max_student_id + 1
    student_error_json = {
        'detail': f'User does not have permission for student id={bad_student_id}'}

    response = client.get(
        f'/students/{bad_student_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    returned_json = response.json()
    assert returned_json == student_error_json

    student = StudentData(name='Karen Tester',
                          birthdate=FastApiDate(1997, 6, 15), grade_level=1)
    student_json = json.loads(json.dumps(
        student.dict(), indent=4, sort_keys=True, default=str))
    response = client.put(
        f'/students/{bad_student_id}', json=student_json, headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    returned_json = response.json()
    assert returned_json == student_error_json


###############################################################################
# STUDENT FORM TESTS
###############################################################################

# Test creating forms for students
@pytest.mark.parametrize(('student_name', 'form_data'), (
    ('Cheri Tester', StudentFormData(
        child_school='Test Elementary',
        parent_name='Parent Cheri',
        parent_email='cheri@test.com',
        parent_phone='555-0001',
        emergency_contact='Emergency Cheri 555-9991',
        allergies='None',
        has_allergies=False,
        additional_info='',
        photo_permission=True,
        referral_source='Google Search',
    )),
    ('Renee Tester', StudentFormData(
        child_school='Test Middle School',
        parent_name='Parent Renee',
        parent_email='renee@test.com',
        parent_phone='555-0002',
        emergency_contact='Emergency Renee 555-9992',
        allergies='Peanuts',
        has_allergies=True,
        additional_info='Needs extra supervision',
        photo_permission=False,
        referral_source='Friend Recommended',
    )),
))
def test_post_form(student_name, form_data):
    student_json = all_students_json[student_name]
    form_data.student_id = student_json['id']
    form_json = json.loads(json.dumps(form_data.dict(), default=str))
    response = client.post('/forms', json=form_json,
                           headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting form for {student_name}'
    new_form_json = response.json()
    assert new_form_json['id'] is not None
    assert new_form_json['student_id'] == student_json['id']
    assert new_form_json['child_school'] == form_data.child_school
    assert new_form_json['parent_name'] == form_data.parent_name
    assert new_form_json['parent_phone'] == form_data.parent_phone
    assert new_form_json['photo_permission'] == form_data.photo_permission
    assert new_form_json['student_name'] == student_name
    assert new_form_json['student_grade_level'] is not None
    assert new_form_json['updated_at'] is not None
    all_forms_json[student_name] = new_form_json


# Test getting forms
def test_get_forms():
    # Get all forms for the guardian
    response = client.get('/forms', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK
    forms_list = response.json()
    assert len(forms_list) == len(all_forms_json)

    # Get form by student_id
    for student_name, form_json in all_forms_json.items():
        student_id = form_json['student_id']
        response = client.get(
            f'/forms/{student_id}', headers=app.test.users.guardian_headers)
        assert response.status_code == status.HTTP_200_OK, f'Error getting form for {student_name}'
        got_form_json = response.json()
        assert got_form_json['id'] == form_json['id']
        assert got_form_json['child_school'] == form_json['child_school']
        assert got_form_json['student_name'] == student_name


# Test getting form for student with no form returns None
def test_get_form_no_form():
    # Karen was deleted earlier, but we can check a non-existent student form
    # by checking a student that has no form yet (if any exist)
    # Instead, re-add a student just for this test via admin
    student = StudentData(name='Formless Student',
                          birthdate=FastApiDate(2010, 1, 1), grade_level=5)
    student_json = json.loads(json.dumps(student.dict(), default=str))
    response = client.post('/students', json=student_json,
                           headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_201_CREATED
    new_student_id = response.json()['id']

    response = client.get(
        f'/forms/{new_student_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() is None

    # Cleanup
    response = client.delete(
        f'/students/{new_student_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK


# Test updating a form
def test_put_form():
    form_json = all_forms_json['Cheri Tester']
    form_id = form_json['id']
    updated_data = StudentFormData(
        student_id=form_json['student_id'],
        child_school='Updated School',
        parent_name='Updated Parent',
        parent_email='updated@test.com',
        parent_phone='555-9999',
        emergency_contact='Updated Emergency 555-8888',
        allergies='Shellfish',
        has_allergies=True,
        additional_info='Updated info',
        photo_permission=False,
        referral_source='Facebook Ad',
    )
    updated_json = json.loads(json.dumps(updated_data.dict(), default=str))
    response = client.put(
        f'/forms/{form_id}', json=updated_json,
        headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK, f'Error updating form id={form_id}'
    result_json = response.json()
    assert result_json['child_school'] == 'Updated School'
    assert result_json['parent_name'] == 'Updated Parent'
    assert result_json['parent_phone'] == '555-9999'
    assert result_json['photo_permission'] is False
    assert result_json['allergies'] == 'Shellfish'
    assert result_json['updated_at'] is not None
    assert result_json['updated_at'] >= form_json['updated_at']
    all_forms_json['Cheri Tester'] = result_json


# Test form permission — guardian cannot access another user's student form
def test_form_permission():
    # Use instructor headers (different user) to try to create a form for guardian's student
    student_json = all_students_json['Cheri Tester']
    form_data = StudentFormData(
        student_id=student_json['id'],
        child_school='Hacker School',
        parent_name='Hacker',
        parent_phone='555-0000',
        emergency_contact='None',
        allergies='None',
        has_allergies=False,
        photo_permission=True,
    )
    form_json = json.loads(json.dumps(form_data.dict(), default=str))
    response = client.post('/forms', json=form_json,
                           headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Instructor also cannot get the form by student_id
    response = client.get(
        f'/forms/{student_json["id"]}', headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


# Test deleting a form (admin only)
def test_delete_form():
    form_json = all_forms_json['Renee Tester']
    form_id = form_json['id']

    # Non-admin cannot delete
    response = client.delete(
        f'/forms/{form_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Admin can delete
    response = client.delete(
        f'/forms/{form_id}', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_200_OK

    # Verify it's gone
    student_id = form_json['student_id']
    response = client.get(
        f'/forms/{student_id}', headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() is None


# Test deleting form for non-existent id
def test_delete_form_not_found():
    response = client.delete(
        '/forms/99999', headers=app.test.users.admin_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND


###############################################################################
# PICKUP PERSONS TESTS
###############################################################################


def test_get_pickup_persons_empty():
    response = client.get('/pickup-persons',
                          headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data['updated_at'] is None
    assert data['pickup_persons'] == []


def test_put_pickup_persons():
    pickup_form = UserPickupFormData(
        pickup_persons=[
            PickupPersonData(name='Parent Guardian', phone='555-1111'),
            PickupPersonData(name='Aunt Guardian', phone='555-2222'),
        ]
    )
    pickup_json = json.loads(json.dumps(pickup_form.dict(), default=str))
    response = client.put('/pickup-persons', json=pickup_json,
                          headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data['updated_at'] is not None
    assert len(data['pickup_persons']) == 2
    assert data['pickup_persons'][0]['name'] == 'Parent Guardian'
    assert data['pickup_persons'][0]['phone'] == '555-1111'
    assert data['pickup_persons'][1]['name'] == 'Aunt Guardian'
    assert data['pickup_persons'][1]['phone'] == '555-2222'
    all_pickup_form_json['guardian'] = data


def test_get_pickup_persons_after_update():
    response = client.get('/pickup-persons',
                          headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    saved = all_pickup_form_json['guardian']
    assert data['updated_at'] is not None
    assert len(data['pickup_persons']) == len(saved['pickup_persons'])
    for got, expected in zip(data['pickup_persons'], saved['pickup_persons']):
        assert got['name'] == expected['name']
        assert got['phone'] == expected['phone']


def test_put_pickup_persons_replaces_old():
    pickup_form = UserPickupFormData(
        pickup_persons=[
            PickupPersonData(name='New Person Only', phone='555-3333'),
        ]
    )
    pickup_json = json.loads(json.dumps(pickup_form.dict(), default=str))
    response = client.put('/pickup-persons', json=pickup_json,
                          headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data['pickup_persons']) == 1
    assert data['pickup_persons'][0]['name'] == 'New Person Only'
    assert data['updated_at'] >= all_pickup_form_json['guardian']['updated_at']
    all_pickup_form_json['guardian'] = data


def test_pickup_persons_permission():
    # Instructor sets their own pickup persons
    pickup_form = UserPickupFormData(
        pickup_persons=[
            PickupPersonData(name='Instructor Contact', phone='555-4444'),
        ]
    )
    pickup_json = json.loads(json.dumps(pickup_form.dict(), default=str))
    response = client.put('/pickup-persons', json=pickup_json,
                          headers=app.test.users.instructor_headers)
    assert response.status_code == status.HTTP_200_OK
    instructor_data = response.json()

    # Guardian's pickup persons are unchanged
    response = client.get('/pickup-persons',
                          headers=app.test.users.guardian_headers)
    assert response.status_code == status.HTTP_200_OK
    guardian_data = response.json()
    guardian_names = [p['name'] for p in guardian_data['pickup_persons']]
    instructor_names = [p['name'] for p in instructor_data['pickup_persons']]
    assert guardian_names != instructor_names
    assert 'Instructor Contact' not in guardian_names
    assert 'New Person Only' in guardian_names
