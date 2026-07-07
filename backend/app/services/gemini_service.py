import os
from google import genai
from google.genai import types
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            logger.error("GEMINI_API_KEY not found in settings")
            self.client = None
        else:
            self.client = genai.Client(api_key=self.api_key)
        self.model_id = "gemini-2.0-flash" # Latest lightweight model

    async def enhance_sentence(self, words: list, language: str = "en"):
        """
        Converts a list of detected words/gestures into a natural sentence.
        """
        if not self.client:
            return " ".join(words)

        prompt = f"""
        Convert the following list of sign language gestures into a natural, grammatically correct sentence in {language}.
        Gestures: {", ".join(words)}
        
        If language is 'ur', provide the output in Urdu with proper RTL structure.
        Only return the enhanced sentence.
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error in Gemini enhance_sentence: {e}")
            return " ".join(words)

    async def correct_grammar(self, text: str):
        """
        Corrects grammar and adds smart punctuation to a sentence.
        """
        if not self.client:
            return text

        prompt = f"Correct the grammar and add punctuation to this sentence: '{text}'. Only return the corrected sentence."
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error in Gemini correct_grammar: {e}")
            return text

    async def generate_emergency_sentence(self, gestures: list):
        """
        Generates an emergency sentence from gestures.
        """
        if not self.client:
            return " ".join(gestures)

        prompt = f"The following emergency gestures were detected: {', '.join(gestures)}. Create a clear, urgent emergency sentence for medical or security personnel. Only return the sentence."
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error in Gemini generate_emergency_sentence: {e}")
            return " ".join(gestures)

    async def get_learning_suggestions(self, level: str = "beginner"):
        """
        Generates learning practice suggestions.
        """
        if not self.client:
            return ["Hello", "Water", "Help"]

        prompt = f"Generate 5 sign language practice words or short sentences for a {level} learner. Return them as a simple comma-separated list."
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt
            )
            return [s.strip() for s in response.text.split(",")]
        except Exception as e:
            logger.error(f"Error in Gemini get_learning_suggestions: {e}")
            return ["Hello", "Water", "Help"]

gemini_service = GeminiService()
