from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.translation_service import translation_service
from app.services.tts_service import tts_service

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    target_lang: str = "ur"
    source_lang: str = "en"

class TTSRequest(BaseModel):
    text: str
    lang: str = "en"
    return_base64: bool = False

@router.post("/translate")
async def translate_text(request: TranslationRequest):
    translated = translation_service.translate(request.text, request.source_lang, request.target_lang)
    return {
        "originalText": request.text,
        "translatedText": translated,
        "sourceLang": request.source_lang,
        "targetLang": request.target_lang
    }

@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    result = tts_service.text_to_speech(request.text, request.lang, request.return_base64)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to generate audio")
    
    if request.return_base64:
        return {"audioBase64": result}
    return {"audioUrl": result}
