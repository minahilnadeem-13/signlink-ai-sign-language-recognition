from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db_models import ContactMessage
from app.routes.auth import get_current_user
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/send")
def send_message(data: dict, db: Session = Depends(get_db)):
    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")
    
    if not all([name, email, subject, message]):
        raise HTTPException(status_code=400, detail="All fields are required")
        
    db_msg = ContactMessage(
        name=name,
        email=email,
        subject=subject,
        message=message
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return {"message": "Message sent successfully", "id": db_msg.id}

@router.get("/all")
def get_messages(db: Session = Depends(get_db)):
    # In a real app, you'd check for admin role here
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return messages

@router.put("/{msg_id}/status")
def update_status(msg_id: int, data: dict, db: Session = Depends(get_db)):
    status = data.get("status")
    db_msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not db_msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db_msg.status = status
    db.commit()
    return {"message": "Status updated"}
