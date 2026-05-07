from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.db_models import ChatMessage, User
from app.models.schemas import ChatMessageCreate, ChatMessageResponse
from app.routes.auth import get_current_user

router = APIRouter()

@router.post("/message", response_model=ChatMessageResponse)
def send_message(
    message_in: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_message = ChatMessage(
        room_id=message_in.room_id,
        sender_id=message_in.sender_id,
        message=message_in.message,
        translated_text=message_in.translated_text,
        message_type=message_in.message_type
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/history/{room_id}", response_model=List[ChatMessageResponse])
def get_chat_history(
    room_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ChatMessage).filter(ChatMessage.room_id == room_id).order_by(ChatMessage.created_at.asc()).all()
