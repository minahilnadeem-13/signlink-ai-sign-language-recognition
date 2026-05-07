from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# User Models
class UserBase(BaseModel):
    email: str
    name: str
    role: str = "user"
    language_preference: str = "en"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Gesture Models
class GestureBase(BaseModel):
    gesture_name: str
    language: str
    landmarks_json: str
    samples_count: int

class GestureCreate(GestureBase):
    user_id: Optional[int] = None

class GestureResponse(GestureBase):
    id: int
    user_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class GestureCaptureRequest(BaseModel):
    gesture_name: str
    frame: str

class GestureTrainingRequest(BaseModel):
    min_samples_per_label: int = 8
    neighbors: int = 5

# Chat Models
class ChatMessageBase(BaseModel):
    room_id: str
    message: str
    translated_text: Optional[str] = None
    message_type: str = "text"

class ChatMessageCreate(ChatMessageBase):
    sender_id: int

class ChatMessageResponse(ChatMessageBase):
    id: int
    sender_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Translation Models
class TranslationBase(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str = "en"
    target_lang: str = "ur"

class TranslationCreate(TranslationBase):
    user_id: Optional[int] = None

class TranslationResponse(TranslationBase):
    id: int
    user_id: Optional[int]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Recognition History Models
class RecognitionHistoryBase(BaseModel):
    top_prediction: str
    prediction: str # Alias
    prediction_type: str
    translated_text: Optional[str] = None
    confidence: float
    candidates_json: Optional[str] = None
    auto_sentence: Optional[str] = None
    sentence_suggestions_json: Optional[str] = None
    language: str = "en"
    method: str = "mediapipe_rule_based_probability"

class RecognitionHistoryCreate(RecognitionHistoryBase):
    user_id: int

class RecognitionHistoryResponse(RecognitionHistoryBase):
    id: int
    user_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
