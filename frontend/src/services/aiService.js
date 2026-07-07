import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const aiService = {
  enhanceSentence: async (words, language = 'en', mode = 'natural') => {
    try {
      const response = await axios.post(`${API_URL}/ai/enhance-sentence`, {
        raw_words: words,
        language: language,
        mode: mode
      });
      return response.data;
    } catch (error) {
      console.error('Error enhancing sentence:', error);
      return {
        raw_words: words,
        enhanced_text: words.join(' '),
        language: language,
        confidence: 0
      };
    }
  },

  getLearningSuggestions: async (level = 'beginner') => {
    try {
      const response = await axios.get(`${API_URL}/ai/learning-suggestions?level=${level}`);
      return response.data.suggestions;
    } catch (error) {
      console.error('Error getting learning suggestions:', error);
      return ['Hello', 'Water', 'Help'];
    }
  }
};

export default aiService;
