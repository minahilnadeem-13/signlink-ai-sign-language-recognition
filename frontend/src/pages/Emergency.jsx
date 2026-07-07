import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Phone, Heart, Droplets, User, MapPin, Mic, Volume2 } from 'lucide-react';
import aiService from '../services/aiService';
import toast from 'react-hot-toast';

const EmergencyPage = () => {
  const [detectedWords, setDetectedWords] = useState([]);
  const [enhancedText, setEnhancedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const quickActions = [
    { label: "Need Help", icon: AlertCircle, color: "bg-rose-500", words: ["HELP", "EMERGENCY"] },
    { label: "Medical", icon: Heart, color: "bg-emerald-500", words: ["DOCTOR", "PAIN", "MEDICAL"] },
    { label: "Water", icon: Droplets, color: "bg-blue-500", words: ["WATER", "THIRSTY"] },
    { label: "Family", icon: User, color: "bg-amber-500", words: ["FAMILY", "CALL"] },
  ];

  const handleQuickAction = async (words) => {
    setIsProcessing(true);
    setDetectedWords(words);
    const result = await aiService.enhanceSentence(words, 'en', 'emergency');
    setEnhancedText(result.enhanced_text);
    setIsProcessing(false);
    
    // Voice Output
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(result.enhanced_text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <AlertCircle className="w-10 h-10 text-rose-600" />
            Emergency Mode
          </h1>
          <p className="text-slate-600 text-lg">Quickly communicate critical needs with AI-powered assistance.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleQuickAction(action.words)}
              className={`${action.color} text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center gap-3`}
            >
              <action.icon className="w-10 h-10" />
              <span className="font-bold text-lg">{action.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div 
          layout
          className="glass-card p-8 rounded-3xl mb-8 min-h-[200px] flex flex-col justify-center items-center text-center"
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Gemini is generating emergency message...</p>
              </motion.div>
            ) : enhancedText ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <div className="bg-slate-50 p-6 rounded-2xl mb-4 border border-slate-100">
                  <p className="text-2xl font-bold text-slate-800 leading-relaxed italic">
                    "{enhancedText}"
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => handleQuickAction(detectedWords)}
                    className="btn-premium py-2 px-4 text-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    Repeat Voice
                  </button>
                  <button 
                    onClick={() => {
                      setEnhancedText("");
                      setDetectedWords([]);
                    }}
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400"
              >
                <Mic className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl">Press a button or use emergency gestures</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
            <div className="bg-brand-100 p-4 rounded-2xl">
              <MapPin className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Current Location</h3>
              <p className="text-slate-500 text-sm">Identifying precise coordinates...</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-2xl">
              <Phone className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Direct Call</h3>
              <p className="text-slate-500 text-sm">Contact Emergency Services (1122/911)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
