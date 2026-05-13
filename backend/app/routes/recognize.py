from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
import json
from datetime import datetime
from app.services.gesture_service import gesture_service
from app.services.recognition_service import recognition_service
from app.services.sentence_service import sentence_service
from app.database import get_db
from app.models.db_models import RecognitionHistory, User
from app.routes.auth import get_current_user

router = APIRouter()

class FrameRequest(BaseModel):
    frame: str  # base64

@router.post("/frame")
def recognize_frame(
    request: FrameRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        image = gesture_service.decode_image(request.frame)
        all_hands = gesture_service.get_landmarks(image)
        
        if not all_hands:
            return {
                "top_prediction": "No hand detected",
                "prediction": "No hand detected",
                "prediction_type": "unknown",
                "translatedText": "",
                "candidates": [],
                "confidence": 0,
                "gesture_counts": gesture_service.get_gesture_counts(),
                "predefined_gestures": gesture_service.predefined_gestures,
                "auto_sentence": sentence_service.get_full_sentence(),
                "sentence_suggestions": [],
                "handDetected": False,
                "timestamp": datetime.utcnow().isoformat()
            }
        
        hand_data = all_hands[0]
        model_candidates = recognition_service.predict(hand_data, top_k=3)
        heuristic_candidates = gesture_service.recognize_with_candidates(hand_data, image)
        merged_candidates = []
        seen = set()
        for candidate in model_candidates + heuristic_candidates:
            key = (candidate["prediction"], candidate["type"])
            if key in seen:
                continue
            seen.add(key)
            merged_candidates.append(candidate)
        candidates = sorted(merged_candidates, key=lambda item: item["confidence"], reverse=True)
        
        if not candidates:
            return {
                "top_prediction": "Unknown",
                "prediction": "Unknown",
                "prediction_type": "unknown",
                "translatedText": "",
                "candidates": [],
                "confidence": 0,
                "gesture_counts": gesture_service.get_gesture_counts(),
                "predefined_gestures": gesture_service.predefined_gestures,
                "auto_sentence": sentence_service.get_full_sentence(),
                "sentence_suggestions": [],
                "handDetected": True,
                "timestamp": datetime.utcnow().isoformat()
            }

        # Smoothing and auto-sentence
        top = gesture_service.get_smooth_prediction(candidates)
        
        # Only process if we have a top prediction
        if not top:
             return {
                "top_prediction": "Unknown",
                "prediction": "Unknown",
                "prediction_type": "unknown",
                "translatedText": "",
                "candidates": [],
                "confidence": 0,
                "gesture_counts": gesture_service.get_gesture_counts(),
                "predefined_gestures": gesture_service.predefined_gestures,
                "auto_sentence": sentence_service.get_full_sentence(),
                "sentence_suggestions": [],
                "handDetected": True,
                "timestamp": datetime.utcnow().isoformat()
            }

        was_counted = gesture_service.update_gesture_count(top["prediction"], top["confidence"])

        # Calculate auto-sentence and suggestions FIRST
        # This ensures we have them ready for both DB and Response
        if top['confidence'] > 0.6:
            old_len = len(sentence_service.current_sentence_parts)
            auto_sent = sentence_service.process_prediction(top['prediction'], top['type'])
            new_len = len(sentence_service.current_sentence_parts)
            is_new = new_len > old_len
        else:
            auto_sent = sentence_service.get_full_sentence()
            is_new = False
            
        suggestions = sentence_service.get_suggestions(auto_sent, candidates)

        # Save to history ONLY if it's a new detection and confidence is high
        if is_new:
            try:
                history_entry = RecognitionHistory(
                    user_id=current_user.id,
                    top_prediction=top['prediction'],
                    prediction=top['prediction'],
                    prediction_type=top['type'],
                    translated_text=top['translatedText'],
                    confidence=top['confidence'],
                    candidates_json=json.dumps(candidates),
                    auto_sentence=auto_sent,
                    sentence_suggestions_json=json.dumps(suggestions),
                    method="mediapipe_rule_based_probability"
                )
                db.add(history_entry)
                db.commit()
            except Exception as db_err:
                print(f"Database Error: {db_err}")
                db.rollback()

        return {
            "top_prediction": top['prediction'],
            "prediction": top['prediction'],
            "prediction_type": top['type'],
            "translatedText": top['translatedText'],
            "confidence": top['confidence'],
            "candidates": candidates,
            "gesture_counts": gesture_service.get_gesture_counts(),
            "gesture_counted": was_counted,
            "predefined_gestures": gesture_service.predefined_gestures,
            "predefined_match": top.get("predefined", False),
            "stability": top.get("stability", 0),
            "auto_sentence": auto_sent,
            "sentence_suggestions": suggestions,
            "handDetected": True,
            "is_new_detection": is_new,
            "method": "mediapipe_rule_based_probability",
            "model_loaded": recognition_service.get_model_status()["model_loaded"] or gesture_service.model_loaded,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"Recognition Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clear-sentence")
async def clear_sentence():
    sentence_service.clear()
    gesture_service.reset_all()
    return {"message": "Sentence cleared"}
