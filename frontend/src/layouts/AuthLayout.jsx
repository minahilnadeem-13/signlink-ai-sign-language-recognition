import React from 'react';
import { Link } from 'react-router-dom';
import { Hand } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="premium-gradient p-3 rounded-2xl text-white shadow-xl shadow-brand-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Hand size={32} />
            </div>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">SignLink</span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight animate-slide-up">{title}</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-slide-up" style={{ animationDelay: '100ms' }}>{subtitle}</p>
        </div>

        <div className="glass-card p-10 lg:p-12 rounded-[3rem] animate-slide-up" style={{ animationDelay: '200ms' }}>
          {children}
        </div>

        <p className="text-center mt-12 text-xs font-black text-slate-400 uppercase tracking-widest animate-fade-in" style={{ animationDelay: '400ms' }}>
          © 2026 SignLink AI • Innovation in Accessibility
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
