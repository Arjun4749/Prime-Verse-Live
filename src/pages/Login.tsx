import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Key, Copy, Check, AlertTriangle, RefreshCw, Compass, Sparkles } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { googleSignIn } from '../lib/workspaceAuth';
import { signInWithEmail } from '../lib/supabaseAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectParam = queryParams.get('redirect') || location.state?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelect, setRoleSelect] = useState<'player' | 'admin'>(
    queryParams.get('role') === 'admin' ? 'admin' : 'player'
  );
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [redirectingMessage, setRedirectingMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const defaultAdminSecret = dbStore.getAdminSecretId();

  const handleCopySecret = () => {
    navigator.clipboard.writeText(defaultAdminSecret);
    setCopiedSecret(true);
    setAdminSecretKey(defaultAdminSecret);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);

    if (roleSelect === 'admin') {
      if (!adminSecretKey) {
        setErrorMsg('Admin Secret Unique ID is required for Admin sign-in.');
        return;
      }
      if (!dbStore.validateAdminSecretId(adminSecretKey)) {
        setErrorMsg(`Invalid Admin Secret Unique ID. Please enter valid key (e.g., ${defaultAdminSecret}).`);
        return;
      }
    }

    setIsGoogleLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        const savedUser = dbStore.saveGoogleUser(res.user, roleSelect);
        const resolvedRole = savedUser.role || roleSelect;

        if (resolvedRole === 'admin') {
          dbStore.logAction('Google Admin Authentication', 'Auth', res.user.uid);
          setRedirectingMessage('Google Auth Verified! Routing to Admin Command Center...');
          setTimeout(() => {
            navigate(redirectParam && redirectParam.startsWith('/admin') ? redirectParam : '/admin');
          }, 800);
        } else {
          dbStore.logAction('Google Player Authentication', 'Auth', res.user.uid);
          setRedirectingMessage(`Welcome back, ${savedUser.game_name}! Routing to Player Arena...`);
          setTimeout(() => {
            navigate(redirectParam && !redirectParam.startsWith('/admin') ? redirectParam : '/dashboard');
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to sign in with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMsg(null);

  if (roleSelect === 'admin') {
    if (!adminSecretKey) {
      setErrorMsg('Admin Secret Unique ID is required to sign in as Admin.');
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
    const data = await signInWithEmail(email, password);

    if (!data?.user) {
      setErrorMsg('Login failed. Please check your email and password.');
      return;
    }

    if (roleSelect === 'admin') {
      dbStore.setCurrentUserRole('admin');

      dbStore.logAction('Admin Login', 'Auth', data.user.id);

      setRedirectingMessage('Login successful! Directing to Admin Dashboard...');

      setTimeout(() => {
        navigate(
          redirectParam && redirectParam.startsWith('/admin')
            ? redirectParam
            : '/admin'
        );
      }, 700);

    } else {
      const current = dbStore.getCurrentUser();

      current.id = data.user.id;
      current.email = data.user.email || email;
      current.role = 'player';

      dbStore.setCurrentUser(current);

      setRedirectingMessage(
        'Login successful! Routing to Player Dashboard...'
      );

      setTimeout(() => {
        navigate(
          redirectParam && redirectParam.startsWith('/admin')
            ? redirectParam
            : '/dashboard'
        );
      }, 700);
    }

  } catch (err: any) {
    console.error('Login error:', err);
    setErrorMsg(
      err?.message || 'Login failed. Please check your email and password.'
    );
  }
};
  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black italic uppercase text-white font-mono tracking-wide">
          Arena Sign In
        </h1>
        <p className="text-xs text-gray-400">Access your team dashboard, room IDs, and tournament matches.</p>
      </div>

      <Card glow="orange" className="p-6 space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Continue with Google Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-white/5 disabled:opacity-50 cursor-pointer"
          >
            {isGoogleLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-gray-900" />
                Connecting Google OAuth...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Or Sign In with Email</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1.5">Select Role Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRoleSelect('player');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-xl font-bold uppercase transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  roleSelect === 'player' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-black/60 text-gray-400 hover:text-white'
                }`}
              >
                Player / Captain
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleSelect('admin');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-xl font-bold uppercase transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  roleSelect === 'admin' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-black/60 text-gray-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin / Referee
              </button>
            </div>
          </div>

          {/* Admin Secret Unique ID Field */}
          {roleSelect === 'admin' && (
            <div className="p-3.5 bg-red-950/30 border border-red-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-red-400 font-extrabold text-xs flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Admin Secret Unique ID
                </label>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-mono font-semibold cursor-pointer"
                  title="Click to copy default secret ID"
                >
                  {copiedSecret ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedSecret ? 'Copied Key!' : 'Copy Secret ID'}
                </button>
              </div>

              <input
                type="text"
                required
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                placeholder="Enter Secret ID (e.g. PRIME-ADMIN-8899-KEY)"
                className="w-full bg-black/80 border border-red-500/40 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />

              <p className="text-[11px] text-gray-400 leading-tight">
                Secret Unique ID: <code className="text-orange-300 font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded">{defaultAdminSecret}</code>
              </p>
            </div>
          )}

          <div>
            <label className="block text-gray-300 font-bold mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="player@esports.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <Link to="/forgot-password" className="text-orange-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button variant="primary" size="lg" glow type="submit" className="w-full">
            SIGN IN TO ARENA <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-gray-800/80 text-[11px] text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-orange-400 font-bold hover:underline">
            Register Account
          </Link>
        </div>
      </Card>

      {/* Redirecting Overlay */}
      {redirectingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#161722] border border-orange-500/40 rounded-2xl p-6 max-w-sm w-full text-center space-y-3 shadow-2xl animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-400 flex items-center justify-center">
              <Compass className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white">Authenticating...</h3>
            <p className="text-xs text-orange-300 font-medium">{redirectingMessage}</p>
            <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/10">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
