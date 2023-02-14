import jwt
from typing import Any, Optional
from pydantic import BaseModel
from datetime import datetime
from pytz import UTC as utc


class JWTMeta(BaseModel):
    exp: datetime
    sub: str


class JWTUser(JWTMeta):
    user_id: str


def user_id_to_auth_token(app: Any, user_id: int) -> str:
    token_expiration = datetime.utcnow() + app.config.jwt_lifetime
    jwt_content = JWTUser(user_id = user_id, exp = token_expiration, sub = app.config.jwt_subject).dict()
    token = jwt.encode(jwt_content, app.config.secret_key, algorithm = app.config.jwt_algorithm)
    return (token, token_expiration)


def auth_token_to_user_id(app: Any, token: Optional[str]) -> Optional[int]:
    if not token:
        return None
    decoded_token = JWTUser(**jwt.decode(token, app.config.secret_key, algorithms=[app.config.jwt_algorithm]))
    if decoded_token.exp < utc.localize(datetime.utcnow()):
        return None
    return decoded_token.user_id

