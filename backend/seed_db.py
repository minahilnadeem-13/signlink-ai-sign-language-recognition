import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import bcrypt
from datetime import datetime

# Add the backend directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import Base, engine, SessionLocal
from app.models.db_models import User, Gesture, ChatMessage, Translation, AIConversation, LearningProgress, EmergencyLog, ConfidenceLog

def get_password_hash(password):
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def seed():
    db = SessionLocal()
    try:
        print("Checking database connection...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables confirmed.")

        print("🌱 Seeding fresh demo data...")

        # DELETE IN ORDER TO AVOID FOREIGN KEY CONSTRAINTS
        print("Cleaning up old data...")
        db.query(ChatMessage).delete()
        db.query(Gesture).delete()
        db.query(Translation).delete()
        db.query(AIConversation).delete()
        db.query(LearningProgress).delete()
        db.query(EmergencyLog).delete()
        db.query(ConfidenceLog).delete()
        db.commit() # Commit these first
        
        # Now we can safely delete users
        db.query(User).filter(User.email.in_(["admin@signlink.com", "user@signlink.com"])).delete(synchronize_session=False)
        db.commit()

        # 1. Create Users
        admin = User(
            name="Admin User",
            email="admin@signlink.com",
            password_hash=get_password_hash("admin123"),
            role="admin",
            language_preference="en"
        )
        
        user = User(
            name="Muhammad",
            email="user@signlink.com",
            password_hash=get_password_hash("user123"),
            role="user",
            language_preference="en"
        )
        
        db.add(admin)
        db.add(user)
        db.commit()
        db.refresh(admin)
        db.refresh(user)
        print(f"✅ Created Admin: admin@signlink.com / admin123")
        print(f"✅ Created User: user@signlink.com / user123")

        # 2. Create Gestures
        gestures = [
            Gesture(user_id=user.id, gesture_name="Hello", language="en", landmarks_json="[]", samples_count=120),
            Gesture(user_id=user.id, gesture_name="OK", language="en", landmarks_json="[]", samples_count=85),
            Gesture(user_id=user.id, gesture_name="No", language="en", landmarks_json="[]", samples_count=90),
            Gesture(user_id=user.id, gesture_name="Help", language="en", landmarks_json="[]", samples_count=110),
            Gesture(user_id=user.id, gesture_name="Thank You", language="en", landmarks_json="[]", samples_count=100),
        ]
        db.add_all(gestures)

        # 3. Create Chat Messages
        messages = [
            ChatMessage(room_id="demo-room", sender_id=user.id, message="Hello! Can you help me?", message_type="text"),
        ]
        db.add_all(messages)

        # 4. Create Demo Translations
        translations = [
            Translation(user_id=user.id, input_gesture="Hello", output_text="Hello", language="en", confidence=0.98),
            Translation(user_id=user.id, input_gesture="Hello", output_text="Assalam o Alaikum", language="ur", confidence=0.94),
            Translation(user_id=user.id, input_gesture="Thank You", output_text="Thank You", language="en", confidence=0.91),
        ]
        db.add_all(translations)

        db.commit()
        print("\n🚀 SEEDING COMPLETED SUCCESSFULLY!")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
