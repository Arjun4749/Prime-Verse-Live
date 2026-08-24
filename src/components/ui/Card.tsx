import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'none' | 'orange' | 'blue' | 'gold' | 'lime';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = 'none',
  hoverEffect = true,
  className = '',
  ...props
}) => {
  const glowClasses = {
    none: 'border-[#222222] hover:border-[#333333]',
    orange: 'border-[#D4FF33]/40 shadow-[0_0_20px_rgba(212,255,51,0.15)] hover:border-[#D4FF33]',
    lime: 'border-[#D4FF33] shadow-[0_0_25px_rgba(212,255,51,0.2)] hover:border-[#D4FF33]',
    blue: 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-500/60',
    gold: 'border-[#D4FF33]/60 shadow-[0_0_20px_rgba(212,255,51,0.25)] hover:border-[#D4FF33]',
  };

  const hoverClass = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
    : '';

  return (
    <div
      className={`bg-[#111111] border rounded-[28px] p-6 overflow-hidden relative ${glowClasses[glow]} ${hoverClass} ${className}`}
      {...props}
    >
      {/* Subtle Bento glass accent shine */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4FF33]/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      {children}
    </div>
  );
};

