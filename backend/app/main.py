from app.database import init_db
from fastapi import FastAPI
from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.recipes.router import router as recipes_router
from app.profiles.router import router as profiles_router
from app.custom_foods.router import router as custom_foods_router
from app.water.router import router as water_router
from app.users.models import User
from app.recipes.models import Recipe, RecipeItem
from app.custom_foods.models import CustomFood
from app.nutrition.models import Food
from app.water.models import WaterLog
from app.users.router import router as users_router
from app.meals.router import router as meals_router
from app.ai.router import router as ai_router
from app.dashboard.router import router as dashboard_router
from app.reports.router import router as reports_router

setup_logging()
logger.info("Starting NutriTrack application")
app = FastAPI(title=settings.app_name)

# Register Routers
app.include_router(users_router)
app.include_router(meals_router)
app.include_router(ai_router)
app.include_router(profiles_router)
app.include_router(recipes_router)
app.include_router(custom_foods_router)
app.include_router(water_router)
app.include_router(dashboard_router)
app.include_router(reports_router)


@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    return {
        "message": f"Welcome to {settings.app_name}",
        "environment": settings.environment,
        "debug": settings.debug,
    }