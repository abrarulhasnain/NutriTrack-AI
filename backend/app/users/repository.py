from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.users.models import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: str):
        return self.db.query(User).filter(
            User.id == user_id
        ).first()

    def get_by_email(self, email: str):
        return self.db.query(User).filter(
            User.email == email
        ).first()

    def create(self, supabase_user_id: str, email: str, full_name: str = None):
        existing = self.db.query(User).filter(
            User.supabase_user_id == supabase_user_id
        ).first()
        if existing:
            return existing

        user = User(
            supabase_user_id=supabase_user_id,
            email=email,
            full_name=full_name
        )
        self.db.add(user)

        try:
            self.db.commit()
        except IntegrityError:
            # Another concurrent request (e.g. React StrictMode firing
            # the registration call twice) already created this user.
            # Roll back and return the row that now exists instead of crashing.
            self.db.rollback()
            return self.db.query(User).filter(
                User.supabase_user_id == supabase_user_id
            ).first()

        self.db.refresh(user)
        return user

    def update_supabase_id(self, user, new_supabase_id: str):
        user.supabase_user_id = new_supabase_id
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user_id: str):
        user = self.get_by_id(user_id)
        self.db.delete(user)
        self.db.commit()

    def get_by_supabase_id(self, supabase_user_id: str):
        return self.db.query(User).filter(
            User.supabase_user_id == supabase_user_id
        ).first()

