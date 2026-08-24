import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'gold' | 'lime';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-[#D4FF33]/50';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-7 py-3.5 text-sm gap-3',
  };

  const variantStyles = {
    primary:
      'bg-[#D4FF33] text-black hover:bg-[#c2f026] active:scale-[0.98] border border-[#D4FF33] font-black',
    secondary:
      'bg-[#1A1A1A] text-white hover:bg-[#222222] active:scale-[0.98] border border-[#222222]',
    outline:
      'bg-[#111111] text-zinc-300 hover:text-white border border-[#222222] hover:border-[#D4FF33] hover:bg-[#D4FF33]/10',
    danger: 'bg-red-600 text-white hover:bg-red-500 active:scale-[0.98] border border-red-500/30',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-[#1A1A1A]',
    gold: 'bg-[#D4FF33] text-black font-black hover:brightness-110 active:scale-[0.98] border border-[#D4FF33]',
    lime: 'bg-[#D4FF33] text-black font-black hover:bg-[#c2f026] active:scale-[0.98] border border-[#D4FF33]',
  };

  const glowStyles = glow ? 'shadow-[0_0_20px_rgba(212,255,51,0.3)] hover:shadow-[0_0_30px_rgba(212,255,51,0.5)]' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${glowStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

