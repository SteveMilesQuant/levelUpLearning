from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any, Optional, List
from pydantic import BaseModel
from uuid import uuid4
from fastapi import HTTPException, status
from datamodels import Object, FastApiDate, EnrollmentData
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


class Enrollment(BaseModel):
    payment_token: Optional[str] = None
    coupon: Optional[Coupon] = None
    enrollments: Optional[List[SingleEnrollment]] = None
    total_cost: Optional[float] = 0
    penny_cost: Optional[int] = 0
    square_receipt_url: Optional[str] = None

    async def create(self, db_session: Any, enrollment_data: EnrollmentData, user_students: List[StudentDb]):
        self.payment_token = enrollment_data.payment_token

        # Create coupon
        self.coupon = None
        if enrollment_data.coupon_code:
            self.coupon = Coupon(code=enrollment_data.coupon_code)
            await self.coupon.create(db_session)
            if self.coupon.id is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"Coupon code={enrollment_data.coupon_code} not found.")
            if self.coupon.expiration and self.coupon.expiration < FastApiDate.today():
                raise HTTPException(
                    status_code=status.HTTP_410_GONE, detail=f"Coupon code={enrollment_data.coupon_code} expired on {self.coupon.expiration}.")
            if self.coupon.max_count and self.coupon.used_count >= self.coupon.max_count:
                raise HTTPException(
                    status_code=status.HTTP_410_GONE, detail=f"Coupon code={enrollment_data.coupon_code} has reached the maximum number of uses.")

        # Verify each enrollment and get total cost
        self.enrollments = []
        self.total_cost = 0
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

            enrollment = SingleEnrollment(student=student, camp=camp)
            self.enrollments.append(enrollment)
            self.total_cost = self.total_cost + (camp.cost or 0)

        percent_discount = 0
        fixed_discount = 0
        if self.coupon:
            if self.coupon.discount_type == "dollars":
                fixed_discount = self.coupon.discount_amount * 100
            elif self.coupon.discount_type == "percent":
                percent_discount = self.coupon.discount_amount
        self.penny_cost = self.total_cost * \
            (100 - percent_discount) - fixed_discount

    async def check_square_payment(self, square_client):
        square_payment_id = None
        square_order_id = None
        square_receipt_number = None
        self.square_receipt_url = None
        if self.penny_cost > 0:
            if self.payment_token is None:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED,
                                    detail=f"Square payment token is required on non-free camps.")
            create_payment_request = Object()
            create_payment_request.source_id = self.payment_token
            create_payment_request.idempotency_key = str(uuid4())
            create_payment_request.amount_money = Object()
            create_payment_request.amount_money.currency = "USD"
            create_payment_request.amount_money.amount = self.penny_cost
            square_response = square_client.payments.create_payment(
                create_payment_request)

            if square_response.is_error():
                raise HTTPException(status_code=square_response.status_code,
                                    detail=f"From square: {square_response.errors[0]['detail']}")

            square_payment = square_response.body['payment']
            paid_amount = square_payment['amount_money']['amount']
            if paid_amount < self.penny_cost:
                raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED,
                                    detail=f"Paid amount, ${paid_amount/100}, was less than expected amount, ${self.penny_cost/100}.")

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
                daily_time_range = camp.daily_time_range()
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
