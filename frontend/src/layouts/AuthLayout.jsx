import React from 'react';
import { Link } from 'react-router-dom';
import { Hand } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-brand-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-accent-100 rounded-full blur-3xl opacity-30"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="bg-brand-600 p-2 rounded-xl text-white shadow-lg shadow-brand-200">
              <Hand size={28} />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">SignLink</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-slate-500 font-medium">{subtitle}</p>
        </div>

        <div className="bg-white p-8 lg:p-10 rounded-[32px] shadow-2xl border border-slate-100">
          {children}
        </div>

        <p className="text-center mt-10 text-sm text-slate-500">
          © 2026 SignLink AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
