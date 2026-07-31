from sqlalchemy.orm import Session
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
        # Pehle check karo agar already exist karta hai
        existing = self.db.query(User).filter(
            User.supabase_user_id == supabase_user_id
        ).first()

        if existing:
            return existing  # Already hai toh wahi return karo

        user = User(
            supabase_user_id=supabase_user_id,
            email=email,
            full_name=full_name
        )
        self.db.add(user)
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