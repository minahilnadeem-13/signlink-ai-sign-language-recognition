import sys
import os
import bcrypt

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database import SessionLocal
from app.models.db_models import User

def test_manual():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "user@signlink.com").first()
    if not user:
        print("User not found in DB!")
        return

    password = "user123"
    password_bytes = password.encode('utf-8')
    hashed_bytes = user.password_hash.encode('utf-8')
    
    match = bcrypt.checkpw(password_bytes, hashed_bytes)
    print(f"Testing password 'user123' against hash '{user.password_hash[:15]}...'")
    print(f"MATCH: {match}")
    db.close()

if __name__ == "__main__":
    test_manual()
