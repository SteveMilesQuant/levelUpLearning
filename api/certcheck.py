import os
import sys
import OpenSSL
from datetime import datetime, timedelta
from emailserver import EmailServer
from enrollment import CONFIRMATION_SENDER_EMAIL_KEY
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import asyncio

CERTGOOD_EMAIL_TEMPLATE = '''Hello LUL owners,

Your certification is still valid and expires on {expiry}. Once we are within 30 days, we will renew.

Sincerely,

Your email bot
'''

CERTEXPIRED_EMAIL_TEMPLATE = '''Hello LUL owners,

Your certification expires soon on {expiry}. Steve should renew by running the "Post-routing steps" from github.

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


async def send_cert_expired_email(email_server: EmailServer, expiry: datetime):
    sender_email = email_server.sender_emails.get(
        CONFIRMATION_SENDER_EMAIL_KEY)
    if sender_email is None:
        return
    message = MIMEMultipart("alternative")
    message.attach(
        MIMEText(
            '<pre style="font-family: georgia,serif;">' + CERTEXPIRED_EMAIL_TEMPLATE.format(
                expiry=expiry,
            ) + '</pre>', 'html'
        )
    )
    message["Subject"] = "Website certification check - SOON TO EXPIRE"
    message["From"] = sender_email
    message["Cc"] = sender_email
    message["To"] = "steven.miles.quant@gmail.com"
    await email_server.send_email(message)


async def send_cert_not_expired_email(email_server: EmailServer, expiry: datetime):
    sender_email = email_server.sender_emails.get(
        CONFIRMATION_SENDER_EMAIL_KEY)
    if sender_email is None:
        return
    message = MIMEMultipart("alternative")
    message.attach(
        MIMEText(
            '<pre style="font-family: georgia,serif;">' + CERTGOOD_EMAIL_TEMPLATE.format(
                expiry=expiry,
            ) + '</pre>', 'html'
        )
    )
    message["Subject"] = "Website certification check - VALID"
    message["From"] = sender_email
    message["Cc"] = sender_email
    message["To"] = "steven.miles.quant@gmail.com"
    await email_server.send_email(message)

if __name__ == "__main__":
    email_server = EmailServer(
        host=os.environ.get("SMTP_HOST", None),
        port=os.environ.get("SMTP_PORT", None),
        user=os.environ.get("SMTP_USER", None),
        password=os.environ.get("SMTP_PASSWORD", None),
        sender_emails={CONFIRMATION_SENDER_EMAIL_KEY: os.environ.get(
            "CONFIRMATION_EMAIL_SENDER", None)}
    )

    expiry = get_cert_expiry("/etc/letsencrypt/fullchain.pem")
    if expiry < datetime.now() + timedelta(days=30):
        asyncio.run(send_cert_expired_email(email_server, expiry))
        sys.exit(1)
    else:
        asyncio.run(send_cert_not_expired_email(email_server, expiry))
        sys.exit(0)  # check with $?
