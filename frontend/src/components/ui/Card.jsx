import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-2xl overflow-hidden hover-lift animate-slide-up",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={cn("px-6 py-4 border-b border-slate-100", className)}>
    {children}
  </div>
);

export const CardContent = ({ children, className }) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

export const CardFooter = ({ children, className }) => (
  <div className={cn("px-6 py-4 bg-slate-50/50 border-t border-slate-100", className)}>
    {children}
  </div>
);

export default Card;
