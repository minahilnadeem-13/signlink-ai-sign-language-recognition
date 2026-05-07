import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database import SessionLocal
from app.models.db_models import User

def check_users():
    db = SessionLocal()
    users = db.query(User).all()
    print(f"Total users found: {len(users)}")
    for u in users:
        print(f"ID: {u.id}, Name: {u.name}, Email: {u.email}, Hash starts with: {u.password_hash[:10]}...")
    db.close()

if __name__ == "__main__":
    check_users()
