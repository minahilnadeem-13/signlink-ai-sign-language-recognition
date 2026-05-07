from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.db_models import RecognitionHistory, User
from app.models.schemas import RecognitionHistoryResponse
from app.routes.auth import get_current_user
from datetime import datetime, date

router = APIRouter()

@router.get("/", response_model=List[RecognitionHistoryResponse])
def get_history(
    type: Optional[str] = None,
    today_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(RecognitionHistory).filter(RecognitionHistory.user_id == current_user.id)
    
    if type and type != "all":
        query = query.filter(RecognitionHistory.prediction_type == type)
    
    if today_only:
        today = date.today()
        query = query.filter(RecognitionHistory.created_at >= today)
        
    return query.order_by(RecognitionHistory.created_at.desc()).all()

@router.delete("/clear")
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(RecognitionHistory).filter(RecognitionHistory.user_id == current_user.id).delete()
    db.commit()
    return {"message": "History cleared"}

@router.delete("/{history_id}")
def delete_history_item(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(RecognitionHistory).filter(
        RecognitionHistory.id == history_id, 
        RecognitionHistory.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}
