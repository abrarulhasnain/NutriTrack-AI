from uuid import UUID

from sqlalchemy.orm import Session

from app.profiles.repository import (
    create_profile,
    get_profile,
    update_profile,
    delete_profile,
)
from app.profiles.schemas import (
    UserProfileCreate,
    UserProfileUpdate,
)


def create_new_profile(
    db: Session,
    profile_data: UserProfileCreate,
    user_id: UUID,
):
    existing_profile = get_profile(
        db=db,
        user_id=user_id,
    )

    if existing_profile is not None:
        return None

    return create_profile(
        db=db,
        profile_data=profile_data,
        user_id=user_id,
    )


def get_user_profile(
    db: Session,
    user_id: UUID,
):
    return get_profile(
        db=db,
        user_id=user_id,
    )


def update_existing_profile(
    db: Session,
    profile_data: UserProfileUpdate,
    user_id: UUID,
):
    profile = get_profile(
        db=db,
        user_id=user_id,
    )

    if profile is None:
        return None

    return update_profile(
        db=db,
        profile=profile,
        profile_data=profile_data,
    )


def delete_existing_profile(
    db: Session,
    user_id: UUID,
):
    profile = get_profile(
        db=db,
        user_id=user_id,
    )

    if profile is None:
        return False

    delete_profile(
        db=db,
        profile=profile,
    )

    return True