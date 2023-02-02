import pytest, json
from fastapi import status
from fastapi.testclient import TestClient
from user import User
from student import StudentData, FastApiDate
from main import app

client = TestClient(app)
app.user = User(db = app.db, id = 1)
all_students_json = {}


# Test webpage read
def test_get_students_html():
    response = client.get('/students', headers={"accept": "text/html"})
    content_type = response.headers['content-type']
    assert response.status_code == status.HTTP_200_OK
    assert 'text/html' in content_type

# Test adding students
@pytest.mark.parametrize(('student'), (
    (StudentData(name='Karen Tester', birthdate=FastApiDate(1987, 6, 15), grade_level=6)),
    (StudentData(name='Cheri Tester', birthdate=FastApiDate(1988, 7, 16), grade_level=7)),
    (StudentData(name='Renee Tester', birthdate=FastApiDate(1989, 8, 17), grade_level=8)),
))
def test_post_students(student: StudentData):
    student_json = json.loads(json.dumps(student.dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/students', json=student_json)
    assert response.status_code == status.HTTP_201_CREATED, f'Error posting {student_json}'
    new_student_json = response.json()
    student_json['id'] = new_student_json['id']
    assert student_json == new_student_json, f'Returned student {new_student_json} does not match posted student {student_json}.'
    all_students_json[new_student_json['name']] = new_student_json


# Test getting students
def test_get_students():
    # Get them individually
    compare_student_list = []
    for student_json in all_students_json.values():
        response = client.get('/students/' + str(student_json['id']))
        assert response.status_code == status.HTTP_200_OK, f'Error getting {student_json}'
        got_student_json = response.json()
        assert student_json == got_student_json, f'Returned student {got_student_json} does not match requested student {student_json}.'
        compare_student_list.append(got_student_json)

    # Get all as a list
    response = client.get('/students', headers={"accept": "application/json"})
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
    student_json = json.loads(json.dumps(student.dict(), indent=4, sort_keys=True, default=str))
    response = client.put('/students/' + str(student_id), json=student_json)
    assert response.status_code == status.HTTP_200_OK, f'Error putting {student_json}'
    new_student_json = response.json()
    student_json['id'] = student_id
    assert student_json == new_student_json, f'Returned student {new_student_json} does not match put student {student_json}.'


# Test deleting a student
def test_delete_student():
    student_json = all_students_json['Karen Tester']
    response = client.delete('/students/' + str(student_json['id']))
    assert response.status_code == status.HTTP_200_OK, f'Error deleting {student_json}'
    response = client.get('/students/' + str(student_json['id']))
    assert response.status_code == status.HTTP_403_FORBIDDEN


# Permission test: student not in user's list
def test_student_permission():
    max_student_id = 0
    for student_json in all_students_json.values():
        max_student_id = max(max_student_id, student_json['id'])
    bad_student_id = max_student_id + 1
    student_error_json = {'detail': f'User does not have permission for student id={bad_student_id}'}

    response = client.get('/students/' + str(bad_student_id))
    assert response.status_code == status.HTTP_403_FORBIDDEN
    returned_json = response.json()
    assert returned_json == student_error_json

    student = StudentData(name='Karen Tester', birthdate=FastApiDate(1997, 6, 15), grade_level=1)
    student_json = json.loads(json.dumps(student.dict(), indent=4, sort_keys=True, default=str))
    response = client.put('/students/' + str(bad_student_id), json=student_json)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    returned_json = response.json()
    assert returned_json == student_error_json

