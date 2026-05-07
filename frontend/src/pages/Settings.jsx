import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Camera, 
  Languages, 
  Bell, 
  Shield, 
  LogOut, 
  Save, 
  Moon, 
  Volume2, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Camera as CameraIcon,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { authAPI } from '../services/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'en',
    ttsEnabled: true,
    confidenceThreshold: 0.7
  });

  useEffect(() => {
    fetchUser();
    const hash = window.location.hash.replace('#', '');
    if (['profile', 'app', 'camera'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await authAPI.getMe();
      setCurrentUser(res.data);
      setFormData({
        ...formData,
        name: res.data.name,
        email: res.data.email,
        language: res.data.language_preference || 'en'
      });
    } catch (err) {
      toast.error("Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await authAPI.updateProfile({
        name: formData.name,
        language_preference: formData.language
      });
      toast.success("Profile updated successfully!");
      fetchUser(); // Refresh local state
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update profile");
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, desc: 'Personal Information' },
    { id: 'app', label: 'App Settings', icon: SettingsIcon, desc: 'Recognition & Audio' },
    { id: 'camera', label: 'Camera Calibration', icon: Camera, desc: 'Hardware Optimization' },
  ];

  return (
    <AppLayout title="Platform Settings">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-3">
           <div className="p-2 mb-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Preferences</span>
           </div>
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] text-sm font-bold transition-all duration-500 group ${
                 activeTab === tab.id 
                   ? 'bg-white text-slate-900 shadow-2xl shadow-slate-200/50 scale-[1.05] z-10' 
                   : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
               }`}
             >
               <div className={`p-2.5 rounded-xl transition-all duration-500 ${
                  activeTab === tab.id ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-brand-600'
               }`}>
                  <tab.icon size={18} />
               </div>
               <div className="flex-1 text-left">
                  <p className="font-black tracking-tight">{tab.label}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === tab.id ? 'text-brand-500' : 'text-slate-400'}`}>{tab.desc}</p>
               </div>
               <ChevronRight size={16} className={`transition-transform duration-500 ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
             </button>
           ))}

           <div className="pt-8">
              <Button variant="outline" className="w-full border-rose-100 text-rose-500 hover:bg-rose-50 rounded-[1.5rem] py-6 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                 <LogOut size={16} /> Sign Out Account
              </Button>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden min-h-[600px] flex flex-col">
              {activeTab === 'profile' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-700 flex-1 flex flex-col">
                   <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10">
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                         <div className="relative group">
                            <div className="w-24 h-24 rounded-[2.5rem] premium-gradient flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-brand-500/30 group-hover:scale-105 transition-transform duration-500">
                               {formData.name.charAt(0) || 'U'}
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors border border-slate-100">
                               <CameraIcon size={18} />
                            </button>
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identity Management</h3>
                            <p className="text-sm text-slate-500 font-medium">Configure your personal profile and bilingual preferences.</p>
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent className="p-10 space-y-10 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                            <input 
                               type="text" 
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all font-bold text-slate-700 shadow-inner"
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email Address</label>
                            <input 
                               type="email" 
                               value={formData.email}
                               disabled
                               className="w-full px-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 cursor-not-allowed font-bold"
                            />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Native Language Protocol</label>
                         <div className="relative">
                            <select 
                              value={formData.language}
                              onChange={(e) => setFormData({...formData, language: e.target.value})}
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all font-bold text-slate-700 appearance-none shadow-inner"
                            >
                               <option value="en">American Sign Language (ASL)</option>
                               <option value="ur">Urdu Sign Language (PSL)</option>
                               <option value="intl">International Sign Language</option>
                            </select>
                            <Languages size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                         </div>
                      </div>

                      <div className="pt-10 flex justify-end">
                         <Button onClick={handleSave} className="px-12 py-6 rounded-[2rem] shadow-2xl shadow-brand-500/20 group">
                            <Save size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                            Update Profile
                         </Button>
                      </div>
                   </CardContent>
                </div>
              )}

              {activeTab === 'app' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                   <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Configuration</h3>
                      <p className="text-sm text-slate-500 font-medium">Fine-tune the artificial intelligence parameters and audio feedback.</p>
                   </CardHeader>
                   <CardContent className="p-10 space-y-12">
                      <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-inner">
                               <Volume2 size={28} />
                            </div>
                            <div>
                               <h4 className="text-lg font-black text-slate-900 tracking-tight">Bilingual Synthesis</h4>
                               <p className="text-sm text-slate-500 font-medium italic">Automatically speak recognized phrases in real-time</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => setFormData({...formData, ttsEnabled: !formData.ttsEnabled})}
                           className={`w-16 h-8 rounded-full transition-all duration-500 relative shadow-inner ${formData.ttsEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
                         >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-md ${formData.ttsEnabled ? 'right-1' : 'left-1'}`}></div>
                         </button>
                      </div>

                      <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <div>
                               <h4 className="text-lg font-black text-slate-900 tracking-tight">Engine Confidence Threshold</h4>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Optimization Balance</p>
                            </div>
                            <span className="text-2xl font-black text-brand-600 tracking-tighter bg-brand-50 px-4 py-2 rounded-xl">{Math.round(formData.confidenceThreshold * 100)}%</span>
                         </div>
                         <div className="relative py-4">
                            <input 
                              type="range" 
                              min="0.5" max="0.9" step="0.05"
                              value={formData.confidenceThreshold}
                              onChange={(e) => setFormData({...formData, confidenceThreshold: parseFloat(e.target.value)})}
                              className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-600 shadow-inner"
                            />
                            <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                               <span>High Performance</span>
                               <span>Maximum Precision</span>
                            </div>
                         </div>
                         <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p className="text-xs font-medium leading-relaxed">Higher confidence values ensure greater accuracy but may increase recognition latency on slower hardware.</p>
                         </div>
                      </div>

                      <div className="pt-6 flex justify-end">
                         <Button onClick={handleSave} className="px-12 py-6 rounded-[2rem] shadow-2xl shadow-brand-500/20 group">
                            <Save size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                            Update Settings
                         </Button>
                      </div>
                   </CardContent>
                </div>
              )}

              {activeTab === 'camera' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-700 flex-1 flex flex-col">
                   <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Camera Calibration</h3>
                      <p className="text-sm text-slate-500 font-medium">Verify your optical environment for optimized hand tracking performance.</p>
                   </CardHeader>
                   <CardContent className="p-10 flex flex-col items-center text-center flex-1">
                      <div className="w-full aspect-video bg-slate-950 rounded-[3rem] mb-10 flex items-center justify-center border-8 border-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
                         <div className="text-slate-500 flex flex-col items-center gap-4 transition-all duration-700 group-hover:scale-110">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-2 shadow-inner">
                               <CameraIcon size={40} className="opacity-40" />
                            </div>
                            <p className="font-black text-sm uppercase tracking-[0.3em] text-slate-400">Optics Feed: Standby</p>
                         </div>
                         <div className="absolute inset-0 bg-brand-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
                         <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <CheckCircle2 size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Lux Protocol: Optimal</span>
                         </div>
                         <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <CheckCircle2 size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Context: Isolated</span>
                         </div>
                         <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 text-amber-700 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <AlertCircle size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Focal Range: Low</span>
                         </div>
                      </div>

                      <Button className="rounded-[2rem] px-16 py-6 shadow-2xl shadow-brand-500/20 font-black text-sm uppercase tracking-widest active:scale-95 transition-all">
                         Initialize Optics Test
                      </Button>
                   </CardContent>
                </div>
              )}
           </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
