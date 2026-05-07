import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.verifyEmail(email);
      toast.success("Email verified successfully");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Email not found in our records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setIsLoading(true);
    try {
      await authAPI.resetPassword(email, password);
      toast.success("Password updated successfully! Please login.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <AuthLayout 
        title="Create New Password" 
        subtitle="Secure your account with a strong password"
      >
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                <ShieldCheck size={18} />
              </div>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all font-medium text-sm"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-4 rounded-2xl shadow-xl shadow-brand-100" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Update Password"
            )}
          </Button>

          <div className="pt-6 border-t border-slate-100 text-center">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Change Email
            </button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to verify your account"
    >
      <form onSubmit={handleVerifyEmail} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all font-medium text-sm"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full py-4 rounded-2xl shadow-xl shadow-brand-100" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Verify Email
              <ArrowLeft className="ml-2 rotate-180" size={18} />
            </>
          )}
        </Button>

        <div className="pt-6 border-t border-slate-100 text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
