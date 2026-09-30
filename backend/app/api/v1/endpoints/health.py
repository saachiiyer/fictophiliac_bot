from fastapi import APIRouter
from app.core.config import settings
from app.schemas.health import HealthResponse
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def get_health():
    is_gemini_on = gemini_service.is_configured
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        gemini_configured=is_gemini_on,
        message="Gemini API is active" if is_gemini_on else "Running with curated catalog mock fallback (add GEMINI_API_KEY for live AI)"
    )

