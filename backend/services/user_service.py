from models.user_db import User
from sqlalchemy.orm import Session
from services.security_service import SecurityService
from fastapi import HTTPException

class UserService:
    def __init__(self, db: Session, security_service: SecurityService):
        self.db = db
        self.security = security_service
    
    def register_user(self, user_data: User):
        if not self.security.validate_email(user_data.email):
            return {"error": "Invalid email format"}

        if not self.security.validate_password(user_data.password):
            return {"error": "Weak password"}

        if self.db.query(User).filter(User.email == user_data.email).first():
            return {"error": "Email already exists"}

        hashed_password = self.security.hash_password(user_data.password)

        refreshToken = self.security.createRefeshToken(user_data.email)
        accessToken = self.security.createAccessToken(user_data.email)

        new_user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            hashed_password=hashed_password,
            refresh_token = refreshToken
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)

        return {"msg": "User registered successfully", "user_id": new_user.id, "refreshToken" : refreshToken, "accessToken" : accessToken}
    
    def login_user(self, email: str, password : str):
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        if not self.security.verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        refreshToken = self.security.createRefeshToken(email)
        accessToken = self.security.createAccessToken(email)

        user.refresh_token = refreshToken

        self.db.commit()
        self.db.refresh(user)

        return {"msg": "User login successfully", "user": user, "accessToken" : accessToken}
    
    def refresh_token(self, refreshToken : str):
        try:
            payload = self.security.verify_refresh_token(refreshToken)
            email = payload.get("sub")

            user = self.db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            new_refreshToken = self.security.createRefeshToken(email)
            new_accessToken = self.security.createAccessToken(email)

            user.refresh_token = new_refreshToken
            self.db.commit()
            self.db.refresh(user)
            return {"msg": "Tokens created successfully","accessToken" : new_accessToken, "refreshToken" : user.refresh_token}
        except ValueError as e:
            raise HTTPException(status_code=401, detail=str(e))
