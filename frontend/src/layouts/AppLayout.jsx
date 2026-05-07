import React, { useState, useRef, useEffect } from 'react';
import { Sidebar as SidebarIcon, Menu, Bell, Search, User, X, Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/ui/Button';

const AppLayout = ({ children, title }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: "New Update Available",
      desc: "Version 2.0 brings improved Urdu gesture detection.",
      time: "2 mins ago",
      icon: Info,
      color: "text-blue-500 bg-blue-50"
    },
    {
      id: 2,
      title: "Gesture Captured",
      desc: "Your new custom gesture 'Hello' was saved successfully.",
      time: "1 hour ago",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-50"
    },
    {
      id: 3,
      title: "Security Alert",
      desc: "New login detected from a different device.",
      time: "5 hours ago",
      icon: AlertCircle,
      color: "text-amber-500 bg-amber-50"
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      {/* Background Blobs */}
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>

      <Sidebar />
      
      <main className="flex-1 lg:ml-68 min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-nav px-6 py-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight animate-slide-in-right">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center glass-card px-4 py-2 rounded-2xl border-transparent focus-within:border-brand-200 focus-within:ring-4 ring-brand-500/10 transition-all duration-300">
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search gestures..." 
                  className="bg-transparent border-none focus:outline-none px-3 text-sm w-56 font-medium text-slate-600 placeholder:text-slate-400"
                />
              </div>
              
              <div className="h-10 w-10 rounded-xl premium-gradient flex items-center justify-center text-white font-bold overflow-hidden cursor-pointer hover:rotate-6 hover:scale-110 transition-all shadow-lg shadow-brand-500/20">
                 <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
