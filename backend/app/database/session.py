from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# Create a single database engine using psycopg (v3) as the driver
engine = create_engine(
    settings.database_url,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

# Factory for creating database sessions
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    class_=Session,
)


def get_db():
    """
    Dependency that provides a database session.
    A new session is created for each request and
    automatically closed afterward.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()