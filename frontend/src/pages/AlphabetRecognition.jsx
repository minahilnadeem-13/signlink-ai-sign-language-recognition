import React, { useState, useRef, useEffect } from 'react';
import { Hand, Camera, CameraOff, Play, Square, Info } from 'lucide-react';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { recognitionAPI } from '../services/api';

const AlphabetRecognition = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [prediction, setPrediction] = useState('?');
  const [translatedText, setTranslatedText] = useState('');
  
  const webcamRef = useRef(null);
  const timerRef = useRef(null);

  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const startDetection = () => {
    if (!isCameraOn) return;
    setIsDetecting(true);
    timerRef.current = setInterval(async () => {
      if (webcamRef.current && isCameraOn) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          try {
            const res = await recognitionAPI.recognizeFrame({ frame: imageSrc });
            if (res.data.type === 'alphabet') {
              setPrediction(res.data.prediction);
              setTranslatedText(res.data.translatedText);
            } else if (res.data.prediction === 'No hand detected') {
              setPrediction('?');
            }
          } catch (err) {}
        }
      }
    }, 800);
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setPrediction('?');
  };

  return (
    <AppLayout title="Alphabet Recognition">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-2xl">
            <div className="aspect-video bg-slate-900 relative">
              {isCameraOn ? (
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4">
                   <CameraOff size={48} className="opacity-20" />
                   <p className="font-bold uppercase tracking-widest text-xs">Camera is Off</p>
                </div>
              )}
              
              {isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-48 h-48 border-2 border-dashed border-white/30 rounded-3xl animate-pulse"></div>
                </div>
              )}

              <div className="absolute bottom-10 right-10 flex flex-col items-center">
                 <div className="w-32 h-32 bg-brand-600 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white">
                    <span className="text-6xl font-black text-white">{prediction}</span>
                 </div>
                 <span className="mt-2 text-white font-bold UrduFont text-2xl">{translatedText}</span>
              </div>
            </div>
            
            <CardFooter className="bg-white p-6 border-t border-slate-100 flex items-center gap-4">
               <Button onClick={() => setIsCameraOn(!isCameraOn)} variant={isCameraOn ? 'secondary' : 'primary'} className="rounded-2xl">
                  {isCameraOn ? <CameraOff size={18} className="mr-2" /> : <Camera size={18} className="mr-2" />}
                  {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
               </Button>
               <Button onClick={isDetecting ? stopDetection : startDetection} disabled={!isCameraOn} variant={isDetecting ? 'danger' : 'accent'} className="rounded-2xl px-10">
                  {isDetecting ? <Square size={18} className="mr-2" /> : <Play size={18} className="mr-2" />}
                  {isDetecting ? 'Stop' : 'Start'}
               </Button>
            </CardFooter>
          </Card>

          <Card className="bg-slate-900 text-white border-none">
             <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-white">
                   <Info size={24} />
                </div>
                <div>
                   <h4 className="font-bold mb-1">How to use</h4>
                   <p className="text-sm text-slate-400">Position your hand clearly within the dashed frame. The system recognizes ASL standard alphabet signs. Ensure good lighting for better accuracy.</p>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
           <Card className="h-full flex flex-col">
              <CardHeader className="bg-slate-50">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Supported Letters</h3>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-5 gap-2 overflow-y-auto max-h-[500px]">
                 {alphabets.map(char => (
                   <div 
                    key={char} 
                    className={`aspect-square rounded-xl border flex items-center justify-center font-bold text-lg transition-all ${
                      prediction === char 
                        ? 'bg-brand-600 border-brand-600 text-white scale-110 shadow-lg z-10' 
                        : 'bg-white border-slate-100 text-slate-400'
                    }`}
                   >
                     {char}
                   </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AlphabetRecognition;
