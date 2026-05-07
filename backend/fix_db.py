from sqlalchemy import create_engine, text
from app.config import settings

# Connection to your MAMP MySQL
DATABASE_URL = "mysql+pymysql://root:root@localhost:8889/signlink_db"
engine = create_engine(DATABASE_URL)

def update_schema():
    print("🚀 Updating RecognitionHistory table schema...")
    with engine.connect() as conn:
        try:
            # Add new columns if they don't exist
            conn.execute(text("ALTER TABLE recognition_history ADD COLUMN top_prediction VARCHAR(100) AFTER user_id;"))
            conn.execute(text("ALTER TABLE recognition_history ADD COLUMN candidates_json TEXT AFTER confidence;"))
            conn.execute(text("ALTER TABLE recognition_history ADD COLUMN auto_sentence TEXT AFTER candidates_json;"))
            conn.execute(text("ALTER TABLE recognition_history ADD COLUMN sentence_suggestions_json TEXT AFTER auto_sentence;"))
            conn.execute(text("ALTER TABLE recognition_history MODIFY COLUMN method VARCHAR(100);"))
            conn.commit()
            print("✅ Database schema updated successfully!")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("ℹ️ Columns already exist, skipping update.")
            else:
                print(f"❌ Error updating schema: {e}")

if __name__ == "__main__":
    update_schema()
