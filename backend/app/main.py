from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import auth, recognize, gestures, chat, tools, translations, dashboard, history
from app.config import settings
from app.database import init_db
import os
import time

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    print(f"DEBUG: {request.method} {request.url.path} - Status: {response.status_code} - {process_time:.2f}ms")
    return response

if not os.path.exists(settings.STATIC_DIR):
    os.makedirs(settings.STATIC_DIR)
if not os.path.exists(settings.AUDIO_DIR):
    os.makedirs(settings.AUDIO_DIR)

app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

@app.on_event("startup")
def on_startup():
    init_db()

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(recognize.router, prefix=f"{settings.API_V1_STR}/recognize", tags=["recognition"])
app.include_router(gestures.router, prefix=f"{settings.API_V1_STR}/gestures", tags=["gestures"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(translations.router, prefix=f"{settings.API_V1_STR}/translations", tags=["translations"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
app.include_router(history.router, prefix=f"{settings.API_V1_STR}/history", tags=["history"])
app.include_router(tools.router, prefix=f"{settings.API_V1_STR}", tags=["tools"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "database": "connected"}

@app.get("/")
def root():
    return {"message": "SignLink AI Backend Running"}
