import pytest
import json
import asyncio
from fastapi import status
from fastapi.testclient import TestClient
from datamodels import StudentData, CampData, CouponData, FastApiDate, SingleEnrollmentData, EnrollmentData, StudentMoveData
from program import Program
from main import app

client = TestClient(app)

# Seed enroll_program
enroll_program = Program(title='Creative Writing Workshop', grade_range=(
    6, 8), tags='writing creative', description='Creative writing description.')


async def seed_test_data():
    async with app.db_sessionmaker() as session:
        await enroll_program.create(session)
asyncio.run(seed_test_data())


def test_create_seed_data():
    # Seed camps
    enroll_raw_camps_data = [
        CampData(program_id=enroll_program.id,
                 primary_instructor_id=app.test.users.admin.id, is_published=True, capacity=10, cost=150, dates=[FastApiDate(2025, 1, 1)]),
        CampData(program_id=enroll_program.id,
                 primary_instructor_id=app.test.users.admin.id, is_published=True, capacity=10, cost=50, dates=[FastApiDate(2025, 2, 1)]),
        CampData(program_id=enroll_program.id,
                 primary_instructor_id=app.test.users.admin.id, is_published=True, capacity=10, cost=0, dates=[FastApiDate(2025, 2, 1)])
    ]
    global enroll_camps_json
    enroll_camps_json = []
    for camp_data in enroll_raw_camps_data:
        camp_json = json.loads(json.dumps(
            camp_data.dict(), indent=4, sort_keys=True, default=str))
        response = client.post('/camps', json=camp_json,
                               headers=app.test.users.test_enroll_headers)
        new_camp_json = response.json()
        enroll_camps_json.append(new_camp_json)

    # Seed coupons
    enroll_raw_coupon_data = [
        CouponData(code="BASIC", discount_type="dollars", discount_amount=1,
                   expiration=None, used_count=0, max_count=None, camp_ids=[]),
        CouponData(code="ANOTHERBASIC", discount_type="dollars", discount_amount=5,
                   expiration=None, used_count=0, max_count=None, camp_ids=[]),
        CouponData(code="THIRDBASIC", discount_type="percent", discount_amount=20,
                   expiration=None, used_count=0, max_count=None, camp_ids=[]),
        CouponData(code="MAXUSES_1", discount_type="dollars", discount_amount=1,
                   expiration=None, used_count=1, max_count=1, camp_ids=[]),
        CouponData(code="EXPIRED", discount_type="percent", discount_amount=10,
                   expiration=FastApiDate(1998, 1, 1), used_count=0, max_count=None, camp_ids=None),
        CouponData(code="CAMPONE", discount_type="dollars", discount_amount=10,
                   expiration=None, used_count=0, max_count=None, camp_ids=[enroll_camps_json[0]['id']]),
        CouponData(code="CAMPONEAGAIN", discount_type="percent", discount_amount=10,
                   expiration=None, used_count=0, max_count=None, camp_ids=[enroll_camps_json[0]['id']]),
        CouponData(code="CAMPTWO", discount_type="percent", discount_amount=20,
                   expiration=None, used_count=0, max_count=None, camp_ids=[enroll_camps_json[1]['id']]),
        CouponData(code="BOTHCAMPS", discount_type="percent", discount_amount=30,
                   expiration=None, used_count=0, max_count=None, camp_ids=[enroll_camps_json[0]['id'], enroll_camps_json[1]['id']]),
        CouponData(code="BOTHCAMPS_FIXED", discount_type="dollars", discount_amount=15,
                   expiration=None, used_count=0, max_count=None, camp_ids=[enroll_camps_json[0]['id'], enroll_camps_json[1]['id']])
    ]
    global enroll_coupons_json
    enroll_coupons_json = {}
    for coupon_data in enroll_raw_coupon_data:
        coupon_json = json.loads(json.dumps(
            coupon_data.dict(), indent=4, sort_keys=True, default=str))
        response = client.post('/coupons', json=coupon_json,
                               headers=app.test.users.test_enroll_headers)
        new_coupon_json = response.json()
        enroll_coupons_json[coupon_data.code] = new_coupon_json

    # Seed student
    enroll_student_data = StudentData(
        name='Karen Tester', birthdate=FastApiDate(1987, 6, 15), grade_level=6)
    enroll_student_json = json.loads(json.dumps(
        enroll_student_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post('/students', json=enroll_student_json,
                           headers=app.test.users.test_enroll_headers)
    enroll_student_json = response.json()
    global enroll_student_id
    enroll_student_id = enroll_student_json['id']

    global enroll_camp_1, enroll_camp_2, enroll_free_camp
    enroll_camp_1 = SingleEnrollmentData(
        camp_id=enroll_camps_json[0]['id'], student_id=enroll_student_id)
    enroll_camp_2 = SingleEnrollmentData(
        camp_id=enroll_camps_json[1]['id'], student_id=enroll_student_id)
    enroll_free_camp = SingleEnrollmentData(
        camp_id=enroll_camps_json[2]['id'], student_id=enroll_student_id)


def test_coupon_permission():
    enrollment_data = EnrollmentData(
        enrollments=[enroll_free_camp], coupons=['BASIC'], execute_transaction=True)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_201_CREATED, f'Error with initial enrollment with coupon BASIC.'
    response_json = response.json()
    total_cost = 0
    assert response_json['total_cost'] == total_cost
    disc_cost = 0
    assert response_json['disc_cost'] == disc_cost

    # User has already used this coupon
    enrollment_data = EnrollmentData(
        enrollments=[enroll_free_camp], coupons=['BASIC'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()[
        'detail'] == 'User has already used coupon code BASIC.'

    # Coupon at max uses
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1], coupons=['MAXUSES_1'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_410_GONE
    assert response.json()[
        'detail'] == 'Coupon code=MAXUSES_1 has reached the maximum number of uses.'

    # Mixing coupon types
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1], coupons=['ANOTHERBASIC', 'CAMPONE'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()[
        'detail'] == "Sorry, but we don't allow mixing coupons for individual camps and coupons for the total check out."

    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1], coupons=['CAMPONE', 'ANOTHERBASIC'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()[
        'detail'] == "Sorry, but we don't allow mixing coupons for individual camps and coupons for the total check out."

    # Two coupons for the total
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1], coupons=['ANOTHERBASIC', 'THIRDBASIC'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()[
        'detail'] == "Sorry, but we don't allow applying more than one coupon that applies to the total check out."

    # Camp not in the basket
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1], coupons=['CAMPTWO'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()[
        'detail'] == "The coupon code=CAMPTWO is intended for one or more specific camps, but none of those camps are in your basket."

    # Two coupons for the same camp
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1], coupons=['CAMPONE', 'BOTHCAMPS'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()[
        'detail'] == f"Sorry, but we only allow one coupon per camp. The coupon codes BOTHCAMPS and CAMPONE are both intended for the camp id = {enroll_camps_json[0]['id']} (Creative Writing Workshop on 2025-01-01)."

    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1], coupons=['CAMPONE', 'CAMPONEAGAIN'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()[
        'detail'] == f"Sorry, but we only allow one coupon per camp. The coupon codes CAMPONEAGAIN and CAMPONE are both intended for the camp id = {enroll_camps_json[0]['id']} (Creative Writing Workshop on 2025-01-01)."

    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_2], coupons=['CAMPTWO', 'BOTHCAMPS'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()[
        'detail'] == f"Sorry, but we only allow one coupon per camp. The coupon codes BOTHCAMPS and CAMPTWO are both intended for the camp id = {enroll_camps_json[1]['id']} (Creative Writing Workshop on 2025-02-01)."


def test_totals():
    camp_1_cost = enroll_camps_json[0]['cost']
    camp_2_cost = enroll_camps_json[1]['cost']

    # Total coupon - fixed
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1, enroll_camp_2], coupons=['ANOTHERBASIC'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_201_CREATED
    response_json = response.json()
    total_cost = (camp_1_cost + camp_2_cost) * 100
    assert response_json['total_cost'] == total_cost
    disc_cost = total_cost - \
        enroll_coupons_json['ANOTHERBASIC']['discount_amount'] * 100
    assert response_json['disc_cost'] == disc_cost

    # Total coupon - percent
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1, enroll_camp_2], coupons=['THIRDBASIC'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_201_CREATED
    response_json = response.json()
    total_cost = (camp_1_cost + camp_2_cost) * 100
    assert response_json['total_cost'] == total_cost
    disc_cost = total_cost * \
        (100 - enroll_coupons_json['THIRDBASIC']['discount_amount']) / 100
    assert response_json['disc_cost'] == disc_cost

    # Single camp coupon
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1, enroll_camp_2], coupons=['CAMPONE'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_201_CREATED
    response_json = response.json()
    total_cost = (camp_1_cost + camp_2_cost) * 100
    assert response_json['total_cost'] == total_cost
    disc_cost = (
        camp_1_cost - enroll_coupons_json['CAMPONE']['discount_amount'] + camp_2_cost) * 100
    assert response_json['disc_cost'] == disc_cost

    # Both individual camp coupons
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1, enroll_camp_2], coupons=['CAMPONE', 'CAMPTWO'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_201_CREATED
    response_json = response.json()
    total_cost = (camp_1_cost + camp_2_cost) * 100
    assert response_json['total_cost'] == total_cost
    disc_cost = (
        camp_1_cost - enroll_coupons_json['CAMPONE']['discount_amount'] + camp_2_cost * (100-enroll_coupons_json['CAMPTWO']['discount_amount'])/100) * 100
    assert response_json['disc_cost'] == disc_cost

    # Single coupon for two camps - percent
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1, enroll_camp_2], coupons=['BOTHCAMPS'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_201_CREATED
    response_json = response.json()
    total_cost = (camp_1_cost + camp_2_cost) * 100
    assert response_json['total_cost'] == total_cost
    disc_cost = total_cost * \
        (100 - enroll_coupons_json['BOTHCAMPS']['discount_amount']) / 100
    assert response_json['disc_cost'] == disc_cost

    # Single coupon for two camps - fixed
    enrollment_data = EnrollmentData(
        enrollments=[enroll_camp_1, enroll_camp_2], coupons=['BOTHCAMPS_FIXED'], execute_transaction=False)
    enrollment_data_json = json.loads(json.dumps(
        enrollment_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/enroll', json=enrollment_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_201_CREATED
    response_json = response.json()
    total_cost = (camp_1_cost + camp_2_cost) * 100
    assert response_json['total_cost'] == total_cost
    disc_cost = total_cost - 200 * \
        enroll_coupons_json['BOTHCAMPS_FIXED']['discount_amount']
    assert response_json['disc_cost'] == disc_cost


def test_move_student():
    # At this point, we know enroll_free_camp went through, but nothing else should have
    camp_id = enroll_free_camp.camp_id
    student_id = enroll_free_camp.student_id
    tgt_camp_id = enroll_camp_1.camp_id

    # Student doesn't exist
    bad_student_id = student_id + 1
    move_data = StudentMoveData(from_camp_id=camp_id, to_camp_id=tgt_camp_id)
    move_data_json = json.loads(json.dumps(
        move_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/students/{bad_student_id}/move', json=move_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    # Camp doesn't exist
    bad_camp_id = max(c['id'] for c in enroll_camps_json) + 1
    move_data = StudentMoveData(
        from_camp_id=camp_id, to_camp_id=bad_camp_id)
    move_data_json = json.loads(json.dumps(
        move_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/students/{student_id}/move', json=move_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

    # Already enrolled in target
    move_data = StudentMoveData(from_camp_id=camp_id, to_camp_id=camp_id)
    move_data_json = json.loads(json.dumps(
        move_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/students/{student_id}/move', json=move_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    # Not enrolled in source
    move_data = StudentMoveData(
        from_camp_id=tgt_camp_id, to_camp_id=tgt_camp_id)
    move_data_json = json.loads(json.dumps(
        move_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/students/{student_id}/move', json=move_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    # Successful
    move_data = StudentMoveData(from_camp_id=camp_id, to_camp_id=tgt_camp_id)
    move_data_json = json.loads(json.dumps(
        move_data.dict(), indent=4, sort_keys=True, default=str))
    response = client.post(f'/students/{student_id}/move', json=move_data_json,
                           headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_200_OK

    # Check the student
    response = client.get(
        f'/students/{student_id}', headers=app.test.users.test_enroll_headers)
    assert response.status_code == status.HTTP_200_OK
    response_json = response.json()
    src_camp = next(
        (camp for camp in response_json['student_camps'] if camp['id'] == camp_id), None)
    tgt_camp = next(
        (camp for camp in response_json['student_camps'] if camp['id'] == tgt_camp_id), None)
    assert src_camp is None
    assert tgt_camp is not None
