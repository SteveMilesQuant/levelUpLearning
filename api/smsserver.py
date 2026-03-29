from twilio.rest import Client


class SmsServer:
    def __init__(self, account_sid: str, auth_token: str, from_number: str):
        self._client = Client(account_sid, auth_token)
        self._from_number = from_number

    def send_sms(self, to: str, body: str):
        try:
            message = self._client.messages.create(
                body=body,
                from_=self._from_number,
                to=to
            )
            print(f'Sent SMS to {to} (SID: {message.sid})')
        except Exception as e:
            print(f"SMS error occurred: {e}")
