from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    
    @field_validator('id', mode='before')
    @classmethod
    def uuid_to_str(cls, v):
        return str(v) 
    
    class Config:
        from_attributes = True