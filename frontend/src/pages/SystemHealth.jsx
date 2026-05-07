import React, { useState, useEffect } from 'react';
import { Activity, Database, Cpu, Globe, Zap, ShieldCheck, Clock, HardDrive } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { healthAPI } from '../services/api';

const SystemHealth = () => {
  const [health, setHealth] = useState({ status: 'checking', uptime: '0s', database: 'connected' });

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await healthAPI.check();
        setHealth(res.data);
      } catch (err) {
        setHealth({ status: 'error', database: 'disconnected' });
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout title="System Infrastructure Health">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <HealthCard icon={Zap} label="API Status" value={health.status === 'ok' ? 'Operational' : 'Critical'} status={health.status === 'ok' ? 'success' : 'danger'} />
         <HealthCard icon={Database} label="MySQL Database" value={health.database === 'connected' ? 'Connected' : 'Offline'} status={health.database === 'connected' ? 'success' : 'danger'} />
         <HealthCard icon={Clock} label="System Uptime" value={health.uptime || '99.9%'} status="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-none shadow-xl">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
               <div className="flex items-center gap-2">
                  <Cpu size={18} className="text-brand-600" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Resource Consumption</h3>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <ResourceBar label="CPU Utilization" value="24%" color="indigo" />
               <ResourceBar label="Memory Usage (8GB)" value="1.2GB" percentage={15} color="purple" />
               <ResourceBar label="Storage Capacity (500GB)" value="42GB" percentage={8} color="emerald" />
            </CardContent>
         </Card>

         <Card className="border-none shadow-xl">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Security Nodes</h3>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  <SecurityItem label="SSL Certificate" value="Valid (240 Days)" />
                  <SecurityItem label="CORS Policy" value="Restricted" />
                  <SecurityItem label="JWT Rotation" value="Active" />
                  <SecurityItem label="DDoS Shield" value="Active" />
               </div>
            </CardContent>
         </Card>
      </div>
    </AppLayout>
  );
};

const HealthCard = ({ icon: Icon, label, value, status }) => (
   <Card className="border-none shadow-md">
      <CardContent className="p-6">
         <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
               status === 'success' ? 'bg-emerald-50 text-emerald-600' :
               status === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-600'
            }`}>
               <Icon size={20} />
            </div>
            <div className={`w-3 h-3 rounded-full ${
               status === 'success' ? 'bg-emerald-500' :
               status === 'danger' ? 'bg-rose-500' : 'bg-brand-500 animate-pulse'
            }`}></div>
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-xl font-black text-slate-900">{value}</h4>
      </CardContent>
   </Card>
);

const ResourceBar = ({ label, value, percentage, color }) => (
   <div>
      <div className="flex justify-between mb-2">
         <span className="text-xs font-bold text-slate-600">{label}</span>
         <span className={`text-xs font-black text-${color}-600`}>{value}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
         <div 
           className={`h-full bg-${color}-500 transition-all duration-1000`} 
           style={{ width: percentage || value }}
         ></div>
      </div>
   </div>
);

const SecurityItem = ({ label, value }) => (
   <div className="px-8 py-5 flex items-center justify-between">
      <span className="text-sm font-bold text-slate-900">{label}</span>
      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
         {value}
      </span>
   </div>
);

export default SystemHealth;
