from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.recipes.router import router as recipes_router
from app.profiles.router import router as profiles_router
from app.users.models import User
from app.recipes.models import Recipe, RecipeItem
from app.custom_foods.models import CustomFood
from app.nutrition.models import Food
from app.users.router import router as users_router
setup_logging()

logger.info("Starting NutriTrack application")

app = FastAPI(title=settings.app_name)

# Register Routers
app.include_router(recipes_router)
app.include_router(profiles_router)

app.include_router(users_router)


@app.get("/")
def root():
    logger.info("Root endpoint accessed")

    return {
        "message": f"Welcome to {settings.app_name}",
        "environment": settings.environment,
        "debug": settings.debug,
    }