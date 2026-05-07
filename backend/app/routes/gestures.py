import json
from collections import Counter

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.db_models import Gesture, User
from app.models.schemas import (
    GestureCaptureRequest,
    GestureCreate,
    GestureResponse,
    GestureTrainingRequest,
)
from app.routes.auth import get_current_user
from app.services.gesture_service import gesture_service
from app.services.recognition_service import recognition_service

router = APIRouter()


@router.post("/", response_model=GestureResponse)
def create_gesture(
    gesture_in: GestureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_gesture = Gesture(
        user_id=current_user.id,
        gesture_name=gesture_in.gesture_name,
        language=gesture_in.language,
        landmarks_json=gesture_in.landmarks_json,
        samples_count=gesture_in.samples_count
    )
    db.add(db_gesture)
    db.commit()
    db.refresh(db_gesture)
    return db_gesture


@router.get("/", response_model=list[GestureResponse])
def get_gestures(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Gesture).filter(Gesture.user_id == current_user.id).order_by(Gesture.created_at.desc()).all()


@router.post("/capture")
def capture_gesture_sample(
    request: GestureCaptureRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = gesture_service.decode_image(request.frame)
    all_hands = gesture_service.get_landmarks(image)
    if not all_hands:
        raise HTTPException(status_code=400, detail="No hand detected in frame")

    hand_data = all_hands[0]
    vector_length = recognition_service.append_sample(request.gesture_name.strip(), hand_data)
    db_gesture = db.query(Gesture).filter(
        Gesture.user_id == current_user.id,
        Gesture.gesture_name == request.gesture_name.strip()
    ).first()

    preview = json.dumps(hand_data["landmarks"][:5])
    if db_gesture:
        db_gesture.samples_count += 1
        db_gesture.landmarks_json = preview
    else:
        db_gesture = Gesture(
            user_id=current_user.id,
            gesture_name=request.gesture_name.strip(),
            language="en",
            landmarks_json=preview,
            samples_count=1,
        )
        db.add(db_gesture)

    db.commit()
    db.refresh(db_gesture)
    return {
        "message": "Sample captured",
        "gesture_name": db_gesture.gesture_name,
        "samples_count": db_gesture.samples_count,
        "vector_length": vector_length,
    }


@router.post("/train")
def train_gesture_model(
    request: GestureTrainingRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        summary = recognition_service.train_model(
            min_samples_per_label=request.min_samples_per_label,
            neighbors=request.neighbors,
        )
        return {
            "message": "Gesture model trained successfully",
            "summary": summary,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/model-status")
def get_model_status(current_user: User = Depends(get_current_user)):
    return recognition_service.get_model_status()


@router.delete("/{gesture_id}")
def delete_gesture(
    gesture_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_gesture = db.query(Gesture).filter(Gesture.id == gesture_id, Gesture.user_id == current_user.id).first()
    if not db_gesture:
        raise HTTPException(status_code=404, detail="Gesture not found")

    db.delete(db_gesture)
    db.commit()
    return {"message": "Gesture deleted successfully"}
