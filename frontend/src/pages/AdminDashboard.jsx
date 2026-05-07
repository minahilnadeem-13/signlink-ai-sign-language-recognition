import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  Database, 
  Search, 
  Trash2, 
  Settings, 
  BarChart, 
  PieChart,
  HardDrive,
  Globe,
  Lock,
  ArrowRight,
  TrendingUp,
  Server,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  User
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { dashboardAPI, healthAPI, contactAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_recognitions: 0,
    total_sentences: 0,
    stats_by_type: { alphabets: 0, numbers: 0, words: 0 }
  });
  const [health, setHealth] = useState({ status: 'unknown', uptime: '0s' });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, healthRes, msgRes] = await Promise.all([
        dashboardAPI.getStats(),
        healthAPI.check(),
        contactAPI.getMessages()
      ]);
      setStats(statsRes.data);
      setHealth(healthRes.data);
      setMessages(msgRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status);
      toast.success(`Message marked as ${status}`);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <AppLayout title="Administrator Control Panel">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/20">
                  <Lock size={20} />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Admin Domain</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Infrastructure</h2>
            <p className="text-slate-500 mt-1 font-medium">Platform-wide orchestration of neural nodes, user databases, and system health.</p>
         </div>
         <div className="bg-white border border-slate-100 px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-2xl shadow-slate-200/50">
            <div className="flex flex-col text-right">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
               <span className="text-sm font-black text-emerald-600">Operational • {health.uptime || '99.9%'}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center animate-pulse">
               <Server size={20} />
            </div>
         </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
         <AdminStatCard icon={Users} label="Identity Registry" value={stats.total_users} color="text-indigo-600" bg="bg-indigo-50" shadow="shadow-indigo-500/10" />
         <AdminStatCard icon={Activity} label="Neural Inferences" value={stats.total_recognitions} color="text-brand-600" bg="bg-brand-50" shadow="shadow-brand-500/10" />
         <AdminStatCard icon={Database} label="Sentence Clusters" value={stats.total_sentences} color="text-purple-600" bg="bg-purple-50" shadow="shadow-purple-500/10" />
         <AdminStatCard icon={Mail} label="Active Inquiries" value={messages.filter(m => m.status === 'unread').length} color="text-emerald-600" bg="bg-emerald-50" shadow="shadow-emerald-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* System Analytics */}
         <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Platform Inquiries</h3>
                     <MessageSquare size={18} className="text-brand-500" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                     {messages.length === 0 ? (
                       <div className="p-20 text-center text-slate-400">
                          <Mail size={48} className="mx-auto mb-4 opacity-10" />
                          <p className="text-sm font-bold uppercase tracking-widest opacity-40">No pending messages</p>
                       </div>
                     ) : messages.map((msg) => (
                        <div key={msg.id} className="p-10 hover:bg-slate-50 transition-all group">
                           <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-brand-600 shadow-sm">
                                    <User size={20} />
                                 </div>
                                 <div>
                                    <p className="text-lg font-black text-slate-900 tracking-tight">{msg.name}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{msg.email}</p>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                 <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                                    msg.status === 'unread' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                 }`}>
                                    {msg.status}
                                 </span>
                                 <div className="flex items-center gap-1 text-slate-300">
                                    <Clock size={10} />
                                    <span className="text-[9px] font-bold">{new Date(msg.created_at).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-white/50 border border-slate-100 p-6 rounded-[2rem] mb-6">
                              <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-2">{msg.subject}</p>
                              <p className="text-slate-600 font-medium leading-relaxed">{msg.message}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              {msg.status === 'unread' && (
                                <button onClick={() => handleUpdateStatus(msg.id, 'read')} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">
                                   <CheckCircle2 size={14} /> Mark as Read
                                </button>
                              )}
                              <button onClick={() => handleUpdateStatus(msg.id, 'archived')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                 <Trash2 size={14} /> Archive
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Distribution Vectors</h3>
               </CardHeader>
               <CardContent className="p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                     <MetricBox label="Alphabetics" value={stats.stats_by_type?.alphabets || 0} percentage="45%" color="bg-blue-500" textColor="text-blue-600" />
                     <MetricBox label="Numerics" value={stats.stats_by_type?.numbers || 0} percentage="25%" color="bg-amber-500" textColor="text-amber-600" />
                     <MetricBox label="Lexicon" value={stats.stats_by_type?.words || 0} percentage="30%" color="bg-emerald-500" textColor="text-emerald-600" />
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Command Center Sidebar */}
         <div className="space-y-8">
            <Card className="bg-slate-950 text-white border-none shadow-2xl rounded-[3rem] overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Zap size={120} className="text-brand-500" />
               </div>
               <CardContent className="p-10 relative z-10">
                  <div className="w-16 h-16 bg-brand-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-brand-500/50">
                     <Globe size={32} />
                  </div>
                  <h4 className="text-2xl font-black mb-2 tracking-tight">Platform Scaling</h4>
                  <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Neural engine orchestration is currently handling 14,000+ landmark inferences per hour across localized clusters.</p>
                  <Button className="w-full bg-white text-slate-900 hover:bg-brand-50 border-none font-black text-xs uppercase tracking-widest py-6 rounded-2xl transition-all">
                     Cluster Orchestrator
                  </Button>
               </CardContent>
            </Card>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Command Controls</h3>
               </CardHeader>
               <CardContent className="p-4 space-y-2">
                  <AdminTool icon={Search} label="Neural Audit" />
                  <AdminTool icon={Users} label="User Directory" />
                  <AdminTool icon={PieChart} label="Data Synthesizer" />
                  <AdminTool icon={Mail} label="Inquiry Management" />
                  <div className="pt-4 px-2">
                     <Button variant="danger" className="w-full rounded-[1.5rem] py-6 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-rose-100 border-none">
                        <Trash2 size={18} /> Purge Volatile Data
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </AppLayout>
  );
};

const AdminStatCard = ({ icon: Icon, label, value, color, bg, shadow }) => (
   <Card className={`border-none shadow-2xl ${shadow} rounded-[2.5rem] hover:scale-[1.05] transition-all duration-500 group`}>
      <CardContent className="p-8">
         <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
            <Icon size={28} />
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h4>
      </CardContent>
   </Card>
);

const MetricBox = ({ label, value, percentage, color, textColor }) => (
   <div className="text-center group">
      <div className={`text-4xl font-black ${textColor} mb-2 tracking-tighter transition-all group-hover:scale-110`}>{value}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</p>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
         <div className={`h-full ${color} rounded-full transition-all duration-1000 delay-300 shadow-lg`} style={{ width: percentage }}></div>
      </div>
   </div>
);

const AdminTool = ({ icon: Icon, label }) => (
   <button className="w-full flex items-center gap-4 p-5 rounded-[2rem] hover:bg-slate-50 transition-all text-left group">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-brand-500/20 transition-all duration-500">
         <Icon size={20} />
      </div>
      <span className="text-sm font-black text-slate-700 tracking-tight">{label}</span>
   </button>
);

export default AdminDashboard;
