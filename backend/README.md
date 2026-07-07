# SignLink AI Backend (MySQL Edition)

This is the backend for SignLink, migrated to **MySQL** using **SQLAlchemy ORM**.

## Features
- **Database**: MySQL with SQLAlchemy for structured data storage.
- **AI Recognition**: MediaPipe rule-based hand gesture detection.
- **Translation**: English-Urdu translation service.
- **TTS**: Text-to-Speech audio generation.
- **Auth**: JWT-based secure authentication.

## Setup Instructions

### 1. Database Setup
Create a MySQL database named `signlink_db`:
```sql
CREATE DATABASE signlink_db;
```

### 2. Backend Setup
1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Environment Configuration**:
   Copy `.env.example` to `.env` and update your MySQL credentials:
   ```bash
   cp .env.example .env
   # Edit .env: DATABASE_URL=mysql+pymysql://root:password@localhost:3306/signlink_db
   ```
4. **Create / Migrate Database**:
   ```bash
   python manage.py migrate
   ```
   This will create the database (if needed) and create all tables from the SQLAlchemy models.
5. **Run Server**:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   *Note: Tables are also verified automatically on startup by the backend.*

## API Documentation
Once running, access the docs at:
- [http://localhost:8000/docs](http://localhost:8000/docs)

## Key Technical Details
- **ORM**: SQLAlchemy
- **Database Driver**: PyMySQL
- **Migration from Mongo**: Integer IDs are now used instead of ObjectIds. Landmarks are stored as JSON text strings.
