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
  X
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
      toast.success("Item deleted");
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to clear ALL history?")) return;
    try {
      await historyAPI.clearAll();
      setHistory([]);
      toast.success("History cleared");
    } catch (err) {
      toast.error("Failed to clear history");
    }
  };

  return (
    <AppLayout title="Recognition History">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-700 focus:ring-2 ring-brand-500/20 focus:outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="alphabet">Alphabets</option>
                <option value="number">Numbers</option>
                <option value="word">Words</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
           </div>

           <button 
             onClick={() => setTodayOnly(!todayOnly)}
             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${todayOnly ? 'bg-brand-600 border-brand-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600'}`}
           >
              <Calendar size={16} />
              Today Only
           </button>
        </div>

        <Button variant="danger" className="rounded-xl flex items-center gap-2" onClick={clearAll} disabled={history.length === 0}>
           <Trash2 size={16} />
           Clear All History
        </Button>
      </div>

      <Card className="border-none shadow-xl overflow-hidden">
        <CardContent className="p-0">
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="bg-slate-50 text-left border-b border-slate-100">
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prediction</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auto Sentence</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Urdu Translation</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confidence</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date & Time</th>
                       <th className="px-6 py-4 text-center"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                      <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">Loading your history...</td></tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-20 text-center">
                           <div className="flex flex-col items-center opacity-30">
                              <HistoryIcon size={64} className="mb-4" />
                              <p className="text-xl font-bold">No history found</p>
                              <p className="text-sm">Try using the translator to record some signs!</p>
                           </div>
                        </td>
                      </tr>
                    ) : history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className={`flex items-center gap-2 w-fit px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                              item.prediction_type === 'alphabet' ? 'bg-blue-50 text-blue-600' :
                              item.prediction_type === 'number' ? 'bg-amber-50 text-amber-600' :
                              item.prediction_type === 'word' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-slate-50 text-slate-600'
                           }`}>
                              {item.prediction_type === 'alphabet' && <Hand size={10} />}
                              {item.prediction_type === 'number' && <Hash size={10} />}
                              {item.prediction_type === 'word' && <MessageSquare size={10} />}
                              {item.prediction_type}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-lg font-bold text-slate-900">{item.prediction}</span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-sm text-slate-500 font-medium italic">{item.auto_sentence || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-lg font-medium text-slate-600 UrduFont">{item.translated_text || '-'}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-brand-500" style={{ width: `${item.confidence * 100}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-500">{Math.round(item.confidence * 100)}%</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{new Date(item.created_at).toLocaleDateString()}</span>
                              <span className="text-[10px] font-bold text-slate-400">{new Date(item.created_at).toLocaleTimeString()}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <button 
                             onClick={() => deleteItem(item.id)}
                             className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                           >
                              <X size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default History;
