from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database import get_db
from app.models.db_models import User, RecognitionHistory, AIConversation, ConfidenceLog, EmergencyLog
from app.routes.auth import get_current_user

router = APIRouter()

def check_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/system-stats")
def get_system_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    # Global User Growth (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    user_growth = db.query(
        func.date(User.created_at).label('date'),
        func.count(User.id).label('count')
    ).filter(User.created_at >= thirty_days_ago).group_by(func.date(User.created_at)).all()

    # AI Request Monitoring
    total_ai_requests = db.query(AIConversation).count()
    failed_requests = db.query(AIConversation).filter(AIConversation.response_text == "FAILED").count()
    
    # Neural Accuracy Analytics
    avg_confidence = db.query(func.avg(ConfidenceLog.confidence_score)).scalar() or 0
    
    # Emergency Frequency
    emergency_events = db.query(EmergencyLog).count()

    # Recent High-Confidence Detections
    recent_detections = db.query(RecognitionHistory).order_by(RecognitionHistory.created_at.desc()).limit(10).all()

    return {
        "user_growth": [{"date": str(u.date), "count": u.count} for u in user_growth],
        "ai_monitoring": {
            "total": total_ai_requests,
            "failed": failed_requests,
            "success_rate": round(((total_ai_requests - failed_requests) / total_ai_requests * 100), 2) if total_ai_requests > 0 else 100
        },
        "neural_health": {
            "avg_accuracy": round(float(avg_confidence) * 100, 2),
            "emergency_load": emergency_events
        },
        "recent_detections": recent_detections
    }
