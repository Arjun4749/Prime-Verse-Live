import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/workspaceAuth';
import { getCurrentSupabaseUser } from '../../lib/supabaseAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A route is authenticated when either supported auth provider
 * has an active session:
 * - Supabase: email/password
 * - Firebase: Google OAuth
 *
 * The local dbStore is NOT used as proof of authentication.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    let firebaseResolved = false;
    let firebaseUser: unknown = null;
    let supabaseUser: unknown = null;

    const finishCheck = () => {
      if (!mounted || !firebaseResolved) return;

      const isAuthenticated = Boolean(firebaseUser || supabaseUser);
      setAuthenticated(isAuthenticated);
      setChecking(false);
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      firebaseUser = user;
      firebaseResolved = true;

      try {
        supabaseUser = await getCurrentSupabaseUser();
      } catch (error) {
        console.error('Supabase auth check failed:', error);
        supabaseUser = null;
      }

      finishCheck();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-[#D4FF33]/30 border-t-[#D4FF33] animate-spin" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    const redirect = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }

  return <>{children}</>;
};
