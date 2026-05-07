from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.db_models import Translation, User, RecognitionHistory
from pydantic import BaseModel
from app.models.schemas import TranslationResponse
from app.routes.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[TranslationResponse])
def get_translations(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Translation)\
             .filter(Translation.user_id == current_user.id)\
             .order_by(Translation.created_at.desc())\
             .limit(limit)\
             .all()



class TranslationCreate(BaseModel):
    input_gesture: str
    output_text: str
    language: str = "en"
    confidence: float = 1.0

@router.post("/")
def save_translation(
    request: TranslationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Also save to RecognitionHistory as a "sentence" for the dashboard
    history_entry = RecognitionHistory(
        user_id=current_user.id,
        top_prediction=request.input_gesture,
        prediction=request.input_gesture,
        prediction_type="sentence",
        translated_text=request.output_text,
        confidence=request.confidence,
        auto_sentence=request.input_gesture,
        method="manual_save"
    )
    db.add(history_entry)
    
    new_translation = Translation(
        user_id=current_user.id,
        input_gesture=request.input_gesture,
        output_text=request.output_text,
        language=request.language,
        confidence=request.confidence
    )
    db.add(new_translation)
    db.commit()
    db.refresh(new_translation)
    return new_translation
