import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Check,
  Compass,
  Sparkles,
} from 'lucide-react';

import { dbStore } from '../services/dbStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const DEMO_SESSION_KEY = 'prime_verse_demo_session';
const DEMO_ROLE_KEY = 'prime_verse_demo_role';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const redirectParam =
    queryParams.get('redirect') || location.state?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [roleSelect, setRoleSelect] = useState<'player' | 'admin'>(
    queryParams.get('role') === 'admin' ? 'admin' : 'player'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [redirectingMessage, setRedirectingMessage] =
    useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [demoStarted, setDemoStarted] = useState(false);

  const handleDemoLogin = (role: 'player' | 'admin') => {
    setErrorMsg(null);
    setIsLoading(true);
    setRoleSelect(role);

    // Demo-only session.
    // No real authentication or personal data is stored.
    sessionStorage.setItem(DEMO_SESSION_KEY, 'true');
    sessionStorage.setItem(DEMO_ROLE_KEY, role);

    // Keep the existing local demo user system working.
    try {
      const current = dbStore.getCurrentUser();

      current.id =
        role === 'admin'
          ? 'demo-admin-user'
          : 'demo-player-user';

      current.email =
        email.trim() || 'demo@primeverse.example';

      current.role = role;

      if (role === 'player') {
        current.username = 'DemoPlayer';
        current.game_name = 'DEMOxPLAYER';
        current.bgmi_id = 'DEMO-PLAYER';
      } else {
        current.username = 'DemoAdmin';
        current.game_name = 'DEMOxADMIN';
        current.bgmi_id = 'DEMO-ADMIN';
      }

      dbStore.setCurrentUser(current);
    } catch (error) {
      console.warn('Demo user setup skipped:', error);
    }

    setTimeout(() => {
      setIsLoading(false);
      setDemoStarted(true);

      if (role === 'admin') {
        setRedirectingMessage(
          'Demo Admin Mode activated. Opening Admin Dashboard...'
        );
      } else {
        setRedirectingMessage(
          'Demo Player Mode activated. Opening Player Dashboard...'
        );
      }

      setTimeout(() => {
        const destination =
          role === 'admin'
            ? redirectParam &&
              redirectParam.startsWith('/admin')
              ? redirectParam
              : '/admin'
            : redirectParam &&
              !redirectParam.startsWith('/admin')
            ? redirectParam
            : '/dashboard';

        navigate(destination);
      }, 900);
    }, 500);
  };

  const handleEmailDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);

    /*
      This is a portfolio demonstration.

      The email and password fields are UI-only.
      They are NOT sent to Supabase/Firebase.
      No account is created.
      No personal information is stored.
    */

    handleDemoLogin(roleSelect);
  };

  const handleGoogleDemoLogin = () => {
    setErrorMsg(null);

    /*
      Google login is also presentation-only in this demo.
      No Google account is accessed.
    */

    handleDemoLogin(roleSelect);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">

      {/* Page Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          Portfolio Demo
        </div>

        <h1 className="text-3xl font-black italic uppercase text-white font-mono tracking-wide">
          Arena Sign In
        </h1>

        <p className="text-xs text-gray-400">
          Explore the player dashboard, tournaments, matches and
          admin interface.
        </p>
      </div>

      <Card glow="orange" className="p-6 space-y-5">

        {/* DEMO NOTICE */}
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-orange-400">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-extrabold uppercase tracking-wide text-orange-300">
                Demo Version
              </p>

              <p className="text-[11px] leading-relaxed text-gray-300">
                This website is a portfolio demonstration.
                Login is simulated for presentation purposes.
                <strong className="text-white">
                  {' '}
                  No real account, password, or personal data is
                  stored.
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Google Demo Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-white/5 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-gray-900 animate-spin" />
                Opening Demo...
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

                Continue with Google
              </>
            )}
          </button>

          <p className="text-center text-[9px] text-gray-600 mt-2 uppercase tracking-wider">
            Demo interaction only
          </p>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-800" />

          <span className="flex-shrink mx-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Or Continue with Demo
          </span>

          <div className="flex-grow border-t border-gray-800" />
        </div>

        <form
          onSubmit={handleEmailDemoLogin}
          className="space-y-4 text-xs"
        >

          {/* Role */}
          <div>
            <label className="block text-gray-300 font-bold mb-1.5">
              Select Demo Mode
            </label>

            <div className="grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() => {
                  setRoleSelect('player');
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-3 rounded-xl font-bold uppercase transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  roleSelect === 'player'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-black/60 text-gray-400 hover:text-white'
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
                className={`py-2.5 px-3 rounded-xl font-bold uppercase transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  roleSelect === 'admin'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-black/60 text-gray-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin / Referee
              </button>

            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 font-bold mb-1">
              Demo Email
            </label>

            <input
              type="email"
              placeholder="demo@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-orange-500 focus:outline-none"
            />

            <p className="text-[9px] text-gray-600 mt-1">
              Optional — used only for the visual demo.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 font-bold mb-1">
              Demo Password
            </label>

            <input
              type="password"
              placeholder="Any password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2.5 text-white focus:border-orange-500 focus:outline-none"
            />

            <p className="text-[9px] text-gray-600 mt-1">
              No password is validated or stored.
            </p>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-between items-center text-[11px]">
            <Link
              to="/forgot-password"
              className="text-orange-400 hover:underline"
            >
              Forgot Password?
            </Link>

            <span className="text-gray-600">
              Demo Environment
            </span>
          </div>

          {/* Submit */}
          <Button
            variant="primary"
            size="lg"
            glow
            type="submit"
            className="w-full"
          >
            {roleSelect === 'admin'
              ? 'ENTER ADMIN DEMO'
              : 'ENTER PLAYER DEMO'}

            <ArrowRight className="w-4 h-4" />
          </Button>

        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-gray-800/80 text-[11px] text-gray-400">
          Want to explore the site?

          <Link
            to="/"
            className="text-orange-400 font-bold hover:underline ml-1"
          >
            Return Home
          </Link>
        </div>

      </Card>

      {/* Redirecting Overlay */}
      {redirectingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">

          <div className="bg-[#161722] border border-orange-500/40 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">

            <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-400 flex items-center justify-center">
              <Compass className="w-6 h-6 animate-spin" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">
                Demo Mode Activated
              </h3>

              <p className="text-xs text-orange-300 font-medium mt-1">
                {redirectingMessage}
              </p>
            </div>

            <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/10">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full animate-pulse w-full" />
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
              <Check className="w-3 h-3 text-emerald-400" />
              No real data stored
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Login;
