import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, Calendar, Trash2, Search, UserPlus } from 'lucide-react';
import AppLayout from '../layouts/AppLayout';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@signlink.com', role: 'admin', created_at: '2026-04-29' },
    { id: 2, name: 'Muhammad', email: 'user@signlink.com', role: 'user', created_at: '2026-04-29' },
    { id: 3, name: 'Test User', email: 'test@gmail.com', role: 'user', created_at: '2026-04-30' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id) => {
    if (window.confirm("Permanent delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
      toast.success("User removed from platform");
    }
  };

  return (
    <AppLayout title="User Management">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search by name or email..." 
             className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 ring-brand-500/20 outline-none"
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden">
         <CardContent className="p-0">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Level</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {users.map(user => (
                     <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-black text-xs">
                                 {user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900">{user.name}</p>
                                 <p className="text-xs text-slate-400">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                           }`}>
                              {user.role}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                           {user.created_at}
                        </td>
                        <td className="px-8 py-5 text-right">
                           <button 
                             onClick={() => handleDelete(user.id)}
                             className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                           >
                              <Trash2 size={18} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </CardContent>
      </Card>
    </AppLayout>
  );
};

export default UserManagement;
