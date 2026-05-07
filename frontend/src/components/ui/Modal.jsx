import React, { useEffect } from 'react';
import { X, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'info', 
  confirmText = 'Confirm',
  cancelText = 'Cancel' 
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const icons = {
    info: <Info className="text-blue-500" size={24} />,
    warning: <AlertTriangle className="text-amber-500" size={24} />,
    danger: <AlertTriangle className="text-red-500" size={24} />,
    success: <ShieldCheck className="text-emerald-500" size={24} />
  };

  const colors = {
    info: 'bg-blue-50',
    warning: 'bg-amber-50',
    danger: 'bg-red-50',
    success: 'bg-emerald-50'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8">
           <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl ${colors[type]} flex items-center justify-center`}>
                 {icons[type]}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
              >
                 <X size={20} />
              </button>
           </div>

           <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              {title}
           </h3>
           <p className="text-slate-500 font-medium leading-relaxed">
              {message}
           </p>
        </div>

        <div className="p-8 bg-slate-50 flex items-center gap-4 flex-row-reverse">
           <Button 
             variant={type === 'danger' ? 'danger' : 'primary'}
             onClick={onConfirm}
             className="flex-1 rounded-[20px] h-14 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
           >
              {confirmText}
           </Button>
           <Button 
             variant="ghost" 
             onClick={onClose}
             className="flex-1 rounded-[20px] h-14 font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-white transition-all shadow-sm"
           >
              {cancelText}
           </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
