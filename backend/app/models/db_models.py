from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    language_preference = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

class Gesture(Base):
    __tablename__ = "gestures"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gesture_name = Column(String(100), nullable=False)
    language = Column(String(10), default="en")
    landmarks_json = Column(Text) # Store as JSON string
    samples_count = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

class Translation(Base):
    __tablename__ = "translations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    input_gesture = Column(String(100))
    output_text = Column(String(255))
    language = Column(String(10))
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String(100), index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    translated_text = Column(Text, nullable=True)
    message_type = Column(String(50), default="text")
    created_at = Column(DateTime, default=datetime.utcnow)

class RecognitionHistory(Base):
    __tablename__ = "recognition_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    top_prediction = Column(String(100))
    prediction = Column(String(100)) # Alias for top_prediction
    prediction_type = Column(String(50))
    translated_text = Column(String(100), nullable=True)
    confidence = Column(Float)
    candidates_json = Column(Text, nullable=True)
    auto_sentence = Column(Text, nullable=True)
    sentence_suggestions_json = Column(Text, nullable=True)
    language = Column(String(10), default="en")
    method = Column(String(100), default="mediapipe_rule_based_probability")
    created_at = Column(DateTime, default=datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), default="unread") # unread, read, archived
    created_at = Column(DateTime, default=datetime.utcnow)

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    raw_words = Column(Text) # JSON string of list
    enhanced_text = Column(Text)
    language = Column(String(10))
    mode = Column(String(50)) # natural, emergency, grammar
    created_at = Column(DateTime, default=datetime.utcnow)

class LearningProgress(Base):
    __tablename__ = "learning_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gesture_id = Column(Integer, ForeignKey("gestures.id"), nullable=True)
    gesture_name = Column(String(100))
    status = Column(String(50)) # mastered, in_progress, started
    attempts = Column(Integer, default=0)
    best_confidence = Column(Float, default=0.0)
    last_practiced = Column(DateTime, default=datetime.utcnow)

class EmergencyLog(Base):
    __tablename__ = "emergency_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gestures_detected = Column(Text)
    generated_sentence = Column(Text)
    location_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ConfidenceLog(Base):
    __tablename__ = "confidence_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gesture_name = Column(String(100))
    confidence_score = Column(Float)
    is_correct = Column(Integer, default=1) # 1 for correct, 0 for incorrect feedback
    created_at = Column(DateTime, default=datetime.utcnow)
