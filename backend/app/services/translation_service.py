class TranslationService:
    def __init__(self):
        self.dictionary = {
            "en_ur": {
                "Hello": "سلام (Hello)",
                "Thank You": "شکریہ (Shukriya)",
                "Help": "مدد (Madad)",
                "Yes": "جی ہاں (Ji Haan)",
                "No": "نہیں (Nahi)",
                "I Love You": "میں آپ سے محبت کرتا ہوں",
                "Stop": "رک جائیں",
                "A": "الف",
                "B": "بے",
                "C": "پے"
            },
            "ur_en": {
                "سلام": "Hello",
                "شکریہ": "Thank You",
                "مدد": "Help",
                "جی ہاں": "Yes",
                "نہیں": "No"
            }
        }

    def translate(self, text, source_lang="en", target_lang="ur"):
        key = f"{source_lang}_{target_lang}"
        if key not in self.dictionary:
            return text
        
        # Clean the text (handle "Hello / Stop" etc)
        base_text = text.split('/')[0].strip()
        
        return self.dictionary[key].get(base_text, text)

translation_service = TranslationService()
