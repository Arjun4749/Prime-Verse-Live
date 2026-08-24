import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Key,
  Copy,
  Check,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import { dbStore } from '../../services/dbStore';
import { googleSignIn } from '../../lib/workspaceAuth';

import {
  signInWithEmail,
  signOutUser,
  getCurrentSupabaseUser,
} from '../../lib/supabaseAuth';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuickLoginCardProps {
  className?: string;
  compact?: boolean;
}

export const QuickLoginCard: React.FC<QuickLoginCardProps> = ({
  className = '',
  compact = false,
}) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelect, setRoleSelect] = useState<'player' | 'admin'>('player');
  const [adminSecretKey, setAdminSecretKey] = useState('');

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [redirectingMessage, setRedirectingMessage] =
    useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const [currentUser, setCurrentUser] = useState(
    dbStore.getCurrentUser()
  );

  // IMPORTANT:
  // This tells the Home page whether a real Supabase session exists.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const defaultAdminSecret = dbStore.getAdminSecretId();

  // ============================================================
  // CHECK REAL SUPABASE LOGIN
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const checkAuthentication = async () => {
      try {
        const user = await getCurrentSupabaseUser();

        if (!mounted) return;

        if (user) {
          setIsAuthenticated(true);

          // Keep local user information synchronized
          const localUser = dbStore.getCurrentUser();

          if (localUser) {
            setCurrentUser(localUser);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);

        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // COPY ADMIN SECRET
  // ============================================================

  const handleCopySecret = () => {
    navigator.clipboard.writeText(defaultAdminSecret);
    setCopiedSecret(true);
    setAdminSecretKey(defaultAdminSecret);

    setTimeout(() => {
      setCopiedSecret(false);
    }, 2000);
  };

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);

    if (roleSelect === 'admin') {
      if (!adminSecretKey) {
        setErrorMsg(
          'Admin Secret Unique ID is required for Admin sign-in.'
        );
        return;
      }

      if (!dbStore.validateAdminSecretId(adminSecretKey)) {
        setErrorMsg(
          `Invalid Admin Secret Unique ID. Try default key: ${defaultAdminSecret}`
        );
        return;
      }
    }

    setIsGoogleLoading(true);

    try {
      const res = await googleSignIn();

      if (res) {
        const savedUser = dbStore.saveGoogleUser(
          res.user,
          roleSelect
        );

        const resolvedRole = savedUser.role || roleSelect;

        setCurrentUser(savedUser);

        // Mark the Home quick-login as authenticated
        setIsAuthenticated(true);

        if (resolvedRole === 'admin') {
          dbStore.logAction(
            'Google Admin Authentication',
            'Auth',
            res.user.uid
          );

          setRedirectingMessage(
            'Google Auth Verified! Directing to Admin Command Center...'
          );

          setTimeout(() => {
            navigate('/admin');
          }, 800);
        } else {
          dbStore.logAction(
            'Google Player Authentication',
            'Auth',
            res.user.uid
          );

          setRedirectingMessage(
            `Welcome back, ${
              savedUser.game_name || savedUser.username
            }! Directing to Arena...`
          );

          setTimeout(() => {
            navigate('/dashboard');
          }, 800);
        }
      }
    } catch (err: any) {
      console.error('Google login error:', err);

      setErrorMsg(
        err?.message ||
          'Failed to sign in with Google. Please try again.'
      );

      setIsGoogleLoading(false);
    }
  };

  // ============================================================
  // EMAIL + PASSWORD LOGIN
  // ============================================================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // ---------------- ADMIN AUTH ----------------

    if (roleSelect === 'admin') {
      if (!adminSecretKey) {
        setErrorMsg(
          'Admin Secret Unique ID is required to sign in as Admin.'
        );
        return;
      }

      if (!dbStore.validateAdminSecretId(adminSecretKey)) {
        setErrorMsg(
          `Invalid Admin Secret Unique ID. Try default key: ${defaultAdminSecret}`
        );
        return;
      }
    }

    try {
      // REAL SUPABASE EMAIL/PASSWORD AUTHENTICATION
      const data = await signInWithEmail(email, password);

      // Wrong email/password will stop here
      if (!data?.user) {
        setErrorMsg(
          'Login failed. Please check your email and password.'
        );
        return;
      }

      // IMPORTANT:
      // Supabase has successfully authenticated the user.
      setIsAuthenticated(true);

      // ---------------- ADMIN LOGIN ----------------

      if (roleSelect === 'admin') {
        dbStore.setCurrentUserRole('admin');

        dbStore.logAction(
          'Admin Form Login',
          'Auth',
          data.user.id
        );

        const adminUser = dbStore.getCurrentUser();

        setCurrentUser(adminUser);

        setRedirectingMessage(
          'Admin Authentication Successful! Directing to Admin Dashboard...'
        );

        setTimeout(() => {
          navigate('/admin');
        }, 700);

        return;
      }

      // ---------------- PLAYER LOGIN ----------------

      const current = dbStore.getCurrentUser();

      current.id = data.user.id;
      current.email = data.user.email || email;
      current.role = 'player';

      dbStore.setCurrentUser(current);

      setCurrentUser(current);

      dbStore.logAction(
        'Player Form Login',
        'Auth',
        data.user.id
      );

      setRedirectingMessage(
        'Player Authentication Successful! Directing to Dashboard...'
      );

      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err: any) {
      console.error('Quick login error:', err);

      // IMPORTANT:
      // Wrong password/email comes here.
      setIsAuthenticated(false);

      setErrorMsg(
        err?.message ||
          'Login failed. Please check your email and password.'
      );
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      // Actually log out from Supabase
      await signOutUser();

      // Reset local application state
      dbStore.setCurrentUserRole('player');

      const resetUser = dbStore.getCurrentUser();

      setCurrentUser(resetUser);
      setIsAuthenticated(false);

      setRedirectingMessage(
        'Logged out successfully.'
      );

      setTimeout(() => {
        setRedirectingMessage(null);
      }, 1200);
    } catch (error) {
      console.error('Logout error:', error);

      setErrorMsg(
        'Logout failed. Please try again.'
      );
    }
  };

  // ============================================================
  // IMPORTANT:
  // IF USER IS ALREADY LOGGED IN, REMOVE THIS CARD COMPLETELY
  // ============================================================

  if (checkingAuth) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  // ============================================================
  // LOGIN CARD
  // ============================================================

  return (
    <Card
      glow="orange"
      className={`p-5 sm:p-6 space-y-4 bg-[#11131f] border-orange-500/30 ${className}`}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-black">
            <Lock className="w-4 h-4" />
          </div>

          <div>
            <h3 className="text-sm font-black italic uppercase text-white font-mono tracking-wide">
              Arena Sign In
            </h3>

            <p className="text-[10px] text-gray-400">
              Quick Login to Custom Rooms & Tournaments
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-mono font-bold">
          LIVE AUTH
        </span>
      </div>

      {/* ERROR */}

      {errorMsg && (
        <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />

          <span>{errorMsg}</span>
        </div>
      )}

      {/* GOOGLE LOGIN */}

      <div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-2.5 px-3 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md shadow-white/5 disabled:opacity-50 cursor-pointer font-mono"
        >
          {isGoogleLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-gray-900" />

              <span>Google OAuth...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />

                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />

                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />

                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>

              <span>One-Click Google Login</span>
            </>
          )}
        </button>
      </div>

      {/* DIVIDER */}

      <div className="relative flex py-0.5 items-center">
        <div className="flex-grow border-t border-gray-800"></div>

        <span className="flex-shrink mx-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest font-mono">
          Or Credentials
        </span>

        <div className="flex-grow border-t border-gray-800"></div>
      </div>

      {/* LOGIN FORM */}

      <form
        onSubmit={handleLogin}
        className="space-y-3 text-xs font-mono"
      >
        {/* ACCOUNT TYPE */}

        <div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setRoleSelect('player');
                setErrorMsg(null);
              }}
              className={`py-1.5 px-2 rounded-lg font-bold uppercase transition-all text-[10px] flex items-center justify-center gap-1 cursor-pointer ${
                roleSelect === 'player'
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-black/60 text-gray-400 hover:text-white'
              }`}
            >
              Player Mode
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleSelect('admin');
                setErrorMsg(null);
              }}
              className={`py-1.5 px-2 rounded-lg font-bold uppercase transition-all text-[10px] flex items-center justify-center gap-1 cursor-pointer ${
                roleSelect === 'admin'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-black/60 text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Admin Mode
            </button>
          </div>
        </div>

        {/* ADMIN SECRET */}

        {roleSelect === 'admin' && (
          <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-red-400 font-extrabold text-[10px] flex items-center gap-1">
                <Key className="w-3 h-3" />
                Admin Secret ID
              </label>

              <button
                type="button"
                onClick={handleCopySecret}
                className="text-[9px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono cursor-pointer"
              >
                {copiedSecret ? (
                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                ) : (
                  <Copy className="w-2.5 h-2.5" />
                )}

                {copiedSecret
                  ? 'Copied'
                  : 'Auto-Fill Secret'}
              </button>
            </div>

            <input
              type="text"
              required
              value={adminSecretKey}
              onChange={(e) =>
                setAdminSecretKey(e.target.value)
              }
              placeholder="e.g. PRIME-ADMIN-8899-KEY"
              className="w-full bg-black/80 border border-red-500/40 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-red-500"
            />
          </div>
        )}

        {/* EMAIL */}

        <div>
          <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
            Email
          </label>

          <input
            type="email"
            required
            placeholder="player@esports.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/80 border border-gray-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* PASSWORD */}

        <div>
          <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
            Password
          </label>

          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-black/80 border border-gray-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* LOGIN BUTTON */}

        <Button
          variant="primary"
          size="md"
          glow
          type="submit"
          className="w-full text-xs"
        >
          LOGIN TO ARENA
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </form>

      {/* LINKS */}

      <div className="flex items-center justify-between pt-1 border-t border-gray-800/80 text-[10px] text-gray-400 font-mono">
        <Link
          to="/signup"
          className="text-orange-400 font-bold hover:underline"
        >
          New Player? Register
        </Link>

        <Link
          to="/forgot-password"
          className="text-gray-400 hover:text-white"
        >
          Forgot Key?
        </Link>
      </div>

      {/* REDIRECT MESSAGE */}

      {redirectingMessage && (
        <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />

          <span>{redirectingMessage}</span>
        </div>
      )}
    </Card>
  );
};