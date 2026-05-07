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
      toast.success('Gesture deleted');
    } catch (err) {
      toast.error('Failed to delete gesture');
    }
  };

  return (
    <AppLayout title="Gesture Training Protocol">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-brand-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Sample Collection</h3>
              </div>
            </CardHeader>

            <div className="aspect-video bg-slate-900 relative">
              {isCameraOn ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                  <CameraOff size={48} className="mb-4 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Stream Inactive</p>
                </div>
              )}

              {isCapturing && (
                <div className="absolute inset-0 bg-brand-600/20 backdrop-blur-[2px] flex flex-col items-center justify-center">
                  <div className="w-72 h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-white font-black uppercase tracking-widest text-xs">
                    Capturing {gestureName}: {capturedSamples}/{TARGET_SAMPLES}
                  </p>
                </div>
              )}
            </div>

            <CardFooter className="bg-white p-6 flex flex-col gap-4 border-t border-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <select
                  value={gestureName}
                  onChange={(e) => setGestureName(e.target.value)}
                  disabled={isCapturing}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                >
                  {PREDEFINED_GESTURES.map((gesture) => (
                    <option key={gesture} value={gesture}>
                      {gesture}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Or type a custom gesture name"
                  value={gestureName}
                  onChange={(e) => setGestureName(e.target.value)}
                  disabled={isCapturing}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full">
                <Button onClick={() => setIsCameraOn(!isCameraOn)} variant="secondary" className="rounded-xl h-12 shadow-sm">
                  {isCameraOn ? <CameraOff size={18} className="mr-2" /> : <Camera size={18} className="mr-2" />}
                  {isCameraOn ? 'Camera Off' : 'Camera On'}
                </Button>
                <Button onClick={startCapture} disabled={isCapturing || !isCameraOn} variant="primary" className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-100">
                  <Hand size={16} className="mr-2" />
                  Capture 30 Samples
                </Button>
                <Button onClick={trainModel} disabled={isTraining} variant="accent" className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs">
                  <Zap size={16} className="mr-2" />
                  {isTraining ? 'Training...' : 'Train Model'}
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="p-8 bg-brand-50 rounded-3xl border border-brand-100 flex gap-6">
            <div className="p-3 bg-white rounded-2xl h-fit text-brand-600 shadow-sm">
              <Info size={24} />
            </div>
            <div>
              <h4 className="text-brand-900 font-bold mb-1 uppercase tracking-widest text-xs">How to Collect Better Data</h4>
              <p className="text-brand-700 text-sm leading-relaxed font-medium">
                Keep only one hand visible, vary angle slightly between frames, and collect at least 30-50 samples per gesture.
                For motion gestures like Hello or Hi, capture several short poses through the motion, then train again.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-50 border-b border-slate-50 py-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Model Status</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {!modelStatus ? (
                <p className="text-sm text-slate-400">Loading status...</p>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Model loaded</span>
                    <span className={modelStatus.model_loaded ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                      {modelStatus.model_loaded ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Trained labels</span>
                    <span className="font-bold text-slate-900">{modelStatus.trained_labels?.length || 0}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Dataset Counts</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(modelStatus.dataset_counts || {}).length === 0 ? (
                        <span className="text-sm text-slate-400 italic">No captured samples yet.</span>
                      ) : (
                        Object.entries(modelStatus.dataset_counts || {}).map(([label, count]) => (
                          <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
                            <div className="text-lg font-black text-slate-900">{count}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg h-full flex flex-col">
            <CardHeader className="bg-slate-50 border-b border-slate-50 py-6">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Stored Gesture Library</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-10 text-center text-slate-300">Syncing library...</div>
              ) : gestures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20 text-slate-400 text-center">
                  <AlertCircle size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No captured gesture classes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gestures.map((gesture) => (
                    <div key={gesture.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm">
                          <Hand size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{gesture.gesture_name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">{gesture.samples_count} Samples Captured</p>
                        </div>
                      </div>
                      <button onClick={() => deleteGesture(gesture.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
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
