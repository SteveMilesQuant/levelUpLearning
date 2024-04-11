from aiosmtplib import SMTP
from typing import Dict
from pydantic import BaseModel, PrivateAttr
from email.mime.multipart import MIMEMultipart


class EmailServer(BaseModel):
    sender_emails: Dict[str, str] = {}
    _host: str = PrivateAttr()
    _port: str = PrivateAttr()
    _user: str = PrivateAttr()
    _password: str = PrivateAttr()

    def __init__(self, host: str, port: str, user: str, password: str, **data):
        super().__init__(**data)
        self._host = host
        self._port = port
        self._user = user
        self._password = password

    async def send_email(self, message: MIMEMultipart):
        server = SMTP(hostname=self._host, port=self._port, start_tls=True)
        print(f'Email host: {self._host}')
        print(f'Email port: {self._port}')
        print(f'Email user: {self._user}')
        print(f'Email password: {self._password}')
        return
        try:
            await server.connect()
            await server.login(self._user, self._password)
            await server.send_message(message)
            print(f'Sent email to {message["To"]}')
        except Exception as e:
            print(f"Email error occurrred: {e}")
        finally:
            await server.quit()
