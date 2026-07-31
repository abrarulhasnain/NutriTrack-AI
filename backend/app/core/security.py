from supabase import create_client
from app.core.config import settings


supabase_client = create_client(
    settings.supabase_url,
    settings.supabase_anon_key
)


def verify_supabase_token(token: str) -> str:
    """
    Supabase ka access token verify karta hai (Admin API se)
    aur usme se user ki supabase_user_id nikal ke deta hai.
    Invalid ya expired token pe ValueError raise karta hai.
    """
    try:
        response = supabase_client.auth.get_user(token)
    except Exception:
        raise ValueError("Invalid or expired token")

    if not response or not response.user:
        raise ValueError("Invalid or expired token")

    return response.user.id