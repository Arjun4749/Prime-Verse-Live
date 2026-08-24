import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const DEMO_SESSION_KEY = 'prime_verse_demo_session';

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  const isDemoAuthenticated =
    sessionStorage.getItem(DEMO_SESSION_KEY) === 'true';

  if (!isDemoAuthenticated) {
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
