from pydantic import BaseModel, EmailStr, Field, validator

class UserCreate(BaseModel):
    first_name: str = Field(..., description = "Users first name")
    last_name: str = Field(..., description = "Users last name")
    email: EmailStr = Field(..., description = "Users Email")
    password: str = Field(..., description = "Users hashed password")

@validator("password")
def password_length_and_complexity(cls, v):
    if len(v.encode("utf-8")) > 72:
        raise ValueError("Password too long (max 72 bytes allowed)")
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not any(char.isdigit() for char in v):
        raise ValueError("Password must contain at least one number")
    if not any(char.isupper() for char in v):
        raise ValueError("Password must contain at least one uppercase letter")
    return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str