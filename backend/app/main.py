from app.database import init_db
from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.users.router import router as users_router
from app.recipes.router import router as recipes_router

setup_logging()

logger.info("Starting NutriTrack application")

app = FastAPI(title=settings.app_name)

# Register Routers
app.include_router(users_router)
app.include_router(recipes_router)


@app.get("/")
def root():
    logger.info("Root endpoint accessed")

    return {
        "message": f"Welcome to {settings.app_name}",
        "environment": settings.environment,
        "debug": settings.debug,
    }