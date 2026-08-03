from uuid import UUID

from sqlalchemy.orm import Session

from app.profiles.models import UserProfile
from app.profiles.schemas import (
    UserProfileCreate,
    UserProfileUpdate,
)


def create_profile(
    db: Session,
    profile_data: UserProfileCreate,
    user_id: UUID,
):
    profile = UserProfile(
        user_id=user_id,
        full_name=profile_data.full_name,
        age=profile_data.age,
        gender=profile_data.gender,
        height_cm=profile_data.height_cm,
        weight_kg=profile_data.weight_kg,
        activity_level=profile_data.activity_level,
        fitness_goal=profile_data.fitness_goal,
        calorie_goal=profile_data.calorie_goal,
        protein_goal=profile_data.protein_goal,
        carbs_goal=profile_data.carbs_goal,
        fat_goal=profile_data.fat_goal,
        water_goal=profile_data.water_goal,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


def get_profile(
    db: Session,
    user_id: UUID,
):
    return (
        db.query(UserProfile)
        .filter(UserProfile.user_id == user_id)
        .first()
    )


def update_profile(
    db: Session,
    profile: UserProfile,
    profile_data: UserProfileUpdate,
):
    update_data = profile_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    return profile


def delete_profile(
    db: Session,
    profile: UserProfile,
):
    db.delete(profile)
    db.commit()