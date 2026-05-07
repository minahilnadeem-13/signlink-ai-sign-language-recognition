import React from 'react';
import { cn } from '../ui/Button';

const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
      <button
        onClick={() => setLanguage('English')}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
          language === 'English' 
            ? "bg-white text-brand-600 shadow-sm" 
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('Urdu')}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
          language === 'Urdu' 
            ? "bg-white text-brand-600 shadow-sm" 
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        Urdu
      </button>
    </div>
  );
};

export default LanguageToggle;
