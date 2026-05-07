from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.db_models import User, Base
from app.utils.security import get_password_hash
import sys

def seed_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin_email = "admin@signlink.ai"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        
        if admin_user:
            print(f"Admin user already exists: {admin_email}")
            # Ensure the role is admin
            if admin_user.role != "admin":
                admin_user.role = "admin"
                db.commit()
                print("Updated existing user to admin role.")
            return
        
        # Create new admin user
        hashed_password = get_password_hash("admin123")
        new_admin = User(
            name="System Admin",
            email=admin_email,
            password_hash=hashed_password,
            role="admin",
            language_preference="en"
        )
        db.add(new_admin)
        db.commit()
        print(f"Successfully created admin user!")
        print(f"Email: {admin_email}")
        print(f"Password: admin123")
        
    except Exception as e:
        print(f"Error seeding admin: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    seed_admin()
