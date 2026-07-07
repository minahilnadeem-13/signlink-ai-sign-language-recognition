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
  Users,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../ui/Button';
import { authAPI } from '../../services/api';
import Modal from '../ui/Modal';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link
    to={path}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
      active 
        ? "premium-gradient text-white shadow-lg shadow-brand-500/30" 
        : "text-slate-600 hover:bg-brand-50/50 hover:text-brand-600 glass-card border-transparent hover:border-brand-100"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3", active ? "text-white" : "text-slate-400 group-hover:text-brand-600")} />
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && (
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white/30 rounded-l-full" />
    )}
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
    { icon: Languages, label: 'Translator', path: '/translate' },
    { icon: Target, label: 'Teach AI', path: '/training' },
    { icon: History, label: 'Past Work', path: '/history' },
  ];

  const adminMenuItems = [
    { icon: ShieldCheck, label: 'Admin Panel', path: '/admin' },
    { icon: Users, label: 'User List', path: '/admin/users' },
    { icon: Activity, label: 'System Status', path: '/admin/health' },
    { icon: Mail, label: 'Messages', path: '/admin' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Session Terminated Successfully');
    navigate('/login');
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-68 glass-nav border-r-0 p-6 flex flex-col z-40 hidden lg:flex animate-fade-in shadow-2xl shadow-slate-200/50">
      <div className="flex items-center gap-3 px-2 mb-10 group cursor-pointer">
        <div className="premium-gradient p-2.5 rounded-xl text-white shadow-xl group-hover:rotate-12 transition-transform duration-500">
          <Hand size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">SignLink</h1>
          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Innovation Hub</span>
        </div>
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
        {userRole !== 'admin' && (
          <SidebarItem icon={Settings} label="Settings" path="/settings" active={location.pathname === '/settings'} />
        )}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm">Logout</span>
        </button>
      </div>

    </aside>
    <Modal 
      isOpen={isLogoutModalOpen}
      onClose={() => setIsLogoutModalOpen(false)}
      onConfirm={handleLogout}
      title="Logout?"
      message="Are you sure you want to log out? You will need to sign in again to use the translator."
      type="danger"
      confirmText="Yes, Logout"
      cancelText="Cancel"
    />
  </>
);
};

export default Sidebar;
