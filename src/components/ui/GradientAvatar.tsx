import React, { useState } from 'react';
import { Trophy, ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import {
  getInitials,
  getAvatarGradientConfig,
  AvatarGradientPreset,
} from '../../lib/avatar';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type AvatarShape = 'circle' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'square';
export type AvatarBadge = 'crown' | 'ace' | 'verified' | 'admin' | 'online' | 'offline';

export interface GradientAvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  shape?: AvatarShape;
  gradientPreset?: AvatarGradientPreset | string;
  badge?: AvatarBadge;
  showGlow?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const SIZE_MAP: Record<AvatarSize, { box: string; text: string; badge: string; icon: string }> = {
  xs: { box: 'w-6 h-6', text: 'text-[10px]', badge: 'w-2 h-2', icon: 'w-2 h-2' },
  sm: { box: 'w-8 h-8', text: 'text-xs', badge: 'w-2.5 h-2.5', icon: 'w-2.5 h-2.5' },
  md: { box: 'w-10 h-10', text: 'text-sm', badge: 'w-3 h-3', icon: 'w-3 h-3' },
  lg: { box: 'w-12 h-12', text: 'text-base', badge: 'w-3.5 h-3.5', icon: 'w-3.5 h-3.5' },
  xl: { box: 'w-16 h-16', text: 'text-xl', badge: 'w-4 h-4', icon: 'w-4 h-4' },
  '2xl': { box: 'w-20 h-20', text: 'text-2xl', badge: 'w-5 h-5', icon: 'w-4 h-4' },
  '3xl': { box: 'w-24 h-24', text: 'text-3xl', badge: 'w-6 h-6', icon: 'w-5 h-5' },
};

const SHAPE_MAP: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  'rounded-lg': 'rounded-lg',
  'rounded-xl': 'rounded-xl',
  'rounded-2xl': 'rounded-2xl',
  square: 'rounded-none',
};

export const GradientAvatar: React.FC<GradientAvatarProps> = ({
  name,
  src,
  size = 'md',
  shape = 'rounded-xl',
  gradientPreset,
  badge,
  showGlow = false,
  className = '',
  onClick,
  title,
}) => {
  const [imgError, setImgError] = useState(false);

  const initials = getInitials(name);
  const config = getAvatarGradientConfig(gradientPreset, name);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const shapeClass = SHAPE_MAP[shape] || SHAPE_MAP['rounded-xl'];

  const hasPhoto = !!src && !imgError;

  const renderBadge = () => {
    if (!badge) return null;

    if (badge === 'online') {
      return (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${sizeConfig.badge} rounded-full bg-emerald-500 border-2 border-black shadow-[0_0_8px_rgba(16,185,129,0.8)]`}
          title="Online"
        />
      );
    }

    if (badge === 'offline') {
      return (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${sizeConfig.badge} rounded-full bg-gray-600 border-2 border-black`}
          title="Offline"
        />
      );
    }

    if (badge === 'crown') {
      return (
        <span
          className={`absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-black border border-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.8)]`}
          title="Champion Crown"
        >
          <Trophy className={sizeConfig.icon} />
        </span>
      );
    }

    if (badge === 'ace') {
      return (
        <span
          className={`absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-gradient-to-br from-red-500 to-orange-600 text-white border border-red-300 shadow-[0_0_10px_rgba(239,68,68,0.8)]`}
          title="Ace Tier Player"
        >
          <Award className={sizeConfig.icon} />
        </span>
      );
    }

    if (badge === 'admin') {
      return (
        <span
          className={`absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-500 text-black border border-amber-300 font-black shadow-md`}
          title="Platform Admin"
        >
          <ShieldCheck className={sizeConfig.icon} />
        </span>
      );
    }

    if (badge === 'verified') {
      return (
        <span
          className={`absolute -bottom-1 -right-1 p-0.5 rounded-full bg-blue-500 text-white border border-blue-300 shadow-md`}
          title="Verified Player"
        >
          <CheckCircle2 className={sizeConfig.icon} />
        </span>
      );
    }

    return null;
  };

  return (
    <div
      onClick={onClick}
      title={title || name}
      className={`relative inline-block shrink-0 ${onClick ? 'cursor-pointer group' : ''}`}
    >
      <div
        className={`relative flex items-center justify-center font-mono font-black uppercase tracking-wider select-none overflow-hidden transition-all duration-300 ${
          sizeConfig.box
        } ${shapeClass} ${
          showGlow ? config.glowColor : ''
        } ${
          onClick ? 'group-hover:scale-105 group-hover:brightness-110' : ''
        } ${className}`}
      >
        {hasPhoto ? (
          <img
            src={src!}
            alt={name}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover ${shapeClass}`}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center border ${config.borderColor} ${config.gradientClass} ${config.textColor}`}
          >
            <span className={`${sizeConfig.text} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
              {initials}
            </span>
          </div>
        )}
      </div>

      {renderBadge()}
    </div>
  );
};
