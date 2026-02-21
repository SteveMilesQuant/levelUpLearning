from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any, Optional, List
from user import User
from pydantic import BaseModel
from uuid import uuid4
from fastapi import HTTPException, status
from datamodels import HalfDayEnum, Object, FastApiDate, EnrollmentData
from db import StudentDb
from emailserver import EmailServer
from student import Student
from camp import Camp
from coupon import Coupon


CONFIRMATION_SENDER_EMAIL_KEY = "enrollment_confirmation"


CONFIRMATION_EMAIL_TEMPLATE = '''Hello {user_name},


Thank you for registering!{receipt_sentence}

{enrollment_summary}
Students get the most out of our camps when they are able to collaborate with peers so if you happen to know of anyone who might be interested in signing up, please consider sharing our information.  We will get back to you soon with more information.

Thank you!

Karen Miles and Megan Miller
Level Up Learning'''


class SingleEnrollment(BaseModel):
    student: Student
    camp: Camp
    half_day: Optional[HalfDayEnum]
    coupon: Optional[Coupon]
    total_cost: Optional[int] = 0
    disc_cost: Optional[int] = 0


class Enrollment(BaseModel):
    payment_token: Optional[str] = None
    coupons: List[Coupon] = None
    enrollments: Optional[List[SingleEnrollment]] = None
    total_cost: Optional[int] = 0
    disc_cost: Optional[int] = 0
    square_receipt_url: Optional[str] = None

    async def create(self, db_session: Any, user: User, enrollment_data: Optional[EnrollmentData], user_students: List[StudentDb]):
        self.payment_token = enrollment_data.payment_token

        # Create coupons
        self.coupons = []
        has_camp_coupons = False
        has_total_coupons = False
        for coupon_code in enrollment_data.coupons:
            coupon = Coupon(code=coupon_code)
            await coupon.create(db_session, read_only=True)
            if coupon.id is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"Coupon code={coupon_code} not found.")
            if coupon.expiration and coupon.expiration < FastApiDate.today():
                raise HTTPException(
                    status_code=status.HTTP_410_GONE, detail=f"Coupon code={coupon_code} expired on {coupon.expiration}.")
            if not coupon.user_can_reuse and await user.has_used_coupon(db_session, coupon.id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                    detail=f"User has already used coupon code {coupon.code}.")
            if coupon.max_count and coupon.used_count >= coupon.max_count:
                raise HTTPException(
                    status_code=status.HTTP_410_GONE, detail=f"Coupon code={coupon_code} has reached the maximum number of uses.")
            if coupon.camp_ids is None or len(coupon.camp_ids) == 0:
                if has_camp_coupons:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN, detail=f"Sorry, but we don't allow mixing coupons for individual camps and coupons for the total check out.")
                if has_total_coupons:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN, detail=f"Sorry, but we don't allow applying more than one coupon that applies to the total check out.")
                has_total_coupons = True
            else:
                if has_total_coupons:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN, detail=f"Sorry, but we don't allow mixing coupons for individual camps and coupons for the total check out.")
                has_camp_coupons = True

                any_camp_in_basket = False
                for camp_id in coupon.camp_ids:
                    # Get the camp
                    camp = Camp(id=camp_id)
                    await camp.create(db_session)
                    if camp.id is None:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={camp_id} not found.")
                    if not camp.is_published:
                        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                            detail=f"Camp id = {camp.id} ({camp.program.title} on {camp.dates[0]}) is not yet published for enrollment.")

                    # Check that the associated camp is in the basket
                    if any(camp_id == e_in.camp_id for e_in in enrollment_data.enrollments):
                        any_camp_in_basket = True

                    # Check that two coupons don't apply to the same camp
                    other_coupon = next(
                        (c for c in self.coupons if camp_id in c.camp_ids), None)
                    if other_coupon:
                        raise HTTPException(
                            status_code=status.HTTP_403_FORBIDDEN, detail=f"Sorry, but we only allow one coupon per camp. The coupon codes {coupon_code} and {other_coupon.code} are both intended for the camp id = {camp.id} ({camp.program.title} on {camp.dates[0]}).")

                if not any_camp_in_basket:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN, detail=f"The coupon code={coupon_code} is intended for one or more specific camps, but none of those camps are in your basket.")

            self.coupons.append(coupon)

        # Verify each enrollment and get total cost
        self.enrollments = []
        self.total_cost = 0
        self.disc_cost = 0
        for e_in in enrollment_data.enrollments:
            camp = Camp(id=e_in.camp_id)
            await camp.create(db_session)
            if camp.id is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"Camp id={e_in.camp_id} not found.")
            if not camp.is_published:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                    detail=f"Camp id={e_in.camp_id} is not yet published for enrollment.")

            student = Student(id=e_in.student_id)
            await student.create(db_session)
            if student.id is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"Student id={e_in.student_id} not found.")
            if student._db_obj not in user_students:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail=f"Student id={e_in.student_id} does not belong to this user.")
            if any(sc.id == camp.id for sc in student.student_camps):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail=f"Student id={e_in.student_id} is already enrolled in camp id={camp.id}.")

            # Check half day permission
            if e_in.half_day in ("AM", "PM"):
                if not camp.enroll_half_day_allowed:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN, detail=f"Camp id={camp.id} does not allow half day enrollment.")
            else:
                if not camp.enroll_full_day_allowed:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN, detail=f"Camp id={camp.id} does not allow full day enrollment (i.e. only half day).")

            # Find an applicable coupon (should only be one)
            if has_total_coupons:
                coupon = self.coupons[0]
            elif has_camp_coupons:
                coupon = next(
                    (c for c in self.coupons if camp.id in c.camp_ids), None)
            else:
                coupon = None

            # Account for coupon
            percent_discount = 0
            fixed_discount = 0
            if not camp.enroll_half_day_allowed or e_in.half_day is None:
                single_camp_total_cost = (camp.cost or 0)
            else:
                single_camp_total_cost = (camp.half_day_cost or 0)
            if coupon and camp.coupons_allowed:
                # fixed total coupon handled at end, so as to not count double
                if coupon.discount_type == "dollars" and (has_camp_coupons or coupon.applies_to_all):
                    fixed_discount = coupon.discount_amount * 100
                elif coupon.discount_type == "percent":
                    percent_discount = coupon.discount_amount
            single_camp_disc_cost = single_camp_total_cost * \
                (100 - percent_discount) - fixed_discount

            # Create single enrollment record
            enrollment = SingleEnrollment(
                student=student,
                camp=camp,
                coupon=coupon,
                total_cost=single_camp_total_cost * 100,
                disc_cost=single_camp_disc_cost,
                half_day=e_in.half_day
            )
            self.enrollments.append(enrollment)

            # Update total cost (without coupons) and discounted cost (with coupons)
            self.total_cost = self.total_cost + single_camp_total_cost * 100
            self.disc_cost = self.disc_cost + single_camp_disc_cost

        # Final adjustment
        if has_total_coupons and self.coupons[0] and self.coupons[0].discount_type == "dollars" and not self.coupons[0].applies_to_all:
            self.disc_cost = self.disc_cost - \
                self.coupons[0].discount_amount * 100
        self.disc_cost = max(self.disc_cost, 0)

    async def check_square_payment(self, square_client):
        square_payment_id = None
        square_order_id = None
        square_receipt_number = None
        self.square_receipt_url = None
        if self.disc_cost > 0:
            if self.payment_token is None:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED,
                                    detail=f"Square payment token is required on non-free camps.")
            create_payment_request = Object()
            create_payment_request.source_id = self.payment_token
            create_payment_request.idempotency_key = str(uuid4())
            create_payment_request.amount_money = Object()
            create_payment_request.amount_money.currency = "USD"
            create_payment_request.amount_money.amount = self.disc_cost
            square_response = square_client.payments.create_payment(
                create_payment_request)

            if square_response.is_error():
                raise HTTPException(status_code=square_response.status_code,
                                    detail=f"From square: {square_response.errors[0]['detail']}")

            square_payment = square_response.body['payment']
            paid_amount = square_payment['amount_money']['amount']
            if paid_amount < self.disc_cost:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED,
                                    detail=f"Paid amount, ${paid_amount/100}, was less than expected amount, ${self.disc_cost/100}.")

            square_payment_id = square_payment['id']
            square_order_id = square_payment['order_id']
            square_receipt_number = square_payment['receipt_number']
            self.square_receipt_url = square_payment['receipt_url']
        return [square_payment_id, square_order_id, square_receipt_number]

    def enrollment_summary(self) -> str:
        enrollments_by_child = {}
        for enrollment in self.enrollments:
            enrollment_list = enrollments_by_child.get(enrollment.student.name)
            if enrollment_list is None:
                enrollment_list = []
                enrollments_by_child[enrollment.student.name] = enrollment_list
            enrollment_list.append(enrollment)

        enrollment_summary = ""
        for child_name, enrollment_list in enrollments_by_child.items():
            enrollment_summary = enrollment_summary + \
                f"We have reserved {child_name}'s spot in:\n"
            for enrollment in enrollment_list:
                camp = enrollment.camp
                date_range = camp.date_range()
                daily_time_range = camp.daily_time_range(enrollment.half_day)
                location = camp.location if camp.location and camp.location != "" else "TBD"
                enrollment_summary = enrollment_summary + \
                    f"\t{camp.program.title} ({date_range} from {daily_time_range})\n\t\tLocation: {location}\n"

        return enrollment_summary

    async def send_confirmation_email(self, email_server: EmailServer, user_name: str, user_email: str) -> None:
        sender_email = email_server.sender_emails.get(
            CONFIRMATION_SENDER_EMAIL_KEY)
        if sender_email is None:
            return
        message = MIMEMultipart("alternative")
        message.attach(
            MIMEText(
                '<pre style="font-family: georgia,serif;">' + CONFIRMATION_EMAIL_TEMPLATE.format(
                    user_name=user_name,
                    receipt_sentence=f' <a href="{self.square_receipt_url}">Here is a link to your receipt.</a>' or "",
                    enrollment_summary=self.enrollment_summary(),
                ) + '</pre>', 'html'
            )
        )
        message["Subject"] = "Camp Registration Confirmation"
        message["From"] = sender_email
        message["Bcc"] = sender_email
        message["To"] = user_email
        await email_server.send_email(message)
