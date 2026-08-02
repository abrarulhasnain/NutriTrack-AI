from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user, get_verified_supabase_id
from app.users.service import UserService
from app.users.schemas import UserCreate, UserResponse
from app.users.models import User
from app.utils.responses import success_response, error_response


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/register" , response_model=None)
def register_user(
    payload: UserCreate,
    supabase_user_id : str = Depends(get_verified_supabase_id),
    db : Session = Depends(get_db)
):
    service = UserService(db)
    user = service.create_user(
        supabase_user_id=supabase_user_id,
        email=payload.email,
        full_name=payload.full_name
    )

    return success_response(
        message="User registered successfully",
        data = UserResponse.model_validate(user).model_dump()
    )
@router.get("/me", response_model=None)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return success_response(
        message="User fetched successfully",
        data=UserResponse.model_validate(current_user).model_dump()
    )