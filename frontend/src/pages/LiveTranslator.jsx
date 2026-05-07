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
  Zap,
  Mic,
  ArrowRight,
  Layout,
  Clock
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
      toast.success("Optical sensors initialized");
    }
  };

  const startDetection = () => {
    if (!isCameraOn) return;
    setIsDetecting(true);
    toast.success("Neural processing active");
    
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
    }, 850); 
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
      toast.success("Session buffer cleared");
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
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-1 bg-brand-600 rounded-full"></div>
             <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Bilingual Recognition</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Real-time Interface</h2>
          <p className="text-slate-500 mt-1 font-medium">Capture and translate sign language landmarks into text and speech.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pl-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Node</span>
              <span className={`text-xs font-bold ${isDetecting ? 'text-emerald-600' : 'text-slate-400'}`}>
                 {isDetecting ? 'Active Analytics' : 'Standby Mode'}
              </span>
           </div>
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDetecting ? 'bg-emerald-50 text-emerald-600 animate-pulse' : 'bg-slate-50 text-slate-300'}`}>
              <Activity size={20} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Main Feed Section (8/12) */}
        <div className="xl:col-span-8 space-y-8">
          <Card className="overflow-hidden border-none shadow-2xl rounded-[3rem] bg-slate-950 group">
             <div className="aspect-video relative overflow-hidden">
                {isCameraOn ? (
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 bg-slate-950">
                     <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <CameraOff size={40} className="opacity-20" />
                     </div>
                     <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Optical Node Disconnected</p>
                  </div>
                )}

                {/* HUD Elements */}
                {isCameraOn && (
                  <>
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
                       <div className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">
                          {isDetecting ? 'Neural Stream: Active' : 'Neural Stream: Paused'}
                       </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10">
                       <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                          <div className="px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] font-black text-brand-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                             <Zap size={14} className={isDetecting ? 'text-brand-400' : 'text-slate-500'} />
                             {isDetecting ? (
                                <span>Conf: {isNaN(confidence) ? 0 : Math.round(confidence * 100)}% • Stab: {Math.round(stability * 100)}% • {predType}</span>
                             ) : (
                                "Initialize processing to begin recognition"
                             )}
                          </div>
                          
                          <div className="relative mb-6">
                             <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl UrduFont">
                               {language === 'Urdu' ? (translatedText || 'انتظار...') : (topPrediction || 'Waiting...')}
                             </h2>
                             {isPredefinedMatch && isDetecting && (
                                <div className="absolute -top-4 -right-8 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-bounce">
                                   <CheckCircle2 size={14} className="text-white" />
                                </div>
                             )}
                          </div>

                          <div className="flex items-center gap-4">
                             <button 
                               onClick={() => speakText(language === 'Urdu' ? translatedText : topPrediction)} 
                               disabled={!isDetecting || topPrediction === 'Waiting...'}
                               className="p-5 bg-white text-slate-900 rounded-[1.5rem] hover:scale-110 active:scale-95 transition-all shadow-2xl disabled:opacity-50 disabled:scale-100"
                             >
                                <Volume2 size={24} />
                             </button>
                             <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors duration-500 ${isPredefinedMatch ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-white/10 text-white/60 border-white/10'}`}>
                                {isPredefinedMatch ? 'Pattern Match Verified' : 'Neural Inference'}
                             </div>
                          </div>
                       </div>
                    </div>
                  </>
                )}
             </div>

             <CardFooter className="bg-white p-8 flex flex-wrap items-center justify-between gap-6 border-t border-slate-50">
                <div className="flex items-center gap-4">
                   <Button onClick={toggleCamera} variant={isCameraOn ? 'outline' : 'primary'} className="rounded-2xl px-8 h-14 font-black uppercase text-[10px] tracking-widest transition-all">
                      {isCameraOn ? <><CameraOff size={18} className="mr-3" /> Shutdown Optics</> : <><Camera size={18} className="mr-3" /> Initialize Optics</>}
                   </Button>
                   <Button onClick={isDetecting ? stopDetection : startDetection} disabled={!isCameraOn} className={`rounded-2xl px-10 h-14 font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95 ${isDetecting ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-200'}`}>
                      {isDetecting ? <><Square size={18} className="mr-3" /> Terminate Engine</> : <><Zap size={18} className="mr-3" /> Launch Neural Engine</>}
                   </Button>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-[1.5rem] shadow-inner">
                   {['English', 'Urdu'].map(l => (
                     <button 
                       key={l} 
                       onClick={() => setLanguage(l)} 
                       className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${language === l ? 'bg-white text-brand-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                        {l}
                     </button>
                   ))}
                </div>
             </CardFooter>
          </Card>

          {/* Probability Matrix */}
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
             <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between p-8">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={20} className="text-emerald-600" />
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Inference Probabilities</h3>
                </div>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 shadow-sm">
                   <Layout size={18} />
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50/30">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Signature</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Neural Score</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Protocol</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {candidates.length === 0 ? (
                           <tr><td colSpan="3" className="px-8 py-20 text-center text-slate-300 italic font-medium">Awaiting neural input frames...</td></tr>
                         ) : candidates.map((c, i) => (
                           <tr key={i} className="hover:bg-brand-50/30 transition-all duration-300 group">
                              <td className="px-8 py-6">
                                 <div className="flex flex-col">
                                    <span className="text-lg font-black text-slate-900 tracking-tight">{c.prediction}</span>
                                    <span className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">{c.type}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-center">
                                 <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                       <div className="h-full bg-brand-500" style={{ width: `${c.confidence * 100}%` }}></div>
                                    </div>
                                    <span className="text-xs font-black text-slate-700">{Math.round(c.confidence * 100)}%</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <button onClick={() => toast.success(`Signature ${c.prediction} manually added`)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:bg-brand-600 hover:text-white rounded-2xl transition-all shadow-sm group-hover:shadow-brand-100">
                                    <PlusCircle size={22} />
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

        {/* Intelligence Sidebar (4/12) */}
        <div className="xl:col-span-4 space-y-8">
           <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="bg-slate-900 text-white p-8 flex flex-row items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Type size={20} className="text-brand-400" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-100">Sentence Builder</h3>
                 </div>
                 <button onClick={handleClear} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-400 hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                 </button>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="min-h-[160px] p-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 mb-8 flex flex-wrap gap-3 content-start shadow-inner">
                    {autoSentence ? autoSentence.split(' ').map((word, i) => (
                      <span key={i} className="px-5 py-2.5 bg-white rounded-2xl text-slate-900 font-black text-sm shadow-md border border-slate-100 animate-in zoom-in duration-300">
                        {word}
                      </span>
                    )) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 gap-4 py-8">
                         <Mic size={32} className="opacity-20" />
                         <p className="text-xs font-bold uppercase tracking-widest opacity-40">Listening for sign sequences...</p>
                      </div>
                    )}
                 </div>
                 
                 <div className="space-y-4">
                    <Button onClick={() => speakText(autoSentence)} disabled={!autoSentence} className="w-full rounded-[2rem] py-8 font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-500/20 active:scale-95 transition-all">
                       <Volume2 size={24} className="mr-3" /> Execute Speech
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                       <Button variant="outline" onClick={() => {
                          navigator.clipboard.writeText(autoSentence);
                          toast.success("Sentence stored in clipboard");
                       }} disabled={!autoSentence} className="rounded-[1.5rem] h-16 text-[10px] font-black uppercase tracking-[0.2em]">
                          <Copy size={18} className="mr-2" /> Copy Buffer
                       </Button>
                       <Button variant="secondary" onClick={async () => {
                          try {
                             await translationsAPI.create({
                                input_gesture: autoSentence,
                                output_text: language === 'Urdu' ? translatedText : autoSentence,
                                language: language === 'Urdu' ? 'ur' : 'en',
                                confidence: confidence || 1.0
                             });
                             toast.success("Transaction saved to history");
                             fetchRecentHistory();
                          } catch (err) {
                             toast.error("Database sync failed");
                          }
                       }} disabled={!autoSentence} className="rounded-[1.5rem] h-16 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-900 text-white border-none hover:bg-slate-800">
                          <Save size={18} className="mr-2" /> Sync Log
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Real-time Session Log */}
           <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden flex flex-col h-[500px]">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8">
                 <div className="flex items-center gap-3">
                    <History size={18} className="text-slate-400" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Session Activity</h3>
                 </div>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto space-y-4 flex-1">
                 {recentHistory.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 text-slate-400 py-20 gap-4">
                      <Activity size={48} />
                      <p className="text-[10px] font-black tracking-widest uppercase">Buffer Clear</p>
                   </div>
                 ) : recentHistory.map((item, i) => (
                   <div key={item.id || i} className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:shadow-lg hover:border-brand-200 transition-all duration-500 group">
                      <div className="flex items-center justify-between mb-2">
                         <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                            item.prediction_type === 'alphabet' ? 'bg-blue-50 text-blue-600' :
                            item.prediction_type === 'digit' ? 'bg-amber-50 text-amber-600' :
                            'bg-emerald-50 text-emerald-600'
                         }`}>{item.prediction_type}</span>
                         <div className="flex items-center gap-1 text-slate-300">
                            <Clock size={10} />
                            <span className="text-[9px] font-bold">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                      </div>
                      <div className="flex items-center justify-between">
                         <p className="font-black text-slate-900 text-lg tracking-tight group-hover:text-brand-600 transition-colors">{item.prediction}</p>
                         <ArrowRight size={16} className="text-slate-200 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default LiveTranslator;
