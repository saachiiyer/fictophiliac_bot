from typing import List
from fastapi import APIRouter, Query, HTTPException, status
from app.schemas.community import (
    BookSearchResult,
    VerifyUrlRequest,
    VerifyUrlResponse,
    UserRecommendationSubmission,
    BookReviewItem,
)
from app.services.community_service import community_service

router = APIRouter()

@router.get("/search-books", response_model=List[BookSearchResult])
async def search_books(q: str = Query(..., min_length=2, description="Book title or author search term")):
    """Autocomplete / recognition search for books."""
    return await community_service.search_books(q)

@router.post("/verify-and-add-url", response_model=VerifyUrlResponse)
async def verify_url(payload: VerifyUrlRequest):
    """Verify purchase / Goodreads URL and add book to database."""
    if not payload.url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="URL cannot be empty")
    return await community_service.verify_url_and_add(payload.url)

@router.post("/submit-recommendation")
def submit_recommendation(payload: UserRecommendationSubmission):
    """Submit a recognized book recommendation from the community."""
    community_service.add_submission(payload)
    return {
        "status": "success",
        "message": f"Thank you! \"{payload.title}\" has been added to our literary recommendation queue."
    }

@router.get("/reviews", response_model=List[BookReviewItem])
def get_reviews():
    """Retrieve Bookstagram reviews from Saachi (@_fictophiliac_) and community reels."""
    return community_service.get_reviews()

