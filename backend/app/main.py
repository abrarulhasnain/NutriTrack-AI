from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import logger, setup_logging

setup_logging()

logger.info("Starting NutriTrack application")

app = FastAPI(title=settings.app_name)


@app.get("/")
def root():
    logger.info("Root endpoint accessed")

    return {
        "message": f"Welcome to {settings.app_name}",
        "environment": settings.environment,
        "debug": settings.debug,
    }