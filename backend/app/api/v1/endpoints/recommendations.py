from fastapi import APIRouter, HTTPException, status
from app.core.logging import logger
from app.schemas.recommendation import (
    RecommendRequest,
    ReplaceRequest,
    RecommendationResponse,
    BookRecommendation
)
from app.services.gemini_service import gemini_service
from app.services.cover_service import cover_service

router = APIRouter()

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(req: RecommendRequest):
    """
    Generate personalized book recommendations based on user's reading history,
    favorite authors, and preferred genres.
    """
    logger.info(
        f"Recommendation request: {len(req.previous_reads)} past reads, "
        f"{len(req.favorite_authors)} authors, {len(req.preferred_genres)} genres, "
        f"{len(req.excluded_titles)} excluded titles."
    )

    books = gemini_service.generate_recommendations(
        previous_reads=req.previous_reads,
        favorite_authors=req.favorite_authors,
        preferred_genres=req.preferred_genres,
        excluded_titles=req.excluded_titles,
        count=req.count
    )

    enriched_books = await cover_service.enrich_books_with_covers(books)

    return RecommendationResponse(
        recommendations=enriched_books,
        message=f"Successfully generated {len(enriched_books)} personalized recommendations.",
        total=len(enriched_books)
    )

@router.post("/replace", response_model=BookRecommendation)
async def replace_book(req: ReplaceRequest):
    """
    Replace a single book marked as read with an alternative recommendation,
    preventing duplicates by updating the exclusion list.
    """
    logger.info(f"Replacing book marked as read: '{req.read_book}'")

    all_excluded = list(set(req.excluded_titles + [req.read_book]))
    all_past_reads = list(set(req.previous_reads + [req.read_book]))

    books = gemini_service.generate_recommendations(
        previous_reads=all_past_reads,
        favorite_authors=req.favorite_authors,
        preferred_genres=req.preferred_genres,
        excluded_titles=all_excluded,
        count=1
    )

    if not books:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unable to find an alternative recommendation."
        )

    enriched = await cover_service.enrich_books_with_covers(books)
    return enriched[0]

@router.post("/chat-react")
async def chat_react(req: dict):
    """
    Intelligently reads the room and dynamically responds to user's chat input
    with empathy, cultural context, and tone awareness.
    """
    step = req.get("step", 1)
    input_text = req.get("input_text", "")
    previous_reads = req.get("previous_reads", [])
    favorite_authors = req.get("favorite_authors", [])
    preferred_genres = req.get("preferred_genres", [])

    reaction = gemini_service.generate_chat_reaction(
        step=step,
        user_input=input_text,
        previous_reads=previous_reads,
        favorite_authors=favorite_authors,
        preferred_genres=preferred_genres
    )
    return reaction

