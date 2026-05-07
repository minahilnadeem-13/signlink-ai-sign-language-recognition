from gtts import gTTS
import os
import uuid
import base64
from app.config import settings

class TTSService:
    def __init__(self):
        if not os.path.exists(settings.AUDIO_DIR):
            os.makedirs(settings.AUDIO_DIR, exist_ok=True)

    def text_to_speech(self, text, lang="en", return_base64=False):
        try:
            filename = f"{uuid.uuid4()}.mp3"
            filepath = os.path.join(settings.AUDIO_DIR, filename)
            
            # gTTS supports 'en', 'ur', etc.
            tts = gTTS(text=text, lang=lang)
            tts.save(filepath)
            
            if return_base64:
                with open(filepath, "rb") as audio_file:
                    encoded_string = base64.b64encode(audio_file.read()).decode('utf-8')
                return f"data:audio/mp3;base64,{encoded_string}"
            
            return f"/static/audio/{filename}"
        except Exception as e:
            print(f"TTS Error: {e}")
            return None

tts_service = TTSService()
