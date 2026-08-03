from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.users.models import User
from app.utils.responses import success_response, error_response

from app.ai.schemas import AIExtractRequest, AIExtractResponse
from app.ai.service import process_ai_extraction

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post("/extract", response_model=None)
def extract_and_log_meal(
    payload: AIExtractRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Takes raw food text from the user, identifies individual food items
    using AI, matches them against the foods table, and auto-creates
    a meal if all items are matched with high confidence.
    """
    try:
        result: AIExtractResponse = process_ai_extraction(db, current_user.id, payload)
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content=error_response(message=str(e))
        )

    if result.meal_created:
        message = "Meal identified and logged successfully"
    else:
        message = "Some items could not be confidently matched, please confirm manually"

    return success_response(
        message=message,
        data=result.model_dump()
    )