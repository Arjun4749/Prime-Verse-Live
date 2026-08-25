import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuickLoginCardProps {
  className?: string;
  compact?: boolean;
}

const DEMO_SESSION_KEY = 'prime_verse_demo_session';

export const QuickLoginCard: React.FC<QuickLoginCardProps> = ({
  className = '',
  compact = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('demo@bgmiarena.in');
  const [password, setPassword] = useState('demo1234');
  const [roleSelect, setRoleSelect] = useState<'player' | 'admin'>('player');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /*
   * ============================================================
   * DEMO LOGIN
   * ============================================================
   *
   * This portfolio website does NOT use real authentication here.
   *
   * No Google account is accessed.
   * No password is sent to a server.
   * No personal information is collected.
   * No Supabase authentication is performed.
   *
   * The session exists only in the visitor's browser sessionStorage.
   */

  const handleDemoLogin = async (
    event?: React.FormEvent
  ) => {
    event?.preventDefault();

    setMessage(null);
    setLoading(true);

    /*
     * Small delay so the interaction feels like a real login.
     * This does NOT communicate with a server.
     */
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create a temporary demo session.
    sessionStorage.setItem(DEMO_SESSION_KEY, 'true');

    // Store ONLY the demo role, not personal information.
    sessionStorage.setItem(
      'prime_verse_demo_role',
      roleSelect
    );

    setMessage(
      roleSelect === 'admin'
        ? 'Demo Admin access granted. Opening Command Center...'
        : 'Demo Player access granted. Opening Arena Dashboard...'
    );

    setLoading(false);

    /*
     * If another protected page originally redirected the visitor
     * here, send them back there.
     */
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');

    const destination =
      redirect ||
      (roleSelect === 'admin' ? '/admin' : '/dashboard');

    setTimeout(() => {
      navigate(destination, { replace: true });
    }, 600);
  };

  /*
   * Google button is intentionally DEMO ONLY.
   * It does not open Google and does not collect a Google account.
   */
  const handleGoogleDemo = async () => {
    setMessage(null);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    sessionStorage.setItem(DEMO_SESSION_KEY, 'true');
    sessionStorage.setItem(
      'prime_verse_demo_role',
      roleSelect
    );

    setMessage(
      'Google Login Preview successful. No Google account was accessed.'
    );

    setLoading(false);

    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');

    const destination =
      redirect ||
      (roleSelect === 'admin' ? '/admin' : '/dashboard');

    setTimeout(() => {
      navigate(destination, { replace: true });
    }, 700);
  };

  return (
    <Card
      glow="orange"
      className={`
        p-5 sm:p-6
        space-y-4
        bg-[#11131f]
        border-orange-500/30
        ${className}
      `}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>

          <div>
            <h3 className="text-sm font-black italic uppercase text-white font-mono tracking-wide">
              Arena Demo
            </h3>

            <p className="text-[10px] text-gray-400">
              Interactive Preview of Custom Rooms & Tournaments
            </p>
          </div>
        </div>

        {/* DEMO BADGE */}
        <span className="px-2 py-0.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[10px] font-mono font-bold">
          DEMO MODE
        </span>
      </div>

      {/* =====================================================
          DEMO NOTICE
      ====================================================== */}

      <div className="p-2.5 bg-lime-400/5 border border-lime-400/20 rounded-xl">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />

          <div>
            <p className="text-[10px] text-lime-300 font-bold font-mono">
              PORTFOLIO DEMO
            </p>

            <p className="text-[9px] text-gray-400 leading-relaxed mt-0.5">
              Authentication is simulated for demonstration.
              No personal data, passwords, or Google accounts
              are collected or stored.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          GOOGLE DEMO LOGIN
      ====================================================== */}

      <button
        type="button"
        onClick={handleGoogleDemo}
        disabled={loading}
        className="
          w-full
          py-2.5
          px-3
          bg-white
          hover:bg-gray-100
          text-gray-900
          font-bold
          text-xs
          rounded-xl
          transition-all
          flex
          items-center
          justify-center
          gap-2.5
          shadow-md
          shadow-white/5
          disabled:opacity-50
          cursor-pointer
          font-mono
        "
      >
        {loading ? (
          <span>Opening Demo...</span>
        ) : (
          <>
            {/* Google-style icon for visual presentation only */}
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

            <span>Try Google Login Demo</span>
          </>
        )}
      </button>

      {/* =====================================================
          DIVIDER
      ====================================================== */}

      <div className="relative flex py-0.5 items-center">
        <div className="flex-grow border-t border-gray-800" />

        <span className="flex-shrink mx-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest font-mono">
          Demo Credentials
        </span>

        <div className="flex-grow border-t border-gray-800" />
      </div>

      {/* =====================================================
          LOGIN FORM
      ====================================================== */}

      <form
        onSubmit={handleDemoLogin}
        className="space-y-3 text-xs font-mono"
      >
        {/* ROLE SELECT */}

        <div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setRoleSelect('player');
                setMessage(null);
              }}
              className={`
                py-1.5
                px-2
                rounded-lg
                font-bold
                uppercase
                transition-all
                text-[10px]
                flex
                items-center
                justify-center
                gap-1
                cursor-pointer
                ${
                  roleSelect === 'player'
                    ? 'bg-orange-500 text-white shadow'
                    : 'bg-black/60 text-gray-400 hover:text-white'
                }
              `}
            >
              Player Mode
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleSelect('admin');
                setMessage(null);
              }}
              className={`
                py-1.5
                px-2
                rounded-lg
                font-bold
                uppercase
                transition-all
                text-[10px]
                flex
                items-center
                justify-center
                gap-1
                cursor-pointer
                ${
                  roleSelect === 'admin'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-black/60 text-gray-400 hover:text-white'
                }
              `}
            >
              <ShieldCheck className="w-3 h-3" />
              Admin Mode
            </button>
          </div>
        </div>

        {/* EMAIL */}

        <div>
          <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
            Demo Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@bgmiarena.in"
            className="
              w-full
              bg-black/80
              border
              border-gray-800
              rounded-lg
              px-2.5
              py-1.5
              text-white
              text-xs
              focus:border-orange-500
              focus:outline-none
            "
          />
        </div>

        {/* PASSWORD */}

        <div>
          <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
            Demo Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="demo1234"
            className="
              w-full
              bg-black/80
              border
              border-gray-800
              rounded-lg
              px-2.5
              py-1.5
              text-white
              text-xs
              focus:border-orange-500
              focus:outline-none
            "
          />
        </div>

        {/* LOGIN BUTTON */}

        <Button
          variant="primary"
          size="md"
          glow
          type="submit"
          disabled={loading}
          className="w-full text-xs"
        >
          {loading ? 'OPENING DEMO...' : 'ENTER DEMO ARENA'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </form>

      {/* =====================================================
          DEMO MESSAGE
      ====================================================== */}

      {message && (
        <div className="
          p-2.5
          bg-emerald-950/60
          border
          border-emerald-500/40
          rounded-xl
          text-emerald-300
          text-[10px]
          font-mono
          flex
          items-start
          gap-2
        ">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />

          <span>{message}</span>
        </div>
      )}

      {/* =====================================================
          FOOTER NOTE
      ====================================================== */}

      <div className="pt-2 border-t border-gray-800/80 text-center">
        <p className="text-[9px] text-gray-500 font-mono leading-relaxed">
          Portfolio demonstration only
          <br />
          No real authentication or personal data storage.
        </p>

        <Link
          to="/login"
          className="inline-block mt-2 text-[9px] text-orange-400 hover:text-orange-300 hover:underline font-mono"
        >
          Open Full Demo Login
        </Link>
      </div>
    </Card>
  );
};
