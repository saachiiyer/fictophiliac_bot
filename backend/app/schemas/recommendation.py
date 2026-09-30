from typing import List, Optional
from pydantic import BaseModel, Field

class RecommendRequest(BaseModel):
    previous_reads: List[str] = Field(default_factory=list, description="Titles/authors of past reads")
    favorite_authors: List[str] = Field(default_factory=list, description="User's favorite authors")
    preferred_genres: List[str] = Field(default_factory=list, description="Target genres / tropes")
    excluded_titles: List[str] = Field(default_factory=list, description="Books already read or suggested")
    count: int = Field(default=6, ge=1, le=10, description="Number of recommendations requested")

class ReplaceRequest(BaseModel):
    read_book: str = Field(..., description="Title of the book marked as read")
    previous_reads: List[str] = Field(default_factory=list)
    favorite_authors: List[str] = Field(default_factory=list)
    preferred_genres: List[str] = Field(default_factory=list)
    excluded_titles: List[str] = Field(default_factory=list)

class BookRecommendation(BaseModel):
    title: str
    author: str
    genre: str
    summary: str
    match_reason: str
    page_count: Optional[str] = "N/A"
    cover_url: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[BookRecommendation]
    message: str
    total: int

class ChatReactRequest(BaseModel):
    step: int = Field(..., description="Step 1 (past reads), Step 2 (authors), Step 3 (genres)")
    input_text: str = Field(..., description="The user's response message")
    previous_reads: List[str] = Field(default_factory=list)
    favorite_authors: List[str] = Field(default_factory=list)
    preferred_genres: List[str] = Field(default_factory=list)

class ChatReactResponse(BaseModel):
    reply: str

