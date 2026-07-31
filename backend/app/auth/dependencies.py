from fastapi import Depends , HTTPException , status
from fastapi.security import HTTPBearer , HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.security import verify_supabase_token
from app.users.repository import UserRepository
from app.users.models import User


security_scheme = HTTPBearer()

def get_current_user(
        credentials : HTTPAuthorizationCredentials = Depends(security_scheme),
        db : Session = Depends(get_db) 
) -> User:

    token = credentials.credentials
    try:
        supabase_user_id = verify_supabase_token(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )    
    repository = UserRepository(db)
    user = repository.get_by_supabase_id(supabase_user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User registered nahi hai. Pehle /users/register call karo."
        )

    return user

def get_verified_supabase_id(
        credentials : HTTPAuthorizationCredentials = Depends(security_scheme)
) -> str:
    token = credentials.credentials
    try:
        supabase_user_id = verify_supabase_token(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    return supabase_user_id