from fastapi import APIRouter
from app.api.v1.endpoints import recommendations, health, curated, community

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(curated.router, prefix="/curated", tags=["Curated & News"])
api_router.include_router(community.router, prefix="/community", tags=["Community & Reviews"])
