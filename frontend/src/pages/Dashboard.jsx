import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Hand, 
  History, 
  Plus, 
  ArrowUpRight,
  Clock,
  Settings as SettingsIcon,
  User,
  Languages,
  Activity,
  Type,
  ShieldCheck,
  ChevronRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { healthAPI, authAPI, dashboardAPI, historyAPI } from '../services/api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const StatCard = ({ icon: Icon, label, value, trend, color, delay = 0 }) => (
  <Card 
    className="border-none hover-lift animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <CardContent className="p-8">
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-[1.5rem] ${color} bg-opacity-10 text-brand-600 shadow-inner`}>
          <Icon size={28} />
        </div>
        {trend && (
          <div className="text-[10px] font-black glass-card px-3 py-1.5 rounded-full uppercase tracking-widest text-slate-500 border-transparent">
            {trend}
          </div>
        )}
      </div>
      <div className="mt-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{value || 0}</h3>
      </div>
    </CardContent>
  </Card>
);

const UserDashboard = () => {
  const [status, setStatus] = useState('Checking...');
  const [userName, setUserName] = useState('User');
  const [stats, setStats] = useState({
    total_recognitions: 0,
    today_recognitions: 0,
    total_sentences: 0,
    user_gestures: 0,
    recent_sentences: [],
    recent_detections: []
  });
  const [recentHistory, setRecentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkHealth();
    fetchDashboardData();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await healthAPI.check();
      setStatus(res.data.status === 'ok' ? 'System Online' : 'Service Offline');
    } catch (err) {
      setStatus('Service Offline');
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const userRes = await authAPI.getMe();
      setUserName(userRes.data.name);
      
      const statsRes = await dashboardAPI.getStats();
      setStats(statsRes.data);

      const histRes = await historyAPI.getAll({ limit: 5 });
      setRecentHistory(histRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="SignLink Overview">
      {/* Welcome Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-1 bg-brand-600 rounded-full"></div>
             <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Platform Overview</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {userName}!</h2>
          <p className="text-slate-500 mt-1 font-medium">Assistive technology interface for seamless sign language translation.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pl-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Status</span>
              <span className={`text-xs font-bold ${status.includes('Online') ? 'text-emerald-600' : 'text-rose-600'}`}>{status}</span>
           </div>
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.includes('Online') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <ShieldCheck size={20} />
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={History} 
          label="Total Translations" 
          value={stats.total_recognitions} 
          trend="Lifetime"
          color="bg-brand-500"
          delay={0}
        />
        <StatCard 
          icon={Activity} 
          label="Today's Activity" 
          value={stats.today_recognitions} 
          trend="Last 24h"
          color="bg-emerald-500"
          delay={100}
        />
        <StatCard 
          icon={Zap} 
          label="AI Enhancements" 
          value={stats.ai_enhancements} 
          color="bg-purple-500"
          delay={200}
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Gestures Mastered" 
          value={stats.mastered_gestures} 
          color="bg-amber-500"
          delay={300}
        />
      </div>

      {/* Confidence Trend Chart */}
      <Card className="mb-12 border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-slate-50 flex items-center justify-between">
           <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Neural Confidence Analytics</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Aggregate stability of gesture inferences over time</p>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Live Engine Score: {stats.avg_confidence}%</span>
           </div>
        </CardHeader>
        <CardContent className="p-8 h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.confidence_trend || []}>
                 <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#0e8ce9" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#0e8ce9" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dx={-10} domain={[0, 100]} />
                 <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 800, fontSize: '12px' }}
                 />
                 <Area type="monotone" dataKey="value" stroke="#0e8ce9" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
           </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="group relative overflow-hidden premium-gradient rounded-[2.5rem] p-10 text-white shadow-2xl shadow-brand-500/30 hover:scale-[1.02] transition-all duration-500 cursor-pointer animate-slide-up" style={{ animationDelay: '400ms' }} onClick={() => navigate('/translate')}>
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                      <Languages size={32} />
                   </div>
                   <h3 className="text-3xl font-black mb-3 tracking-tight">Live Translator</h3>
                   <p className="text-brand-50 text-base mb-10 leading-relaxed font-medium">Access real-time sign language recognition and sentence assembly tools.</p>
                   <div className="flex items-center font-black text-sm uppercase tracking-widest">
                      Launch Module <ChevronRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                   </div>
                </div>
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
             </div>
             <div className="group relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/40 hover:scale-[1.02] transition-all duration-500 cursor-pointer animate-slide-up" style={{ animationDelay: '500ms' }} onClick={() => navigate('/training')}>
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                      <Hand size={32} />
                   </div>
                   <h3 className="text-3xl font-black mb-3 tracking-tight">Gesture Training</h3>
                   <p className="text-slate-400 text-base mb-10 leading-relaxed font-medium">Map custom hand landmarks to the database for personalized recognition.</p>
                   <div className="flex items-center font-black text-sm uppercase tracking-widest text-brand-400">
                      Launch Module <ChevronRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                   </div>
                </div>
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="group relative overflow-hidden bg-rose-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-rose-500/30 hover:scale-[1.02] transition-all duration-500 cursor-pointer animate-slide-up" style={{ animationDelay: '600ms' }} onClick={() => navigate('/emergency')}>
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                      <ShieldCheck size={32} />
                   </div>
                   <h3 className="text-3xl font-black mb-3 tracking-tight">Emergency Mode</h3>
                   <p className="text-rose-100 text-base mb-10 leading-relaxed font-medium">Quick communication bridge for medical or emergency situations.</p>
                   <div className="flex items-center font-black text-sm uppercase tracking-widest">
                      Enter Emergency Mode <ChevronRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                   </div>
                </div>
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
             </div>
             <div className="group relative overflow-hidden bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-500 cursor-pointer animate-slide-up" style={{ animationDelay: '700ms' }} onClick={() => navigate('/learning')}>
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                      <Activity size={32} />
                   </div>
                   <h3 className="text-3xl font-black mb-3 tracking-tight">Learning Assistant</h3>
                   <p className="text-emerald-100 text-base mb-10 leading-relaxed font-medium">Personalized AI sessions to master sign language gestures.</p>
                   <div className="flex items-center font-black text-sm uppercase tracking-widest">
                      Start Learning <ChevronRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                   </div>
                </div>
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
             </div>
          </div>

          {/* Recent Detections Panel */}
          <Card className="border-none shadow-lg">
             <CardHeader className="border-b border-slate-50 flex items-center justify-between py-6">
                <div className="flex items-center gap-2">
                   <Hand size={18} className="text-emerald-600" />
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Recently Detected Words</h3>
                </div>
                <div className="flex items-center gap-1">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Sync</span>
                </div>
             </CardHeader>
             <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                   {(!stats.recent_detections || stats.recent_detections.length === 0) ? (
                     <div className="col-span-full py-8 text-center text-slate-300 italic text-sm">No recent words detected.</div>
                   ) : stats.recent_detections.map((d, i) => (
                     <div key={i} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-brand-200 hover:shadow-md transition-all group">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mb-2 ${
                           d.prediction_type === 'alphabet' ? 'bg-blue-50 text-blue-600' :
                           d.prediction_type === 'digit' ? 'bg-amber-50 text-amber-600' :
                           'bg-emerald-50 text-emerald-600'
                        }`}>{d.prediction_type}</span>
                        <p className="font-black text-slate-900 text-xl group-hover:text-brand-600 transition-colors">{d.prediction}</p>
                        <p className="text-[10px] text-slate-400 UrduFont mt-1">{d.translated_text}</p>
                        <span className="text-[8px] font-bold text-slate-300 mt-2">{new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                   ))}
                </div>
             </CardContent>
          </Card>

          {/* Recent Sentences Panel */}
          <Card className="border-none shadow-lg">
             <CardHeader className="border-b border-slate-50 flex items-center justify-between py-6">
                <div className="flex items-center gap-2">
                   <Clock size={18} className="text-brand-600" />
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Recent Communication History</h3>
                </div>
             </CardHeader>
             <CardContent className="p-6">
                <div className="space-y-4">
                   {(!stats.recent_sentences || stats.recent_sentences.length === 0) ? (
                     <div className="py-12 text-center text-slate-300 italic text-sm">No full sentences saved recently.</div>
                   ) : stats.recent_sentences.slice(0, 3).map((s, i) => (
                     <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                        <div>
                           <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-lg">{s.top_prediction}</p>
                           <p className="text-sm text-slate-400 UrduFont mt-1">{s.translated_text}</p>
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
           <Card className="border-none shadow-lg">
              <CardHeader className="py-6 border-b border-slate-50">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Platform Settings</h3>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                 {[
                    { icon: User, label: "Profile Information", desc: "User identity management", tab: 'profile' }
                 ].map((action, i) => (
                   <button 
                     key={i} 
                     onClick={() => navigate(`/settings#${action.tab}`)}
                     className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-brand-50 transition-all text-left group border border-transparent hover:border-brand-100"
                   >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-brand-600 transition-all shadow-sm">
                         <action.icon size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{action.label}</p>
                         <p className="text-[10px] text-slate-400 font-medium">{action.desc}</p>
                      </div>
                   </button>
                 ))}
              </CardContent>
           </Card>

           {/* Quick Support Card */}
           <div className="p-8 bg-brand-50 rounded-3xl border border-brand-100">
              <div className="flex items-center gap-2 mb-4">
                 <ShieldCheck size={20} className="text-brand-600" />
                 <h4 className="text-xs font-black text-brand-600 uppercase tracking-widest">Support Panel</h4>
              </div>
              <p className="text-xs text-brand-700 leading-relaxed font-medium mb-6">Need help with the translation engine? Visit our support module for guidance on signs.</p>
              <Button variant="outline" className="w-full border-brand-200 text-brand-600 hover:bg-brand-100 rounded-xl font-bold h-12">
                 View Documentation
              </Button>
           </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserDashboard;
