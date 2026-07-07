from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.gemini_service import gemini_service
from app.routes.auth import get_current_user
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()

class EnhanceSentenceRequest(BaseModel):
    raw_words: List[str]
    language: str = "en"
    mode: Optional[str] = "natural" # natural, emergency, grammar

class EnhanceSentenceResponse(BaseModel):
    raw_words: List[str]
    enhanced_text: str
    language: str
    confidence: float

@router.post("/enhance-sentence", response_model=EnhanceSentenceResponse)
async def enhance_sentence(request: EnhanceSentenceRequest):
    if not request.raw_words:
        return EnhanceSentenceResponse(
            raw_words=[],
            enhanced_text="",
            language=request.language,
            confidence=0.0
        )

    if request.mode == "emergency":
        enhanced_text = await gemini_service.generate_emergency_sentence(request.raw_words)
    elif request.mode == "grammar":
        raw_text = " ".join(request.raw_words)
        enhanced_text = await gemini_service.correct_grammar(raw_text)
    else:
        enhanced_text = await gemini_service.enhance_sentence(request.raw_words, request.language)

    return EnhanceSentenceResponse(
        raw_words=request.raw_words,
        enhanced_text=enhanced_text,
        language=request.language,
        confidence=0.95 # Mock confidence for AI enhancement
    )

@router.get("/learning-suggestions")
async def get_learning_suggestions(level: str = "beginner"):
    suggestions = await gemini_service.get_learning_suggestions(level)
    return {"suggestions": suggestions}
