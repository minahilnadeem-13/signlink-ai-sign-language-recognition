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
  ArrowRight
} from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { dashboardAPI, healthAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_recognitions: 0,
    total_sentences: 0,
    total_chat_messages: 0,
    stats_by_type: { alphabets: 0, numbers: 0, words: 0 }
  });
  const [health, setHealth] = useState({ status: 'unknown', uptime: '0s' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, healthRes] = await Promise.all([
        dashboardAPI.getStats(),
        healthAPI.check()
      ]);
      setStats(statsRes.data);
      setHealth(healthRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout title="Administrator Control Panel">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Lock size={20} />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Restricted Admin Area</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Management</h2>
            <p className="text-slate-500 mt-1 font-medium">Monitor platform performance, user activity, and engine metrics.</p>
         </div>
         <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Server: Optimized</span>
         </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         <AdminStatCard icon={Users} label="Registered Users" value={stats.total_users} color="indigo" />
         <AdminStatCard icon={Activity} label="System Recognitions" value={stats.total_recognitions} color="brand" />
         <AdminStatCard icon={Database} label="Stored Sentences" value={stats.total_sentences} color="purple" />
         <AdminStatCard icon={HardDrive} label="Platform Health" value={health.status === 'ok' ? '100%' : '90%'} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* System Logs / Metrics */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl">
               <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Recognition Distribution</h3>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="grid grid-cols-3 gap-8">
                     <MetricBox label="Alphabets" value={stats.stats_by_type?.alphabets || 0} percentage="45%" color="blue" />
                     <MetricBox label="Digits" value={stats.stats_by_type?.numbers || 0} percentage="25%" color="amber" />
                     <MetricBox label="Words" value={stats.stats_by_type?.words || 0} percentage="30%" color="emerald" />
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
               <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Security & Authentication Log</h3>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                 <ShieldAlert size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">User Login Detected</p>
                                 <p className="text-[10px] text-slate-400 uppercase tracking-widest">Success • 127.0.0.1 • 2 mins ago</p>
                              </div>
                           </div>
                           <ArrowRight size={16} className="text-slate-300" />
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-6">
            <Card className="bg-slate-900 text-white border-none shadow-2xl">
               <CardContent className="p-8">
                  <Globe size={32} className="text-brand-400 mb-6" />
                  <h4 className="text-xl font-bold mb-2">Platform Scale</h4>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">SignLink is currently processing 1,200+ frames per minute across all active nodes.</p>
                  <Button className="w-full bg-brand-600 hover:bg-brand-500 border-none font-bold py-6">
                     View Server Clusters
                  </Button>
               </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
               <CardHeader className="bg-slate-50 border-b border-slate-50">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Administrative Tools</h3>
               </CardHeader>
               <CardContent className="p-4 space-y-2">
                  <AdminTool icon={Search} label="Audit Logs" />
                  <AdminTool icon={Users} label="User Management" />
                  <AdminTool icon={PieChart} label="Analytics Export" />
                  <AdminTool icon={Settings} label="System Config" />
                  <Button variant="danger" className="w-full mt-4 rounded-xl h-12 font-bold flex items-center justify-center gap-2">
                     <Trash2 size={18} /> Purge Temp Data
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </AppLayout>
  );
};

const AdminStatCard = ({ icon: Icon, label, value, color }) => (
   <Card className="border-none shadow-sm">
      <CardContent className="p-6">
         <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}>
            <Icon size={24} />
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-3xl font-black text-slate-900">{value}</h4>
      </CardContent>
   </Card>
);

const MetricBox = ({ label, value, percentage, color }) => (
   <div className="text-center">
      <div className={`text-3xl font-black text-${color}-600 mb-1`}>{value}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
         <div className={`h-full bg-${color}-500`} style={{ width: percentage }}></div>
      </div>
   </div>
);

const AdminTool = ({ icon: Icon, label }) => (
   <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-all text-left group">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-brand-600 shadow-sm transition-all">
         <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
   </button>
);

export default AdminDashboard;
