import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hand, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../ui/Button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "glass-nav py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group animate-fade-in">
          <div className="premium-gradient p-2 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Hand size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">SignLink</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">How it Works</a>
          <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 md:hidden flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-300">
          <a href="#features" className="text-lg font-medium text-slate-600">Features</a>
          <a href="#how-it-works" className="text-lg font-medium text-slate-600">How it Works</a>
          <hr className="border-slate-100" />
          <div className="flex flex-col gap-3">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Log in</Button>
            </Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
