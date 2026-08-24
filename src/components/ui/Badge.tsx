import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'blue' | 'green' | 'red' | 'gold' | 'gray' | 'lime';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'lime',
  size = 'md',
  pulse = false,
  className = '',
  onClick,
}) => {
  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]',
  };

  const variantStyles = {
    orange: 'bg-[#D4FF33] text-black font-black uppercase tracking-wider',
    lime: 'bg-[#D4FF33] text-black font-black uppercase tracking-wider',
    blue: 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-semibold',
    green: 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 font-semibold',
    red: 'bg-red-950/70 text-red-300 border border-red-800/60 font-semibold',
    gold: 'bg-[#D4FF33] text-black font-black uppercase tracking-wider',
    gray: 'bg-[#1A1A1A] text-zinc-400 border border-[#222222] font-mono',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-widest font-mono backdrop-blur-sm ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};

