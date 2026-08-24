export interface BackgroundConfig {
  videoFile: string;
  theme: 'battlefield' | 'arena' | 'tactical' | 'rgb' | 'control' | 'championship' | 'results' | 'winners' | 'stream' | 'briefing' | 'info' | 'network' | 'entrance';
  title: string;
  overlayOpacity: number; // 0.3 to 0.75
  accentColor: string; // hex or rgb
  glowColor: string;
  effectElements: {
    smoke?: boolean;
    embers?: boolean;
    searchlights?: boolean;
    radarSweep?: boolean;
    spotlights?: boolean;
    confetti?: boolean;
    digitalGrid?: boolean;
  };
}

export const ROUTE_BACKGROUND_CONFIGS: Record<string, BackgroundConfig> = {
  '/': {
    videoFile: 'home-bg.mp4',
    theme: 'battlefield',
    title: 'Night Battlefield',
    overlayOpacity: 0.55,
    accentColor: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.4)',
    effectElements: { smoke: true, embers: true, searchlights: true },
  },
  '/tournaments': {
    videoFile: 'tournaments-bg.mp4',
    theme: 'arena',
    title: 'Esports Arena',
    overlayOpacity: 0.6,
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    effectElements: { spotlights: true, digitalGrid: true },
  },
  '/tournament-details': {
    videoFile: 'tournament-details-bg.mp4',
    theme: 'tactical',
    title: 'Tactical Command',
    overlayOpacity: 0.65,
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    effectElements: { radarSweep: true, digitalGrid: true },
  },
  '/registration': {
    videoFile: 'registration-bg.mp4',
    theme: 'rgb',
    title: 'Pro Prep Room',
    overlayOpacity: 0.55,
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    effectElements: { spotlights: true, embers: true },
  },
  '/dashboard': {
    videoFile: 'dashboard-bg.mp4',
    theme: 'control',
    title: 'Futuristic Control Room',
    overlayOpacity: 0.6,
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    effectElements: { digitalGrid: true, radarSweep: true },
  },
  '/admin': {
    videoFile: 'admin-bg.mp4',
    theme: 'tactical',
    title: 'Tournament Command Center',
    overlayOpacity: 0.65,
    accentColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    effectElements: { digitalGrid: true, radarSweep: true },
  },
  '/leaderboard': {
    videoFile: 'leaderboard-bg.mp4',
    theme: 'championship',
    title: 'Championship Stage',
    overlayOpacity: 0.55,
    accentColor: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    effectElements: { spotlights: true, embers: true },
  },
  '/results': {
    videoFile: 'results-bg.mp4',
    theme: 'results',
    title: 'Post Match Arena',
    overlayOpacity: 0.6,
    accentColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    effectElements: { smoke: true, embers: true },
  },
  '/winners': {
    videoFile: 'winners-bg.mp4',
    theme: 'winners',
    title: 'Championship Celebration',
    overlayOpacity: 0.5,
    accentColor: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    effectElements: { embers: true, confetti: true, spotlights: true },
  },
  '/youtube': {
    videoFile: 'youtube-bg.mp4',
    theme: 'stream',
    title: 'Gaming Stream Studio',
    overlayOpacity: 0.6,
    accentColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    effectElements: { spotlights: true },
  },
  '/media': {
    videoFile: 'youtube-bg.mp4',
    theme: 'stream',
    title: 'Media Hub',
    overlayOpacity: 0.6,
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    effectElements: { spotlights: true },
  },
  '/rules': {
    videoFile: 'rules-bg.mp4',
    theme: 'briefing',
    title: 'Tactical Briefing Environment',
    overlayOpacity: 0.65,
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    effectElements: { digitalGrid: true },
  },
  '/faq': {
    videoFile: 'faq-bg.mp4',
    theme: 'info',
    title: 'Futuristic Information Center',
    overlayOpacity: 0.6,
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    effectElements: { digitalGrid: true },
  },
  '/contact': {
    videoFile: 'contact-bg.mp4',
    theme: 'network',
    title: 'Digital Communication Network',
    overlayOpacity: 0.6,
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    effectElements: { digitalGrid: true },
  },
  '/login': {
    videoFile: 'login-bg.mp4',
    theme: 'entrance',
    title: 'Arena Entrance',
    overlayOpacity: 0.55,
    accentColor: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.45)',
    effectElements: { searchlights: true, embers: true },
  },
};

export function getBackgroundConfigForPath(pathname: string): BackgroundConfig {
  if (pathname === '/') return ROUTE_BACKGROUND_CONFIGS['/'];
  if (pathname.startsWith('/tournaments/') && pathname.includes('/register')) return ROUTE_BACKGROUND_CONFIGS['/registration'];
  if (pathname.startsWith('/tournaments/')) return ROUTE_BACKGROUND_CONFIGS['/tournament-details'];
  if (pathname.startsWith('/tournaments')) return ROUTE_BACKGROUND_CONFIGS['/tournaments'];
  if (pathname.startsWith('/admin')) return ROUTE_BACKGROUND_CONFIGS['/admin'];
  if (pathname.startsWith('/dashboard')) return ROUTE_BACKGROUND_CONFIGS['/dashboard'];
  if (pathname.startsWith('/winners/')) return ROUTE_BACKGROUND_CONFIGS['/winners'];
  if (pathname.startsWith('/winners')) return ROUTE_BACKGROUND_CONFIGS['/winners'];
  if (pathname.startsWith('/leaderboard')) return ROUTE_BACKGROUND_CONFIGS['/leaderboard'];
  if (pathname.startsWith('/results')) return ROUTE_BACKGROUND_CONFIGS['/results'];
  if (pathname.startsWith('/youtube')) return ROUTE_BACKGROUND_CONFIGS['/youtube'];
  if (pathname.startsWith('/media')) return ROUTE_BACKGROUND_CONFIGS['/media'];
  if (pathname.startsWith('/rules')) return ROUTE_BACKGROUND_CONFIGS['/rules'];
  if (pathname.startsWith('/faq')) return ROUTE_BACKGROUND_CONFIGS['/faq'];
  if (pathname.startsWith('/contact')) return ROUTE_BACKGROUND_CONFIGS['/contact'];
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password')) {
    return ROUTE_BACKGROUND_CONFIGS['/login'];
  }
  return ROUTE_BACKGROUND_CONFIGS['/'];
}
