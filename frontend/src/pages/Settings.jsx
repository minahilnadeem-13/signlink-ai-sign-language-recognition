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
  AlertCircle
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
    // Check if there's a specific tab requested via URL hash or state
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

  const handleSave = () => {
    // In a real app, you'd call an API here
    toast.success("Settings updated successfully!");
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'app', label: 'App Settings', icon: SettingsIcon },
    { id: 'camera', label: 'Camera Calibration', icon: Camera },
  ];

  return (
    <AppLayout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                 activeTab === tab.id 
                   ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' 
                   : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800'
               }`}
             >
               <tab.icon size={20} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
           <Card className="border-none shadow-xl min-h-[500px]">
              {activeTab === 'profile' && (
                <div className="animate-in fade-in duration-500">
                   <CardHeader className="border-b border-slate-100 p-8">
                      <h3 className="text-xl font-bold">Profile Information</h3>
                      <p className="text-sm text-slate-500">Update your personal details and account settings.</p>
                   </CardHeader>
                   <CardContent className="p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                            <input 
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 ring-brand-500/20 focus:outline-none"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                            <input 
                              type="email" 
                              value={formData.email}
                              disabled
                              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase">Preferred Sign Language</label>
                         <select 
                           value={formData.language}
                           onChange={(e) => setFormData({...formData, language: e.target.value})}
                           className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 ring-brand-500/20 focus:outline-none"
                         >
                            <option value="en">American Sign Language (ASL)</option>
                            <option value="ur">Urdu Sign Language (PSL)</option>
                            <option value="intl">International Sign Language</option>
                         </select>
                      </div>

                      <div className="pt-6 flex justify-end">
                         <Button onClick={handleSave} className="px-10 rounded-xl">
                            <Save size={18} className="mr-2" />
                            Save Profile
                         </Button>
                      </div>
                   </CardContent>
                </div>
              )}

              {activeTab === 'app' && (
                <div className="animate-in fade-in duration-500">
                   <CardHeader className="border-b border-slate-100 p-8">
                      <h3 className="text-xl font-bold">App Configuration</h3>
                      <p className="text-sm text-slate-500">Manage how SignLink behaves on your device.</p>
                   </CardHeader>
                   <CardContent className="p-8 space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                               <Volume2 size={24} />
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-900">Text-to-Speech</h4>
                               <p className="text-xs text-slate-500">Automatically speak recognized signs</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => setFormData({...formData, ttsEnabled: !formData.ttsEnabled})}
                           className={`w-12 h-6 rounded-full transition-colors relative ${formData.ttsEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.ttsEnabled ? 'right-1' : 'left-1'}`}></div>
                         </button>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900">Detection Confidence</h4>
                            <span className="text-brand-600 font-bold">{Math.round(formData.confidenceThreshold * 100)}%</span>
                         </div>
                         <input 
                           type="range" 
                           min="0.5" max="0.9" step="0.05"
                           value={formData.confidenceThreshold}
                           onChange={(e) => setFormData({...formData, confidenceThreshold: parseFloat(e.target.value)})}
                           className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                         />
                         <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Higher values improve accuracy but may slow down recognition</p>
                      </div>

                      <div className="pt-6 flex justify-end">
                         <Button onClick={handleSave} className="px-10 rounded-xl">
                            <Save size={18} className="mr-2" />
                            Update App Settings
                         </Button>
                      </div>
                   </CardContent>
                </div>
              )}

              {activeTab === 'camera' && (
                <div className="animate-in fade-in duration-500">
                   <CardHeader className="border-b border-slate-100 p-8">
                      <h3 className="text-xl font-bold">Camera Calibration</h3>
                      <p className="text-sm text-slate-500">Test your environment for optimal sign recognition.</p>
                   </CardHeader>
                   <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="w-full aspect-video bg-slate-900 rounded-3xl mb-8 flex items-center justify-center border-4 border-white shadow-2xl relative overflow-hidden">
                         <div className="text-slate-500 flex flex-col items-center gap-3">
                            <Camera size={48} className="opacity-20" />
                            <p className="font-bold text-xs uppercase tracking-widest">Webcam Feed Paused</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
                         <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex flex-col items-center gap-2">
                            <CheckCircle2 size={24} />
                            <span className="text-xs font-bold uppercase">Lighting: Good</span>
                         </div>
                         <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex flex-col items-center gap-2">
                            <CheckCircle2 size={24} />
                            <span className="text-xs font-bold uppercase">Background: Clear</span>
                         </div>
                         <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 flex flex-col items-center gap-2">
                            <AlertCircle size={24} />
                            <span className="text-xs font-bold uppercase">Distance: Too far</span>
                         </div>
                      </div>

                      <Button className="rounded-xl px-12 py-4">
                         Start Calibration Test
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
