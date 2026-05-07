import React, { useState } from 'react';
import { Sidebar as SidebarIcon, Menu, Bell, Search, User } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/ui/Button';

const AppLayout = ({ children, title }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 focus-within:ring-2 ring-brand-500/20 ring-offset-0 transition-all">
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search gestures..." 
                  className="bg-transparent border-none focus:outline-none px-2 text-sm w-48"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative text-slate-500">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
              
              <div className="h-10 w-10 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold overflow-hidden cursor-pointer hover:ring-2 ring-brand-500/20 transition-all">
                 <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
