from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.utils.responses import success_response

from app.profiles.schemas import (
    UserProfileCreate,
    UserProfileUpdate,
    UserProfileResponse,
    GoalSuggestionRequest,
)
from app.profiles.service import (
    create_new_profile,
    get_user_profile,
    update_existing_profile,
    delete_existing_profile,
)
from app.users.models import User

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"],
)


@router.post("/", response_model=dict)
def create_profile_endpoint(
    profile_data: UserProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = create_new_profile(
        db=db,
        profile_data=profile_data,
        user_id=current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=400,
            detail="Profile already exists",
        )

    return success_response(
        message="Profile created successfully",
        data=UserProfileResponse.model_validate(profile).model_dump(),
    )


@router.get("/", response_model=dict)
def get_profile_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = get_user_profile(
        db=db,
        user_id=current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Profile not found",
        )

    return success_response(
        message="Profile fetched successfully",
        data=UserProfileResponse.model_validate(profile).model_dump(),
    )


@router.put("/", response_model=dict)
def update_profile_endpoint(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = update_existing_profile(
        db=db,
        profile_data=profile_data,
        user_id=current_user.id,
    )

    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="Profile not found",
        )

    return success_response(
        message="Profile updated successfully",
        data=UserProfileResponse.model_validate(profile).model_dump(),
    )


@router.delete("/")
def delete_profile_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = delete_existing_profile(
        db=db,
        user_id=current_user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Profile not found",
        )

    return success_response(
        message="Profile deleted successfully",
    )

@router.post("/suggest-goals", response_model=dict)
def suggest_goals_endpoint(
    payload: GoalSuggestionRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Calculates suggested calorie and macro goals based on the user's
    body metrics and fitness goal, using the Mifflin-St Jeor equation.
    Used during onboarding to pre-fill the goals step.
    """
    from app.profiles.calculator import calculate_nutrition_goals

    goals = calculate_nutrition_goals(
        age=payload.age,
        gender=payload.gender,
        height_cm=float(payload.height_cm),
        weight_kg=float(payload.weight_kg),
        activity_level=payload.activity_level,
        fitness_goal=payload.fitness_goal,
    )

    return success_response(
        message="Goals calculated successfully",
        data=goals,
    )

