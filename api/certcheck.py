import os
import sys
import OpenSSL
from datetime import datetime, timedelta
from emailserver import EmailServer
from enrollment import CONFIRMATION_SENDER_EMAIL_KEY
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import asyncio
from enum import IntEnum


class Health(IntEnum):
    GOOD = 0
    FINE = 1
    POOR = 2

    def to_string(self) -> str:
        return self.name

    def to_html(self) -> str:
        color = {
            Health.GOOD: "green",
            Health.FINE: "orange",
            Health.POOR: "red",
        }[self]
        return f'<span style="color: {color};">{self.name}</span>'


HEALTHCHECK_EMAIL_TEMPLATE = '''Hello LUL owners,

Your technical health is {summary_status}. Individual checks:
{health_check_list}
Sincerely,

Your email bot
'''


def get_cert_expiry(cert_path):
    with open(cert_path, "rb") as f:
        cert_data = f.read()

    cert = OpenSSL.crypto.load_certificate(
        OpenSSL.crypto.FILETYPE_PEM, cert_data)
    expiry_str = cert.get_notAfter().decode("ascii")
    expiry_date = datetime.strptime(expiry_str, "%Y%m%d%H%M%SZ")
    return expiry_date


async def send_health_check_email(email_server: EmailServer, summary_status: str, health_check_list: str):
    sender_email = email_server.sender_emails.get(
        CONFIRMATION_SENDER_EMAIL_KEY)
    if sender_email is None:
        return
    message = MIMEMultipart("alternative")
    message.attach(
        MIMEText(
            '<pre style="font-family: georgia,serif;">' + HEALTHCHECK_EMAIL_TEMPLATE.format(
                summary_status=summary_status,
                health_check_list=health_check_list,
            ) + '</pre>', 'html'
        )
    )
    message["Subject"] = f"Technical health check - {summary_status}"
    message["From"] = sender_email
    message["Cc"] = sender_email
    message["To"] = "steven.miles.quant@gmail.com"
    await email_server.send_email(message)

if __name__ == "__main__":
    # Initiatlize overall status
    summary_status = Health.GOOD
    HEALTH_CHECKLIST = ""

    # Check certification
    expiry = get_cert_expiry("/etc/letsencrypt/fullchain.pem")
    if expiry < datetime.now():
        cert_status = Health.POOR
    elif expiry < datetime.now() + timedelta(days=30):
        cert_status = Health.FINE
    else:
        cert_status = Health.GOOD
    HEALTH_CHECKLIST = HEALTH_CHECKLIST + \
        f"   • Certification ({cert_status.to_html()}): Expires on {expiry}\n"
    summary_status = max(summary_status, cert_status)

    # Check hard drive space (passed in as env variable)
    CHECK_DISK_PCT = int(os.getenv("CHECK_DISK_PCT", "500"))
    if CHECK_DISK_PCT < 80:
        disk_status = Health.GOOD
    elif CHECK_DISK_PCT < 90:
        disk_status = Health.FINE
    else:
        disk_status = Health.POOR
    HEALTH_CHECKLIST = HEALTH_CHECKLIST + \
        f"   • Server disk ({disk_status.to_html()}): {CHECK_DISK_PCT}% usage\n"
    summary_status = max(summary_status, disk_status)

    # Send email
    email_server = EmailServer(
        host=os.environ.get("SMTP_HOST", None),
        port=os.environ.get("SMTP_PORT", None),
        user=os.environ.get("SMTP_USER", None),
        password=os.environ.get("SMTP_PASSWORD", None),
        sender_emails={CONFIRMATION_SENDER_EMAIL_KEY: os.environ.get(
            "CONFIRMATION_EMAIL_SENDER", None)}
    )
    asyncio.run(send_health_check_email(
        email_server, summary_status.to_string(), HEALTH_CHECKLIST))
