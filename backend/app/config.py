import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "SignLink AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-dev")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/signlink_db")
    
    STATIC_DIR: str = "static"
    AUDIO_DIR: str = "static/audio"
    DATA_DIR: str = "data"
    GESTURE_DATASET_PATH: str = "data/gesture_samples.jsonl"
    GESTURE_MODEL_PATH: str = "models/gesture_knn_model.json"
    LABELS_PATH: str = "models/labels.json"

settings = Settings()
