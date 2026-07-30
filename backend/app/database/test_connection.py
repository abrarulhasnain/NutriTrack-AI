import sys
from sqlalchemy import create_engine, text

from app.core.config import settings

engine = create_engine(settings.database_url)

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))

        print("\n[OK] Successfully connected to PostgreSQL!\n")
        print(result.scalar())

except Exception as e:
    print("\n[FAIL] Database connection failed!\n")
    print(e)
