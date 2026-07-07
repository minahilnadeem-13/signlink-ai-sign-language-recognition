import sys
import os
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url
from app.config import settings
from app.database import Base, engine
import app.models.db_models  # noqa: F401


def ensure_database_exists(database_url: str) -> None:
    url = make_url(database_url)
    if url.drivername.startswith("mysql"):
        if url.database is None:
            raise ValueError("DATABASE_URL must include a database name.")
        admin_url = url.set(database="mysql")
        admin_engine = create_engine(admin_url)
        with admin_engine.connect() as conn:
            conn.execute(
                text(
                    f"CREATE DATABASE IF NOT EXISTS `{url.database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                )
            )
            conn.commit()
        print(f"✅ Database '{url.database}' exists or was created.")
    else:
        print("⚠️ Only MySQL database creation is supported by this helper.")


def migrate() -> None:
    print(f"Using DATABASE_URL: {settings.DATABASE_URL}")
    ensure_database_exists(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created or verified successfully.")


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python manage.py migrate")
        return 1

    command = sys.argv[1].lower()
    if command == "migrate":
        migrate()
        return 0

    print(f"Unknown command: {command}")
    print("Supported commands: migrate")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
