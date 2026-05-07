from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from sqlalchemy import func
from app.database import get_db
from app.models.db_models import User, Gesture, RecognitionHistory, ChatMessage
from app.routes.auth import get_current_user
from datetime import date

router = APIRouter()

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    
    # Global stats
    total_users = db.query(User).count()
    
    # User specific stats
    user_gestures = db.query(Gesture).filter(Gesture.user_id == current_user.id).count()
    
    # Recognition stats
    total_recognitions = db.query(RecognitionHistory).filter(RecognitionHistory.user_id == current_user.id).count()
    today_recognitions = db.query(RecognitionHistory).filter(
        RecognitionHistory.user_id == current_user.id,
        RecognitionHistory.created_at >= today
    ).count()
    
    # Stats by type
    alphabets = db.query(RecognitionHistory).filter(
        RecognitionHistory.user_id == current_user.id,
        RecognitionHistory.prediction_type == "alphabet"
    ).count()
    
    numbers = db.query(RecognitionHistory).filter(
        RecognitionHistory.user_id == current_user.id,
        RecognitionHistory.prediction_type == "number"
    ).count()
    
    words = db.query(RecognitionHistory).filter(
        RecognitionHistory.user_id == current_user.id,
        RecognitionHistory.prediction_type == "word"
    ).count()

    sentences = db.query(RecognitionHistory).filter(
        RecognitionHistory.user_id == current_user.id,
        RecognitionHistory.prediction_type == "sentence"
    ).count()

    # Last 24 hours sentences
    twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
    recent_sentences = db.query(RecognitionHistory).filter(
        RecognitionHistory.user_id == current_user.id,
        RecognitionHistory.prediction_type == "sentence",
        RecognitionHistory.created_at >= twenty_four_hours_ago
    ).order_by(RecognitionHistory.created_at.desc()).all()

    # Recent individual words/alphabets (detections)
    recent_detections = db.query(RecognitionHistory).filter(
        RecognitionHistory.user_id == current_user.id,
        RecognitionHistory.prediction_type != "sentence"
    ).order_by(RecognitionHistory.created_at.desc()).limit(10).all()

    return {
        "total_users": total_users,
        "user_gestures": user_gestures,
        "total_recognitions": total_recognitions,
        "today_recognitions": today_recognitions,
        "total_sentences": sentences,
        "recent_sentences": recent_sentences,
        "recent_detections": recent_detections,
        "total_chat_messages": db.query(ChatMessage).count(),
        "stats_by_type": {
            "alphabets": alphabets,
            "numbers": numbers,
            "words": words
        }
    }
