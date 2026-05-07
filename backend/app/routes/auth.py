from datetime import timedelta, datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.utils.security import create_access_token, get_password_hash, verify_password
from app.database import get_db
from app.models.db_models import User
from app.models.schemas import UserCreate, UserResponse, Token, TokenData
from jose import jwt, JWTError
from pydantic import ValidationError

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> UserResponse:
    try:
        print(f"DEBUG: Validating token: {token[:15]}...")
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        print(f"DEBUG: Token sub (email): {email}")
        if email is None:
            print("DEBUG: Token sub is missing")
            raise HTTPException(status_code=403, detail="Invalid token")
        token_data = TokenData(email=email)
    except Exception as e:
        print(f"DEBUG: Token validation failed: {str(e)}")
        raise HTTPException(status_code=403, detail="Could not validate credentials")
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_password,
        role=user_in.role,
        language_preference=user_in.language_preference
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"DEBUG: Login attempt for username: {form_data.username}")
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        print(f"DEBUG: User not found: {form_data.username}")
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    is_valid = verify_password(form_data.password, user.password_hash)
    print(f"DEBUG: Password valid: {is_valid}")
    
    if not is_valid:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-email")
def verify_email(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    return {"message": "Email verified"}

@router.post("/reset-password")
def reset_password(data: dict, db: Session = Depends(get_db)):
    email = data.get("email")
    new_password = data.get("password")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.password_hash = get_password_hash(new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.put("/update", response_model=UserResponse)
def update_user(data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if "name" in data:
        current_user.name = data["name"]
    if "language_preference" in data:
        current_user.language_preference = data["language_preference"]
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
