export type AvatarGradientPreset =
  | 'cyber-orange'
  | 'neon-lime'
  | 'electric-violet'
  | 'crimson-flame'
  | 'royal-gold'
  | 'sapphire-ice'
  | 'toxic-emerald'
  | 'shadow-stealth'
  | 'sunset-rose'
  | 'hyper-cyan';

export interface GradientConfig {
  id: AvatarGradientPreset;
  name: string;
  gradientClass: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
}

export const AVATAR_GRADIENTS: Record<AvatarGradientPreset, GradientConfig> = {
  'cyber-orange': {
    id: 'cyber-orange',
    name: 'Cyber Orange (Default)',
    gradientClass: 'bg-gradient-to-br from-orange-500 via-amber-600 to-red-700',
    textColor: 'text-white',
    borderColor: 'border-orange-500/60',
    glowColor: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]',
  },
  'neon-lime': {
    id: 'neon-lime',
    name: 'Neon Voltage',
    gradientClass: 'bg-gradient-to-br from-lime-400 via-emerald-600 to-teal-900',
    textColor: 'text-black font-black',
    borderColor: 'border-[#D4FF33]/70',
    glowColor: 'shadow-[0_0_15px_rgba(212,255,51,0.5)]',
  },
  'electric-violet': {
    id: 'electric-violet',
    name: 'Electric Purple',
    gradientClass: 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-900',
    textColor: 'text-purple-100',
    borderColor: 'border-purple-500/60',
    glowColor: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
  },
  'crimson-flame': {
    id: 'crimson-flame',
    name: 'Crimson Fury',
    gradientClass: 'bg-gradient-to-br from-red-600 via-rose-700 to-amber-900',
    textColor: 'text-red-100',
    borderColor: 'border-red-500/60',
    glowColor: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]',
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Champion Gold',
    gradientClass: 'bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-800',
    textColor: 'text-black font-black',
    borderColor: 'border-amber-400/80',
    glowColor: 'shadow-[0_0_18px_rgba(245,158,11,0.6)]',
  },
  'sapphire-ice': {
    id: 'sapphire-ice',
    name: 'Frostbite Sapphire',
    gradientClass: 'bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-950',
    textColor: 'text-cyan-100',
    borderColor: 'border-cyan-400/60',
    glowColor: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
  },
  'toxic-emerald': {
    id: 'toxic-emerald',
    name: 'Toxic Venom',
    gradientClass: 'bg-gradient-to-br from-emerald-400 via-green-600 to-emerald-950',
    textColor: 'text-emerald-950 font-black',
    borderColor: 'border-emerald-400/60',
    glowColor: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
  },
  'shadow-stealth': {
    id: 'shadow-stealth',
    name: 'Shadow Ops',
    gradientClass: 'bg-gradient-to-br from-slate-700 via-gray-800 to-slate-950',
    textColor: 'text-gray-200',
    borderColor: 'border-gray-600/60',
    glowColor: 'shadow-[0_0_12px_rgba(100,116,139,0.3)]',
  },
  'sunset-rose': {
    id: 'sunset-rose',
    name: 'Sunset Phoenix',
    gradientClass: 'bg-gradient-to-br from-pink-500 via-rose-600 to-purple-900',
    textColor: 'text-white',
    borderColor: 'border-pink-500/60',
    glowColor: 'shadow-[0_0_15px_rgba(236,72,153,0.4)]',
  },
  'hyper-cyan': {
    id: 'hyper-cyan',
    name: 'Hyper Cyber Cyan',
    gradientClass: 'bg-gradient-to-br from-teal-300 via-cyan-500 to-blue-800',
    textColor: 'text-black font-black',
    borderColor: 'border-teal-300/70',
    glowColor: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]',
  },
};

const PRESET_KEYS = Object.keys(AVATAR_GRADIENTS) as AvatarGradientPreset[];

/**
 * Extracts 1-2 letter clean initials from player name, IGN, or email
 */
export function getInitials(name?: string, fallbackIgn?: string): string {
  const str = (name || fallbackIgn || 'BGMI Player').trim();

  // Strip special clan prefixes or brackets like [SOUL], xX_..., etc.
  const cleanStr = str
    .replace(/^\[.*?\]\s*/, '')
    .replace(/^xX_/i, '')
    .replace(/_Xx$/i, '')
    .trim();

  if (!cleanStr) return 'P';

  const parts = cleanStr.split(/[\s._-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  if (cleanStr.length >= 2) {
    return cleanStr.substring(0, 2).toUpperCase();
  }

  return cleanStr.substring(0, 1).toUpperCase();
}

/**
 * Generates a deterministic hash-based gradient preset from name or user ID
 */
export function getDeterministicGradient(identifier: string): GradientConfig {
  if (!identifier) return AVATAR_GRADIENTS['cyber-orange'];

  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % PRESET_KEYS.length;
  const key = PRESET_KEYS[index];
  return AVATAR_GRADIENTS[key];
}

/**
 * Get gradient config by preset key or deterministic fallback
 */
export function getAvatarGradientConfig(
  presetKey?: string,
  identifierFallback?: string
): GradientConfig {
  if (presetKey && AVATAR_GRADIENTS[presetKey as AvatarGradientPreset]) {
    return AVATAR_GRADIENTS[presetKey as AvatarGradientPreset];
  }
  return getDeterministicGradient(identifierFallback || 'player');
}
