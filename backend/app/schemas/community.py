from typing import Optional
from pydantic import BaseModel, Field

class BookSearchResult(BaseModel):
    title: str = Field(..., description="Book title")
    author: str = Field(..., description="Author name")
    year: Optional[str] = Field(None, description="Publication year")
    cover_url: str = Field(..., description="Cover image URL")

class VerifyUrlRequest(BaseModel):
    url: str = Field(..., description="Book link (Amazon, Goodreads, etc.)")

class VerifyUrlResponse(BaseModel):
    verified: bool = Field(..., description="Whether book was verified")
    title: Optional[str] = Field(None, description="Recognized title")
    author: Optional[str] = Field(None, description="Recognized author")
    cover_url: Optional[str] = Field(None, description="Book cover thumbnail")
    message: str = Field(..., description="Feedback message")

class UserRecommendationSubmission(BaseModel):
    title: str = Field(..., description="Recommended book title")
    author: str = Field(..., description="Author name")
    source_url: Optional[str] = Field(None, description="Source URL or recognition source")
    note: Optional[str] = Field(None, description="User note or recommendation reason")

class BookReviewItem(BaseModel):
    id: str = Field(..., description="Unique review identifier")
    book_title: str = Field(..., description="Title of the book reviewed")
    book_author: str = Field(..., description="Author of the book")
    reviewer: str = Field(..., description="Name of the reviewer")
    reviewer_handle: str = Field(..., description="Social handle (e.g. @_fictophiliac_)")
    rating: float = Field(..., description="Rating out of 5")
    quote: str = Field(..., description="Pull quote or review snippet")
    cover_url: str = Field(..., description="Book cover image URL")
    platform: str = Field(..., description="Instagram, Goodreads, TikTok")
    post_url: str = Field(..., description="Direct link to post/video")
    media_type: str = Field("review", description="review or video_reel")
    is_creator: bool = Field(False, description="Whether this is from creator Saachi Iyer")

