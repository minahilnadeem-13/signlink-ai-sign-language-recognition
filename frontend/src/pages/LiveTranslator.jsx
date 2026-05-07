import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  History, 
  Languages,
  Copy,
  Camera,
  CameraOff,
  Square,
  Trash2,
  PlusCircle,
  Save,
  MessageSquare,
  Type,
  Hash,
  Activity,
  CheckCircle2,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { recognitionAPI, toolsAPI, historyAPI, translationsAPI } from '../services/api';

const LiveTranslator = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // Recognition State
  const [topPrediction, setTopPrediction] = useState('Waiting...');
  const [candidates, setCandidates] = useState([]);
  const [autoSentence, setAutoSentence] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [predType, setPredType] = useState('unknown');
  const [translatedText, setTranslatedText] = useState('');
  const [gestureCounts, setGestureCounts] = useState({});
  const [predefinedGestures, setPredefinedGestures] = useState([]);
  const [stability, setStability] = useState(0);
  const [isPredefinedMatch, setIsPredefinedMatch] = useState(false);
  
  // UI Preferences
  const [language, setLanguage] = useState('English');
  const [recentHistory, setRecentHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const webcamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchRecentHistory();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fetchRecentHistory = async () => {
    try {
      const res = await historyAPI.getAll({ limit: 5 });
      setRecentHistory(res.data);
    } catch (err) {}
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      stopDetection();
      setIsCameraOn(false);
    } else {
      setIsCameraOn(true);
      toast.success("Webcam Stream Initialized");
    }
  };

  const startDetection = () => {
    if (!isCameraOn) return;
    setIsDetecting(true);
    toast.success("Gesture Recognition Active");
    
    timerRef.current = setInterval(async () => {
      if (webcamRef.current && isCameraOn) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          try {
            const res = await recognitionAPI.recognizeFrame({ frame: imageSrc });
            const data = res.data;
            
            setTopPrediction(data.top_prediction);
            setCandidates(data.candidates || []);
            setAutoSentence(data.auto_sentence || '');
            setSuggestions(data.sentence_suggestions || []);
            setConfidence(data.confidence);
            setPredType(data.prediction_type);
            setTranslatedText(data.translatedText);
            setGestureCounts(data.gesture_counts || {});
            setPredefinedGestures(data.predefined_gestures || []);
            setStability(data.stability || 0);
            setIsPredefinedMatch(Boolean(data.predefined_match));
          } catch (err) {}
        }
      }
    }, 850); // Balanced for stability
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTopPrediction('Waiting...');
    setCandidates([]);
    setGestureCounts({});
    setStability(0);
    setIsPredefinedMatch(false);
  };

  const handleClear = async () => {
    try {
      await recognitionAPI.clearSentence();
      setAutoSentence('');
      setSuggestions([]);
      setGestureCounts({});
      setStability(0);
      setIsPredefinedMatch(false);
      toast.success("Sentence Buffer Cleared");
    } catch (err) {}
  };

  const speakText = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'Urdu' ? 'ur-PK' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AppLayout title="Live Gesture Translator">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Output & Matches (8/12) */}
        <div className="xl:col-span-8 space-y-6">
          <Card className="overflow-hidden border-none shadow-xl bg-slate-50">
             <div className="aspect-video relative bg-slate-900 overflow-hidden rounded-t-2xl">
                {isCameraOn ? (
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                     <CameraOff size={48} className="mb-4 opacity-20" />
                     <p className="text-xs font-bold tracking-widest uppercase opacity-40">Camera Disconnected</p>
                  </div>
                )}

                {/* Professional Overlay */}
                {isCameraOn && (
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10">
                     <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-brand-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Activity size={12} className={isDetecting ? 'text-emerald-400' : 'text-slate-400'} />
                           {isDetecting ? `Confidence: ${isNaN(confidence) ? 0 : Math.round(confidence * 100)}% | Stability: ${Math.round(stability * 100)}% | ${predType}` : 'Ready for Detection'}
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl mb-1">
                          {language === 'Urdu' ? (translatedText || 'انتظار...') : (topPrediction || 'Waiting...')}
                        </h2>
                        {isDetecting && topPrediction !== 'No hand detected' && topPrediction !== 'Unknown' && (
                           <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isPredefinedMatch ? 'bg-emerald-500/20 text-emerald-200 border-emerald-300/30' : 'bg-amber-500/20 text-amber-100 border-amber-300/30'}`}>
                              {isPredefinedMatch ? 'Predefined gesture matched' : 'Heuristic gesture match'}
                           </div>
                        )}
                        {isDetecting && topPrediction !== 'No hand detected' && (
                           <button onClick={() => speakText(language === 'Urdu' ? translatedText : topPrediction)} className="mt-4 p-3 bg-brand-600 text-white rounded-full hover:bg-brand-500 transition-all shadow-lg">
                              <Volume2 size={20} />
                           </button>
                        )}
                     </div>
                  </div>
                )}
             </div>

             <CardFooter className="bg-white p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <Button onClick={toggleCamera} variant={isCameraOn ? 'secondary' : 'primary'} className="rounded-xl px-6 h-12 font-bold shadow-sm">
                      {isCameraOn ? <><CameraOff size={18} className="mr-2" /> Turn Camera Off</> : <><Camera size={18} className="mr-2" /> Turn Camera On</>}
                   </Button>
                   <Button onClick={isDetecting ? stopDetection : startDetection} disabled={!isCameraOn} variant={isDetecting ? 'danger' : 'accent'} className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-brand-100">
                      {isDetecting ? <><Square size={18} className="mr-2" /> Stop Detection</> : <><Zap size={18} className="mr-2" /> Start Detection</>}
                   </Button>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                   {['English', 'Urdu'].map(l => (
                     <button key={l} onClick={() => setLanguage(l)} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${language === l ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400'}`}>
                        {l}
                     </button>
                   ))}
                </div>
             </CardFooter>
          </Card>

          {/* Possible Matches Table */}
          <Card className="border-none shadow-lg">
             <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={18} className="text-emerald-600" />
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Possible Matches</h3>
                </div>
                <Info size={16} className="text-slate-300" />
             </CardHeader>
             <CardContent className="p-0">
                <div className="overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                         <tr>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prediction</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
                            <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Add</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {candidates.length === 0 ? (
                           <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-300 italic text-sm">No matches in current frame</td></tr>
                         ) : candidates.map((c, i) => (
                           <tr key={i} className="hover:bg-brand-50/30 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">{c.prediction}</span>
                                    <span className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">{c.type}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                 <span className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                    {Math.round(c.confidence * 100)}%
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button onClick={() => toast.success(`Manually Added: ${c.prediction}`)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100">
                                    <PlusCircle size={18} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Sentence Builder & Logs (4/12) */}
        <div className="xl:col-span-4 space-y-6">
           <Card className="border-none shadow-xl bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Type size={18} className="text-brand-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Sentence Builder</h3>
                 </div>
                 <button onClick={handleClear} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                 </button>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="min-h-[140px] p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6 flex flex-wrap gap-2 content-start">
                    {autoSentence ? autoSentence.split(' ').map((word, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white rounded-xl text-slate-900 font-bold text-sm shadow-sm border border-slate-100">
                        {word}
                      </span>
                    )) : (
                      <p className="text-slate-300 italic text-sm">Waiting for signs to form message...</p>
                    )}
                 </div>
                 <div className="space-y-2">
                    <Button onClick={() => speakText(autoSentence)} disabled={!autoSentence} className="w-full rounded-xl py-6 font-bold shadow-sm">
                       <Volume2 size={18} className="mr-2" /> Speak Sentence
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                       <Button variant="secondary" onClick={() => {
                          navigator.clipboard.writeText(autoSentence);
                          toast.success("Copied to Clipboard");
                       }} disabled={!autoSentence} className="rounded-xl h-12 text-xs font-bold">
                          <Copy size={16} className="mr-2" /> Copy
                       </Button>
                       <Button variant="accent" onClick={async () => {
                          try {
                             await translationsAPI.create({
                                input_gesture: autoSentence,
                                output_text: language === 'Urdu' ? translatedText : autoSentence,
                                language: language === 'Urdu' ? 'ur' : 'en',
                                confidence: confidence || 1.0
                             });
                             toast.success("Sentence Saved to History");
                             fetchRecentHistory();
                          } catch (err) {
                             toast.error("Failed to save sentence");
                          }
                       }} disabled={!autoSentence} className="rounded-xl h-12 text-xs font-bold shadow-lg shadow-brand-50">
                          <Save size={16} className="mr-2" /> Save Output
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-lg">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                 <div className="flex items-center gap-2">
                    <Hash size={18} className="text-brand-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Gesture Counter</h3>
                 </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {predefinedGestures.length === 0 ? (
                      <span className="text-sm text-slate-400 italic">No predefined gestures loaded.</span>
                    ) : predefinedGestures.map((gesture) => (
                      <div key={gesture} className="min-w-[88px] rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
                         <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{gesture}</div>
                         <div className="mt-1 text-xl font-black text-slate-900">{gestureCounts[gesture] || 0}</div>
                      </div>
                    ))}
                 </div>
                 <p className="text-xs text-slate-400">
                    Counts only increase on stable detections to avoid adding the same gesture every frame.
                 </p>
              </CardContent>
           </Card>

           <Card className="border-none shadow-lg h-[460px] flex flex-col">
              <CardHeader className="bg-slate-50/50 border-b border-slate-50">
                 <div className="flex items-center gap-2">
                    <History size={18} className="text-slate-400" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Recent Sign Log</h3>
                 </div>
              </CardHeader>
              <CardContent className="p-4 overflow-y-auto space-y-3 flex-1">
                 {recentHistory.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400 py-20">
                      <Activity size={48} className="mb-2" />
                      <p className="text-[10px] font-black tracking-widest uppercase">System Idle</p>
                   </div>
                 ) : recentHistory.map((item, i) => (
                   <div key={item.id || i} className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand-200 transition-all">
                      <div className="flex items-center justify-between mb-1">
                         <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.prediction_type === 'alphabet' ? 'bg-blue-50 text-blue-600' :
                            item.prediction_type === 'digit' ? 'bg-amber-50 text-amber-600' :
                            'bg-emerald-50 text-emerald-600'
                         }`}>{item.prediction_type}</span>
                         <span className="text-[10px] font-bold text-slate-300">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="font-bold text-slate-800">{item.prediction}</p>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
            { icon: ShieldCheck, title: "Rule-Based Engine", desc: "Using MediaPipe landmarks with custom heuristic scoring for high accuracy." },
            { icon: languagesIcon, title: "Urdu Mapping", desc: "Every recognized gesture is mapped to its equivalent Urdu sign language context." },
            { icon: MessageSquare, title: "Sentence Assembly", desc: "Intelligently chains alphabets and words into logical English sentences." }
         ].map((info, i) => (
           <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-xl h-fit">
                 <info.icon size={20} />
              </div>
              <div>
                 <h4 className="font-bold text-slate-900 mb-1">{info.title}</h4>
                 <p className="text-xs text-slate-500 leading-relaxed">{info.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </AppLayout>
  );
};

// Workaround for undefined icon in loop
const languagesIcon = Languages;

export default LiveTranslator;
