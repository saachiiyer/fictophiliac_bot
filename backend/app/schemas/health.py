from pydantic import BaseModel

class HealthResponse(BaseModel):
    status: str
    version: str
    gemini_configured: bool
    message: str

