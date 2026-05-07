from typing import List, Dict
import time

class SentenceService:
    def __init__(self):
        self.current_sentence_parts = []
        self.last_prediction = None
        self.last_prediction_time = 0
        self.pause_threshold = 1.8 # Seconds for boundary
        self.cooldown = 1.0 # Seconds before same sign again

    def process_prediction(self, prediction: str, pred_type: str):
        if not prediction or prediction in ["No hand detected", "Unknown"]:
            return self.get_full_sentence()

        now = time.time()
        
        # Check for pause boundary (auto-reset or add space logic if needed)
        # For simplicity, if long pause, we treat it as a new word/block
        
        # Cooldown to avoid duplicates from frames
        if prediction == self.last_prediction and (now - self.last_prediction_time) < self.cooldown:
            return self.get_full_sentence()

        # Logic for joining
        self.current_sentence_parts.append({
            "text": prediction,
            "type": pred_type
        })
        
        self.last_prediction = prediction
        self.last_prediction_time = now
        
        return self.get_full_sentence()

    def get_full_sentence(self):
        if not self.current_sentence_parts:
            return ""
            
        result = ""
        for i, part in enumerate(self.current_sentence_parts):
            text = part["text"]
            ptype = part["type"]
            
            if i == 0:
                result = text
                continue

            prev_ptype = self.current_sentence_parts[i-1]["type"]
            
            # Alphabets join without spaces
            if ptype == "alphabet" and prev_ptype == "alphabet":
                result += text
            # Digits join without spaces
            elif ptype == "digit" and prev_ptype == "digit":
                result += text
            # Words or mixed types get spaces
            else:
                result += " " + text
                
        return result

    def get_suggestions(self, current_sentence: str, candidates: List[Dict]):
        """Generates 3 possible sentence variations based on candidates"""
        if not current_sentence or not candidates:
            return []
            
        suggestions = []
        # Suggestion 1: The current auto sentence
        suggestions.append({
            "text": current_sentence,
            "confidence": 0.85
        })
        
        # Suggestion 2: Current sentence + top candidate (if not already processed)
        if len(candidates) > 1:
            suggestions.append({
                "text": current_sentence + " " + candidates[1]['prediction'],
                "confidence": 0.65
            })
            
        return suggestions

    def clear(self):
        self.current_sentence_parts = []
        self.last_prediction = None

sentence_service = SentenceService()
