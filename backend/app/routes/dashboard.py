from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from sqlalchemy import func
from app.database import get_db
from app.models.db_models import User, Gesture, RecognitionHistory, ChatMessage, AIConversation, ConfidenceLog, LearningProgress, EmergencyLog
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

    # AI Specific Stats
    ai_enhancements = db.query(AIConversation).filter(AIConversation.user_id == current_user.id).count()
    avg_confidence = db.query(func.avg(ConfidenceLog.confidence_score)).filter(ConfidenceLog.user_id == current_user.id).scalar() or 0.0
    
    # Learning Progress
    mastered_gestures = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id,
        LearningProgress.status == "mastered"
    ).count()

    # Emergency Logs
    emergency_count = db.query(EmergencyLog).filter(EmergencyLog.user_id == current_user.id).count()

    # Confidence Trend (Last 7 days)
    seven_days_ago = date.today() - timedelta(days=7)
    confidence_trend = db.query(
        func.date(ConfidenceLog.created_at).label('date'),
        func.avg(ConfidenceLog.confidence_score).label('avg_conf')
    ).filter(
        ConfidenceLog.user_id == current_user.id,
        ConfidenceLog.created_at >= seven_days_ago
    ).group_by(func.date(ConfidenceLog.created_at)).all()

    return {
        "total_users": total_users,
        "user_gestures": user_gestures,
        "total_recognitions": total_recognitions,
        "today_recognitions": today_recognitions,
        "total_sentences": sentences,
        "recent_sentences": recent_sentences,
        "recent_detections": recent_detections,
        "total_chat_messages": db.query(ChatMessage).count(),
        "ai_enhancements": ai_enhancements,
        "avg_confidence": round(float(avg_confidence) * 100, 1),
        "mastered_gestures": mastered_gestures,
        "emergency_count": emergency_count,
        "confidence_trend": [{"date": str(c.date), "value": round(float(c.avg_conf) * 100, 1)} for c in confidence_trend],
        "stats_by_type": {
            "alphabets": alphabets,
            "numbers": numbers,
            "words": words
        }
    }
