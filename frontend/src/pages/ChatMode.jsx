import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Languages, 
  Activity,
  History,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { chatAPI, authAPI } from '../services/api';

const ChatMode = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchData = async () => {
    try {
      const userRes = await authAPI.getMe();
      setCurrentUser(userRes.data);
      await fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await chatAPI.getHistory('demo-room');
      setMessages(res.data);
    } catch (err) {}
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await chatAPI.sendMessage({
        room_id: 'demo-room',
        message: newMessage,
        message_type: 'text'
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      toast.error("Failed to transmit message");
    }
  };

  return (
    <AppLayout title="Assistive Communication Chat">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-180px)]">
        
        {/* Chat Interface (3/4) */}
        <div className="xl:col-span-3 flex flex-col">
           <Card className="flex-1 flex flex-col border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8 flex flex-row items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                       <MessageSquare size={20} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-slate-900 tracking-tight">Communication Channel</h3>
                       <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Secured Node • Active</p>
                    </div>
                 </div>
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">U{i}</div>
                    ))}
                 </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-8 bg-slate-50/30" ref={scrollRef}>
                 <div className="space-y-6">
                    {messages.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center opacity-20 text-slate-400 py-20">
                          <History size={48} className="mb-4" />
                          <p className="text-sm font-bold uppercase tracking-widest">No transaction history</p>
                       </div>
                    ) : messages.map((msg) => (
                       <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl p-5 shadow-sm ${
                             msg.sender_id === currentUser?.id 
                                ? 'bg-brand-600 text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                          }`}>
                             <p className="text-sm leading-relaxed">{msg.message}</p>
                             {msg.translated_text && (
                                <p className={`mt-3 pt-3 border-t text-sm UrduFont leading-relaxed ${
                                   msg.sender_id === currentUser?.id ? 'border-white/10 text-brand-100' : 'border-slate-50 text-slate-500'
                                }`}>
                                   {msg.translated_text}
                                </p>
                             )}
                             <p className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${
                                msg.sender_id === currentUser?.id ? 'text-brand-300' : 'text-slate-400'
                             }`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </p>
                          </div>
                       </div>
                    ))}
                 </div>
              </CardContent>

              <CardFooter className="bg-white p-6 border-t border-slate-100">
                 <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input 
                       type="text" 
                       placeholder="Type your message here..." 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 ring-brand-500/20 outline-none transition-all"
                    />
                    <Button type="submit" className="rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg shadow-brand-100">
                       <Send size={20} />
                    </Button>
                 </form>
              </CardFooter>
           </Card>
        </div>

        {/* Sidebar Info (1/4) */}
        <div className="xl:col-span-1 space-y-6 hidden xl:block">
           <Card className="border-none shadow-lg">
              <CardHeader className="py-6 border-b border-slate-50">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Channel Overview</h3>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                          <Activity size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</p>
                          <p className="text-sm font-bold text-slate-900">End-to-End Encrypted</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                          <Languages size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Translations</p>
                          <p className="text-sm font-bold text-slate-900">English/Urdu Dual</p>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                 <Info size={18} className="text-brand-400" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Usage Note</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Chat messages are synchronized with the central translation engine to provide real-time bilingual support.</p>
           </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatMode;
