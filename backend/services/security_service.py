import bcrypt
import re
import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta
import os

load_dotenv()

class SecurityService:
    def __init__(self):
        self.jwtSecret = os.getenv("JWT_SECRET")
        self.algo = "HS256"
        self.ACCESS_TOKEN_EXPIRE_TIME = 15
        self.REFRESH_TOKEN_EXPIRE_TIME = 7

    def _truncate_password(self, password: str) -> bytes:
        password_bytes = password.encode("utf-8")
        
        if len(password_bytes) <= 72:
            return password_bytes
        truncated = password_bytes[:72]
        try:
            truncated.decode("utf-8")
            return truncated
        except UnicodeDecodeError:
            for i in range(71, 67, -1):
                try:
                    truncated = password_bytes[:i]
                    truncated.decode("utf-8")
                    return truncated
                except UnicodeDecodeError:
                    continue
            # Fallback
            return password_bytes[:72].decode("utf-8", "ignore").encode("utf-8")

    def hash_password(self, password: str) -> str:
        truncated_password = self._truncate_password(password)
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(truncated_password, salt)
        return hashed.decode("utf-8")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        truncated_password = self._truncate_password(plain_password)
        return bcrypt.checkpw(truncated_password, hashed_password.encode("utf-8"))

    def validate_email(self, email: str) -> bool:
        return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

    def validate_password(self, password: str) -> bool:
        return (
            len(password) >= 8
            and re.search(r"\d", password)
            and re.search(r"[A-Z]", password)
        )
    
    def createRefeshToken(self, email : str)-> str:
        payload = {
            "sub" : email,
            "exp" : datetime.utcnow() + timedelta(days = self.REFRESH_TOKEN_EXPIRE_TIME),
            "type" : "refresh"
        }

        return jwt.encode(payload, self.jwtSecret, algorithm= self.algo)
    
    def createAccessToken(self, email : str)-> str:
        payload = {
            "sub" : email,
            "exp" : datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_TIME),
            "type" : "access"
        }

        return jwt.encode(payload, self.jwtSecret, algorithm= self.algo)
    
    def verify_access_token(self, token: str) -> dict:
        return self._decode_token(token, "access")

    def verify_refresh_token(self, token: str) -> dict:
        return self._decode_token(token, "refresh")
    
    def _decode_token(self, token : str, expected_type : str) -> dict:
        try:
            payload = jwt.decode(token, self.jwtSecret, algorithms=self.algo)
            if payload.get("type") != expected_type:
                raise ValueError(f"Invalid token type: expected {expected_type}")
            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError(f"{expected_type.capitalize()} token expired")
        except jwt.InvalidTokenError:
            raise ValueError(f"Invalid {expected_type} token")