import os
import sys
import OpenSSL
from datetime import datetime, timedelta
from emailserver import EmailServer
from enrollment import CONFIRMATION_SENDER_EMAIL_KEY


def get_cert_expiry(cert_path):
    with open(cert_path, "rb") as f:
        cert_data = f.read()

    cert = OpenSSL.crypto.load_certificate(
        OpenSSL.crypto.FILETYPE_PEM, cert_data)
    expiry_str = cert.get_notAfter().decode("ascii")
    expiry_date = datetime.strptime(expiry_str, "%Y%m%d%H%M%SZ")
    return expiry_date


def next_saturday(d):
    days_ahead = (5 - d.weekday()) % 7  # Saturday is weekday 5 (Mon=0...Sun=6)
    # if today is Saturday, go to next Saturday
    days_ahead = 7 if days_ahead == 0 else days_ahead
    return d + timedelta(days=days_ahead)


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
    print(f"expiry: {expiry}")

    sys.exit(1)  # check with $?
