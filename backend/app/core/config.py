from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    app_name: str
    environment: str
    debug: bool
    database_url: str
    supabase_jwt_secret: str
    supabase_url: str
    supabase_anon_key: str

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        case_sensitive=False,
        extra="ignore"
    )


settings = Settings()