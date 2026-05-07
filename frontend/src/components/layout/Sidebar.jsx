import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Languages, 
  Target, 
  MessageSquare, 
  Settings, 
  LogOut,
  Hand,
  History,
  ShieldCheck,
  Activity,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../ui/Button';
import { authAPI } from '../../services/api';
import Modal from '../ui/Modal';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link
    to={path}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-brand-600 text-white shadow-md shadow-brand-200" 
        : "text-slate-600 hover:bg-brand-50 hover:text-brand-600"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-200 group-hover:scale-110", active ? "text-white" : "text-slate-400 group-hover:text-brand-600")} />
    <span className="font-bold text-sm">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('user');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await authAPI.getMe();
      setUserRole(res.data.role);
    } catch (err) {}
  };

  const userMenuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Languages, label: 'Live Translator', path: '/translate' },
    { icon: Target, label: 'Custom Training', path: '/training' },
    { icon: History, label: 'History Logs', path: '/history' },
  ];

  const adminMenuItems = [
    { icon: ShieldCheck, label: 'Admin Panel', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Activity, label: 'System Health', path: '/admin/health' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Session Terminated Successfully');
    navigate('/login');
    setIsLogoutModalOpen(false);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 p-6 flex flex-col z-40 hidden lg:flex">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-slate-900 p-2 rounded-lg text-white shadow-lg">
          <Hand size={20} />
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter">SignLink <span className="text-[10px] bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded-md ml-1 align-top uppercase">FYP</span></h1>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="mb-4">
           <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
           {(userRole === 'admin' && location.pathname.startsWith('/admin')) ? 
             adminMenuItems.map((item) => (
               <SidebarItem key={item.path} {...item} active={location.pathname === item.path} />
             )) :
             userMenuItems.map((item) => (
               <SidebarItem key={item.path} {...item} active={location.pathname === item.path} />
             ))
           }
        </div>
      </nav>

      <div className="pt-6 border-t border-slate-100 space-y-1">
        {userRole === 'admin' && !location.pathname.startsWith('/admin') && (
           <SidebarItem icon={ShieldCheck} label="Go to Admin" path="/admin" active={false} />
        )}
        <SidebarItem icon={Settings} label="Settings" path="/settings" active={location.pathname === '/settings'} />
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm">Logout</span>
        </button>
      </div>

      <Modal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Terminate Session?"
        message="Are you sure you want to log out? You will need to sign in again to access the translator."
        type="danger"
        confirmText="Yes, Log Out"
        cancelText="Stay Logged In"
      />
    </aside>
  );
};

export default Sidebar;
