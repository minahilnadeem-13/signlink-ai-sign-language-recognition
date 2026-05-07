import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  Database,
  Hand,
  Info,
  Layers,
  Trash2,
  Zap,
  Activity,
  ChevronRight,
  ShieldCheck,
  Video
} from 'lucide-react';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { gesturesAPI } from '../services/api';

const PREDEFINED_GESTURES = [
  'Hello',
  'Hi',
  'Yes',
  'No',
  'Help',
  'Stop',
  'OK',
  'Thank You',
  'I Love You',
];

const TARGET_SAMPLES = 30;

const Training = () => {
  const [gestures, setGestures] = useState([]);
  const [gestureName, setGestureName] = useState(PREDEFINED_GESTURES[0]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedSamples, setCapturedSamples] = useState(0);
  const [modelStatus, setModelStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const webcamRef = useRef(null);
  const captureInterval = useRef(null);

  useEffect(() => {
    fetchAll();
    return () => {
      if (captureInterval.current) clearInterval(captureInterval.current);
    };
  }, []);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [gesturesRes, statusRes] = await Promise.all([
        gesturesAPI.getAll(),
        gesturesAPI.modelStatus(),
      ]);
      setGestures(gesturesRes.data);
      setModelStatus(statusRes.data);
    } catch (err) {
      toast.error('Failed to load training data');
    } finally {
      setIsLoading(false);
    }
  };

  const startCapture = async () => {
    if (!gestureName.trim()) {
      toast.error('Choose or enter a gesture name');
      return;
    }
    if (!isCameraOn) {
      toast.error('Camera must be active');
      return;
    }

    setIsCapturing(true);
    setProgress(0);
    setCapturedSamples(0);

    let count = 0;
    captureInterval.current = setInterval(async () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;

      try {
        await gesturesAPI.capture({
          gesture_name: gestureName.trim(),
          frame: imageSrc,
        });
        count += 1;
        setCapturedSamples(count);
        setProgress((count / TARGET_SAMPLES) * 100);
        if (count >= TARGET_SAMPLES) {
          clearInterval(captureInterval.current);
          captureInterval.current = null;
          setIsCapturing(false);
          toast.success(`${gestureName} samples captured`);
          fetchAll();
        }
      } catch (err) {
        const detail = err?.response?.data?.detail || 'Capture failed';
        clearInterval(captureInterval.current);
        captureInterval.current = null;
        setIsCapturing(false);
        toast.error(detail);
      }
    }, 250);
  };

  const trainModel = async () => {
    setIsTraining(true);
    try {
      const res = await gesturesAPI.train({
        min_samples_per_label: 8,
        neighbors: 5,
      });
      toast.success(res.data.message || 'Model trained');
      fetchAll();
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Training failed');
    } finally {
      setIsTraining(false);
    }
  };

  const deleteGesture = async (id) => {
    try {
      await gesturesAPI.delete(id);
      setGestures((prev) => prev.filter((item) => item.id !== id));
      toast.success('Gesture deleted from library');
    } catch (err) {
      toast.error('Failed to delete gesture');
    }
  };

  return (
    <AppLayout title="Gesture Training Protocol">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-1 bg-brand-600 rounded-full"></div>
             <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Neural Network Training</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Landmark Training</h2>
          <p className="text-slate-500 mt-1 font-medium">Capture hand landmarks to personalize the recognition engine.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pl-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Status</span>
              <span className={`text-xs font-bold ${isTraining ? 'text-amber-600' : 'text-emerald-600'}`}>
                 {isTraining ? 'Engine Rebuilding...' : 'Idle • Ready'}
              </span>
           </div>
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isTraining ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
              <Zap size={20} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-7 space-y-8">
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                   <Video size={20} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Optics Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isCameraOn ? 'Live Stream' : 'Standby'}</span>
              </div>
            </CardHeader>

            <div className="aspect-video bg-slate-950 relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-700">
              {isCameraOn ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-inner">
                     <CameraOff size={40} className="opacity-20" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Optical Node Inactive</p>
                </div>
              )}

              {isCapturing && (
                <div className="absolute inset-0 bg-brand-600/10 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500">
                  <div className="w-80 p-8 glass-card rounded-[2.5rem] border-white/40 shadow-2xl flex flex-col items-center">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
                      <div className="h-full bg-brand-600 transition-all duration-300 shadow-lg" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Capturing samples</p>
                    <h4 className="text-3xl font-black text-brand-600 tracking-tighter">{capturedSamples} / {TARGET_SAMPLES}</h4>
                  </div>
                </div>
              )}
            </div>

            <CardFooter className="bg-white p-10 flex flex-col gap-8 border-t border-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gesture Protocol</label>
                   <div className="relative">
                      <select
                        value={gestureName}
                        onChange={(e) => setGestureName(e.target.value)}
                        disabled={isCapturing}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-700 focus:ring-4 ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all appearance-none shadow-inner"
                      >
                        {PREDEFINED_GESTURES.map((gesture) => (
                          <option key={gesture} value={gesture}>
                            {gesture}
                          </option>
                        ))}
                      </select>
                      <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Identifier</label>
                   <input
                     type="text"
                     placeholder="Define new gesture..."
                     value={gestureName}
                     onChange={(e) => setGestureName(e.target.value)}
                     disabled={isCapturing}
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-700 focus:ring-4 ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all shadow-inner"
                   />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 w-full justify-between pt-2">
                <div className="flex gap-4">
                   <Button onClick={() => setIsCameraOn(!isCameraOn)} variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest">
                     {isCameraOn ? <CameraOff size={18} className="mr-3" /> : <Camera size={18} className="mr-3" />}
                     {isCameraOn ? 'Kill Stream' : 'Active stream'}
                   </Button>
                   <Button onClick={startCapture} disabled={isCapturing || !isCameraOn} className="rounded-2xl h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-brand-500/20 active:scale-95 transition-all">
                     <Hand size={18} className="mr-3" />
                     Initialize Capture
                   </Button>
                </div>
                <Button onClick={trainModel} disabled={isTraining} className="rounded-2xl h-14 px-10 font-black uppercase text-[10px] tracking-widest bg-slate-900 hover:bg-slate-800 border-none shadow-xl shadow-slate-200">
                  <Zap size={18} className={`mr-3 ${isTraining ? 'animate-spin' : ''}`} />
                  {isTraining ? 'Rebuilding Neural Weights...' : 'Finalize Training'}
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="p-10 bg-brand-50 rounded-[2.5rem] border border-brand-100 flex gap-8 shadow-sm">
            <div className="w-16 h-16 bg-white rounded-2xl shrink-0 flex items-center justify-center text-brand-600 shadow-lg shadow-brand-500/10">
              <Info size={32} />
            </div>
            <div>
              <h4 className="text-brand-900 font-black mb-2 uppercase tracking-[0.2em] text-[10px]">Training Strategy Protocol</h4>
              <p className="text-brand-700 text-sm leading-relaxed font-medium">
                For optimal accuracy, isolate your hand against a clean background. Vary the tilt and rotation slightly during the 30-sample capture phase. Ensure your hand remains within the focal frame throughout the sequence.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-50 py-6 px-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                   <ShieldCheck size={20} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Model Integrity</h3>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {!modelStatus ? (
                <div className="flex flex-col items-center py-10 opacity-20">
                   <Activity size={32} className="animate-pulse mb-3" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Syncing status...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600">Active State</span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${modelStatus.model_loaded ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {modelStatus.model_loaded ? 'Loaded' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Neural Library Coverage</p>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(modelStatus.dataset_counts || {}).length === 0 ? (
                        <div className="col-span-2 py-10 text-center text-slate-400 italic text-sm bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">No samples registered.</div>
                      ) : (
                        Object.entries(modelStatus.dataset_counts || {}).map(([label, count]) => (
                          <div key={label} className="p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[9px] font-black uppercase tracking-widest text-brand-600 mb-1">{label}</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{count}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Frames</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] flex flex-col flex-1 overflow-hidden">
            <CardHeader className="bg-slate-900 text-white py-6 px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-brand-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-100">Gesture Archives</h3>
              </div>
              <span className="bg-brand-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{gestures.length} Total</span>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto max-h-[500px]">
              {isLoading ? (
                <div className="p-20 text-center">
                   <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Syncing database...</p>
                </div>
              ) : gestures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-20 text-slate-400 text-center">
                  <Database size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Archive Empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {gestures.map((gesture) => (
                    <div key={gesture.id} className="flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-slate-100 group hover:shadow-xl hover:scale-[1.02] transition-all duration-500">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                          <Hand size={22} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 tracking-tight text-lg">{gesture.gesture_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{gesture.samples_count} Samples logged</p>
                        </div>
                      </div>
                      <button onClick={() => deleteGesture(gesture.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Training;
