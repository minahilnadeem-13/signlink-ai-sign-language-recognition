import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const variants = {
    primary: 'premium-gradient text-white hover:brightness-110 shadow-lg shadow-brand-500/20',
    secondary: 'glass-card text-brand-700 hover:bg-white/90',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/20',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-200/50 backdrop-blur-sm',
    outline: 'bg-transparent text-brand-600 border-2 border-brand-500/50 hover:border-brand-500 hover:bg-brand-50/50',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg font-semibold',
    icon: 'p-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
