from fastapi import APIRouter, HTTPException, status
from app.schemas.curated import CuratedResponse, CuratedCategory
from app.services.curated_service import curated_service

router = APIRouter()

@router.get("", response_model=CuratedResponse)
def get_curated_shelves():
    """Retrieve curated shelves: Booker Prize, Goodreads Top, Indian & Global Bestsellers, Adaptations."""
    categories = curated_service.get_all_categories()
    return CuratedResponse(categories=categories)

@router.get("/{category_id}", response_model=CuratedCategory)
def get_curated_shelf(category_id: str):
    """Retrieve a specific category shelf by ID."""
    cat = curated_service.get_category_by_id(category_id)
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Curated category not found")
    return cat
