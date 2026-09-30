from typing import List, Optional
from pydantic import BaseModel, Field

class CuratedBook(BaseModel):
    id: str
    title: str
    author: str
    year: Optional[str] = None
    badge: str = Field(description="e.g. 'Winner 2024', 'Netflix Adaptation', '#1 Bestseller'")
    genre: str
    description: str
    cover_url: str
    extra_meta: Optional[str] = None

class CuratedCategory(BaseModel):
    id: str
    name: str
    icon: str
    tagline: str
    books: List[CuratedBook]

class CuratedResponse(BaseModel):
    categories: List[CuratedCategory]
