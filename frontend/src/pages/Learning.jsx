import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trophy, Target, Sparkles, ChevronRight, Play, CheckCircle2 } from 'lucide-react';
import aiService from '../services/aiService';

const LearningPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setIsLoading(true);
    const data = await aiService.getLearningSuggestions('beginner');
    setSuggestions(data);
    setIsLoading(false);
  };

  const progress = [
    { label: "Daily Goal", current: 3, total: 5, icon: Target, color: "text-brand-500" },
    { label: "Points", current: 450, total: 1000, icon: Trophy, color: "text-amber-500" },
    { label: "Mastery", current: 12, total: 50, icon: BookOpen, color: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Learning Assistant</h1>
            <p className="text-slate-600">AI-generated practice tailored to your progress.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            {progress.map((item, idx) => (
              <div key={idx} className="glass-card px-4 py-3 rounded-2xl flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{item.label}</p>
                  <p className="text-sm font-bold text-slate-800">{item.current}/{item.total}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-brand-500" />
                  Today's Practice
                </h2>
                <button 
                  onClick={loadSuggestions}
                  className="text-brand-600 font-semibold hover:underline text-sm"
                >
                  Refresh Suggestions
                </button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="h-24 bg-slate-100 animate-pulse rounded-2xl"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((word, index) => (
                    <motion.div
                      key={word}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedWord(word)}
                      className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                        selectedWord === word ? 'border-brand-500 bg-brand-50' : 'border-transparent bg-slate-50 hover:bg-white hover:shadow-xl'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-slate-800">{word}</span>
                        <div className="bg-white p-2 rounded-xl shadow-sm">
                          <Play className="w-4 h-4 text-brand-500" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl"
            >
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Mastered any new signs?</h3>
                <p className="text-slate-400 mb-6 max-w-md">The more you practice, the more Gemini understands your unique signing style.</p>
                <button className="btn-premium py-3 px-8">Start Assessment</button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-3xl"
            >
              <h3 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Recent Progress</h3>
              <div className="space-y-4">
                {[
                  { word: "HELLO", time: "2 hours ago", status: "Mastered" },
                  { word: "WATER", time: "Yesterday", status: "In Progress" },
                  { word: "THANK YOU", time: "2 days ago", status: "Mastered" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{item.word}</p>
                      <p className="text-[10px] text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-slate-500 font-bold text-sm border-2 border-dashed border-slate-200 rounded-2xl hover:border-brand-300 hover:text-brand-500 transition-all">
                View Full History
              </button>
            </motion.div>

            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-1 rounded-3xl shadow-xl shadow-brand-500/20">
              <div className="bg-slate-900 rounded-[22px] p-6 text-center">
                <p className="text-brand-400 font-bold text-xs uppercase tracking-widest mb-2">Pro Tip</p>
                <p className="text-white text-sm leading-relaxed">
                  "Maintain good lighting while practicing. It helps Gemini recognize your hand gestures with 30% higher accuracy!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
