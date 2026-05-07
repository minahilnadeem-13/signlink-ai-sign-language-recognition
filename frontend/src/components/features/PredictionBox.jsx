import React from 'react';
import { Volume2, Copy, Trash2, History } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader } from '../ui/Card';

const PredictionBox = ({ text, confidence, language, onSpeak, onClear }) => {
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-slate-400" />
          <h3 className="text-lg font-bold">Output</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence:</span>
          <span className={`text-sm font-bold ${confidence > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {Math.round(confidence * 100)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1 min-h-[120px] p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
          <p className={`text-2xl font-medium ${language === 'Urdu' ? 'text-right' : 'text-left'} text-slate-800`}>
            {text || <span className="text-slate-400 italic text-lg">Recognized text will appear here...</span>}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-lg"
              onClick={onSpeak}
              disabled={!text}
            >
              <Volume2 size={16} className="mr-2" />
              Speak
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-lg"
              onClick={handleCopy}
              disabled={!text}
            >
              <Copy size={16} />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-red-500 rounded-lg"
            onClick={onClear}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionBox;
