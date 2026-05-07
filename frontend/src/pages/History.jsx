import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Trash2, 
  Filter, 
  Calendar,
  CheckCircle2,
  Hand,
  Hash,
  MessageSquare,
  ChevronDown,
  X,
  Activity,
  ArrowRight,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { historyAPI } from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [todayOnly, setTodayOnly] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [filterType, todayOnly]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await historyAPI.getAll({ 
        type: filterType === 'all' ? undefined : filterType,
        today_only: todayOnly 
      });
      setHistory(res.data);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await historyAPI.deleteItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success("Transaction purged from local history");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to permanently clear ALL history logs?")) return;
    try {
      await historyAPI.clearAll();
      setHistory([]);
      toast.success("Global history logs cleared");
    } catch (err) {
      toast.error("Failed to clear history");
    }
  };

  return (
    <AppLayout title="Transaction History">
      {/* Header Info */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-1 bg-brand-600 rounded-full"></div>
             <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Recognition Logs</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Activity History</h2>
          <p className="text-slate-500 mt-1 font-medium">Review your past sign language translations and detected gestures.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 pl-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database Node</span>
              <span className="text-xs font-bold text-emerald-600">Active & Syncing</span>
           </div>
           <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity size={20} />
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                <Filter size={16} />
              </div>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-2xl pl-11 pr-12 py-3.5 text-sm font-black text-slate-700 focus:ring-4 ring-brand-500/10 focus:border-brand-500 focus:outline-none cursor-pointer shadow-sm transition-all"
              >
                <option value="all">Global Filter</option>
                <option value="alphabet">Alphabets Only</option>
                <option value="number">Numbers Only</option>
                <option value="word">Word Recognition</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>

           <button 
             onClick={() => setTodayOnly(!todayOnly)}
             className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border text-sm font-black transition-all duration-500 ${todayOnly ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 translate-y-[-2px]' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'}`}
           >
              <Calendar size={18} className={todayOnly ? 'text-brand-400' : 'text-slate-400'} />
              Today's Session
           </button>
        </div>

        <Button variant="outline" className="rounded-2xl border-rose-100 text-rose-500 hover:bg-rose-50 px-6 py-3.5 font-black uppercase text-[10px] tracking-widest flex items-center gap-2" onClick={clearAll} disabled={history.length === 0}>
           <Trash2 size={16} />
           Purge Database
        </Button>
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
         {isLoading ? (
           <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Archives...</p>
           </div>
         ) : history.length === 0 ? (
           <Card className="border-none shadow-xl rounded-[2.5rem] py-24 flex flex-col items-center justify-center opacity-40">
              <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
                 <HistoryIcon size={48} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Transactions Logged</h3>
              <p className="text-slate-500 font-medium">Record new signs to populate your local database.</p>
           </Card>
         ) : history.map((item, i) => (
           <Card 
             key={item.id} 
             className="border-none shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 group rounded-[2rem] overflow-hidden"
             style={{ animationDelay: `${i * 50}ms` }}
           >
              <CardContent className="p-0">
                 <div className="flex flex-col md:flex-row items-center">
                    {/* Icon Section */}
                    <div className={`w-full md:w-32 py-8 flex items-center justify-center shrink-0 ${
                       item.prediction_type === 'alphabet' ? 'bg-blue-50 text-blue-600' :
                       item.prediction_type === 'number' ? 'bg-amber-50 text-amber-600' :
                       'bg-emerald-50 text-emerald-600'
                    }`}>
                       {item.prediction_type === 'alphabet' && <Hand size={32} />}
                       {item.prediction_type === 'number' && <Hash size={32} />}
                       {item.prediction_type === 'word' && <MessageSquare size={32} />}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-4 gap-6 w-full items-center">
                       <div className="md:col-span-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detected Phrase</p>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">{item.prediction}</h4>
                          <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm inline-block mt-1 uppercase tracking-tighter text-slate-500">{item.prediction_type}</span>
                       </div>

                       <div className="md:col-span-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Urdu Translation</p>
                          <h4 className="text-2xl font-medium text-slate-600 UrduFont leading-tight">{item.translated_text || '—'}</h4>
                       </div>

                       <div className="md:col-span-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Confidence</p>
                          <div className="flex items-center gap-3">
                             <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div 
                                  className={`h-full transition-all duration-1000 delay-300 ${item.confidence > 0.8 ? 'bg-emerald-500' : 'bg-brand-500'}`} 
                                  style={{ width: `${item.confidence * 100}%` }}
                                ></div>
                             </div>
                             <span className="text-sm font-black text-slate-700">{Math.round(item.confidence * 100)}%</span>
                          </div>
                       </div>

                       <div className="md:col-span-1 flex items-center justify-between">
                          <div className="text-right flex-1 pr-6">
                             <div className="flex items-center justify-end gap-1.5 text-slate-400 mb-1">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                             </div>
                             <p className="text-xs font-bold text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p>
                          </div>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>
    </AppLayout>
  );
};

export default History;
