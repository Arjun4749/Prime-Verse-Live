import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Swords,
  Award,
  Tv,
  Newspaper,
  BookOpen,
  HelpCircle,
  Info,
  Mail,
  UserCheck,
  Shield,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Bell,
  Image as ImageIcon,
  Contrast,
  Sun,
  Eye,
  MessageSquare,
  Search,
  Sparkles,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { supabase } from '../../lib/supabase';
import { signOutUser, getCurrentSupabaseUser } from '../../lib/supabaseAuth';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NotificationOverlay } from './NotificationOverlay';
import { QuickSearchModal } from './QuickSearchModal';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(dbStore.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Keyboard shortcut (⌘K / Ctrl+K) to open Quick Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keep the navbar synchronized with the real Supabase session.
  // This handles BOTH login and logout while the Navbar stays mounted.
  useEffect(() => {
    let mounted = true;

    const syncAuthState = async () => {
      try {
        const currentUser = await getCurrentSupabaseUser();

        if (!mounted) return;

        setIsAuthenticated(Boolean(currentUser));

        if (currentUser) {
          setUser(dbStore.getCurrentUser());
        }
      } catch (error) {
        console.error('Navbar authentication check failed:', error);

        if (mounted) {
          setIsAuthenticated(false);
        }
      }
    };

    syncAuthState();

    const subscription = supabase?.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      const loggedIn = Boolean(session?.user);
      setIsAuthenticated(loggedIn);

      if (loggedIn) {
        setUser(dbStore.getCurrentUser());
      }
    });

    return () => {
      mounted = false;
      subscription?.data?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();

      setIsAuthenticated(false);
      setMobileMenuOpen(false);

      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Swords },
    { name: 'Tournaments', path: '/tournaments', icon: Trophy },
    { name: 'WhatsApp', path: '/whatsapp', icon: MessageSquare },
    { name: 'Leaderboard', path: '/leaderboard', icon: Award },
    { name: 'Winners', path: '/winners', icon: Trophy },
    { name: 'Media', path: '/media', icon: ImageIcon },
    { name: 'YouTube', path: '/youtube', icon: Tv },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Rules', path: '/rules', icon: BookOpen },
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const handleRoleToggle = (newRole: 'player' | 'admin' | 'moderator') => {
    const updated = dbStore.updateUserRole(newRole);
    setUser(updated);
    if (newRole === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] border border-[#222222] flex items-center justify-center font-black text-[#D4FF33] group-hover:border-[#D4FF33] transition-colors">
              <Trophy className="w-5 h-5 text-[#D4FF33]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-white font-mono flex items-center gap-0.5">
                BGMI<span className="text-[#D4FF33]">/</span>ARENA
              </span>
              <span className="text-[9px] font-mono text-[#D4FF33] uppercase tracking-widest -mt-0.5">
                SYSTEM_STATUS: OK
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1.5 bg-[#111111] p-1.5 rounded-full border border-[#222222]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#D4FF33] text-black font-extrabold shadow'
                      : 'text-zinc-400 hover:text-white hover:bg-[#1A1A1A]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-black' : 'text-zinc-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions & Role Switcher */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Quick Search Bar Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="px-3 py-1.5 rounded-2xl border border-[#222222] bg-[#111111] hover:border-[#D4FF33]/50 hover:bg-[#181a24] text-zinc-300 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono group"
              title="Quick Search tournaments, players, news, or match rooms (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#D4FF33] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] text-zinc-400 group-hover:text-white font-medium hidden sm:inline">
                Quick Search...
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 bg-black text-zinc-400 rounded border border-zinc-800">
                <span>⌘</span>K
              </kbd>
            </button>

            {/* Theme Mode Toggler */}
            <button
              onClick={toggleTheme}
              className={`px-2.5 py-1.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black border-yellow-300 font-extrabold shadow-[0_0_12px_rgba(250,204,21,0.5)]'
                  : 'bg-[#111111] text-zinc-300 border-[#222222] hover:text-white hover:border-[#D4FF33]'
              }`}
              title={`Switch Theme Mode (Current: ${theme === 'high-contrast' ? 'High Contrast' : 'Bento Dark'})`}
            >
              <Contrast className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span className="hidden xl:inline">
                {theme === 'high-contrast' ? 'High Contrast' : 'Bento Dark'}
              </span>
            </button>

            {/* WhatsApp Quick Shortcut Button */}
            <Link
              to="/whatsapp"
              className="px-2.5 py-1.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider"
              title="Join Official WhatsApp Groups for Instant Room IDs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 fill-emerald-400/20" />
              <span className="hidden xl:inline">WhatsApp</span>
            </Link>

            {/* Notification Bell & Overlay */}
            <NotificationOverlay />

            {/* Quick Role Switcher */}
            <div className="flex items-center bg-[#111111] p-1 rounded-2xl border border-[#222222]">
              <button
                onClick={() => handleRoleToggle('player')}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  user.role === 'player' ? 'bg-[#D4FF33] text-black font-extrabold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Switch to Player View"
              >
                Player
              </button>
              <button
                onClick={() => handleRoleToggle('admin')}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  user.role === 'admin' ? 'bg-[#D4FF33] text-black font-extrabold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Switch to Admin Control Center"
              >
                Admin
              </button>
            </div>

            {user.role === 'admin' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#D4FF33]" />
                Dashboard
              </Button>
            )}

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title="Log Out"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xl:inline">Logout</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                title="Sign In"
              >
                <UserCheck className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Mobile Hamburger Toggle & Notifications */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-2xl bg-[#111111] text-zinc-300 hover:text-white border border-[#222222] transition-all cursor-pointer flex items-center justify-center"
              title="Quick Search (⌘K)"
            >
              <Search className="w-4 h-4 text-[#D4FF33]" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black border-yellow-300'
                  : 'bg-[#111111] text-zinc-300 border-[#222222]'
              }`}
              title="Toggle High Contrast Mode"
            >
              <Contrast className="w-4 h-4 text-yellow-400" />
            </button>
            <NotificationOverlay />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-zinc-300 hover:text-white bg-[#111111] border border-[#222222] rounded-2xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4FF33]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Modal */}
      <QuickSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A0A0A]/98 border-b border-[#222222] px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          {/* Theme Mode Toggle Pill */}
          <div className="flex items-center justify-between p-3 bg-[#111111] rounded-2xl border border-[#222222]">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5 text-yellow-400" /> Theme Mode:
            </span>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                theme === 'high-contrast'
                  ? 'bg-yellow-400 text-black font-black border border-yellow-300'
                  : 'bg-[#1a1a1a] text-zinc-300 border border-[#333]'
              }`}
            >
              {theme === 'high-contrast' ? '⚡ High Contrast' : '🌙 Bento Dark'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#111111] rounded-2xl border border-[#222222] mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Role Mode:</span>
            <div className="flex gap-2">
              <Badge
                variant={user.role === 'player' ? 'lime' : 'gray'}
                className="cursor-pointer"
                onClick={() => handleRoleToggle('player')}
              >
                Player
              </Badge>
              <Badge
                variant={user.role === 'admin' ? 'lime' : 'gray'}
                className="cursor-pointer"
                onClick={() => handleRoleToggle('admin')}
              >
                Admin
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                    active ? 'bg-[#D4FF33] text-black font-extrabold' : 'text-zinc-300 bg-[#111111] border border-[#222222]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#222222] flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(user.role === 'admin' ? '/admin' : '/dashboard');
              }}
            >
              {user.role === 'admin' ? 'Admin Panel' : 'My Account'}
            </Button>
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};