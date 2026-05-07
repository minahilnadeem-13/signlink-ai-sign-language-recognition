import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate email send
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  if (emailSent) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle="We've sent recovery instructions to your inbox"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
            <CheckCircle2 size={40} />
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            If an account exists with that email address, you will receive a password reset link shortly.
          </p>
          <div className="pt-4">
            <Button variant="outline" className="w-full rounded-2xl" onClick={() => setEmailSent(false)}>
              Try another email
            </Button>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Didn't receive the email? <a href="#" className="text-brand-600 font-bold hover:underline">Resend</a>
          </p>
          <div className="pt-6 border-t border-slate-100">
            <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email to receive recovery instructions"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              required
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
              Send Instructions
              <Send className="ml-2" size={18} />
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
