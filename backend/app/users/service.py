from sqlalchemy.orm import Session
from app.users.repository import UserRepository


class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def create_user(self, supabase_user_id: str, email: str, full_name: str = None):
        # check karo pehle se koi user is email se exist to nahi karta
        existing_user = self.repository.get_by_email(email)
        if existing_user:
            # Agar email match ho raha hai lekin supabase_user_id alag hai,
            # to iska matlab hai user ne kisi doosre login method se
            # (jaise Google) sign-in kiya hai. Us row ka ID update kar do.
            if existing_user.supabase_user_id != supabase_user_id:
                return self.repository.update_supabase_id(existing_user, supabase_user_id)
            return existing_user  # already exists aur match bhi karta hai
        return self.repository.create(
            supabase_user_id=supabase_user_id,
            email=email,
            full_name=full_name
        )

    def get_user_by_id(self, user_id: str):
        return self.repository.get_by_id(user_id)

    def get_user_by_email(self, email: str):
        return self.repository.get_by_email(email)
