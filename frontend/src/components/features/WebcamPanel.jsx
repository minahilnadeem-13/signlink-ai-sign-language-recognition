import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff, RefreshCw, Maximize2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const WebcamPanel = ({ isActive, onToggle, webcamRef }) => {
  const [isHovered, setIsHovered] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <Card 
      className="relative aspect-video bg-slate-900 overflow-hidden group border-none shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isActive ? (
        <div className="absolute inset-0">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
          {/* Overlay for detection box simulation */}
          <div className="absolute inset-0 border-2 border-brand-500/30 m-12 rounded-lg pointer-events-none">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-500"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-500"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-500"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-500"></div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4 bg-slate-950">
          <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
            <CameraOff size={32} />
          </div>
          <p className="font-medium text-lg">Camera is turned off</p>
          <Button onClick={onToggle} variant="primary" size="md">
            Start Camera
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="danger" 
                size="sm" 
                onClick={onToggle}
                className="rounded-full"
              >
                <CameraOff size={16} className="mr-2" />
                Stop
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                <RefreshCw size={16} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live
              </span>
              <Button variant="secondary" size="icon" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Maximize2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WebcamPanel;
