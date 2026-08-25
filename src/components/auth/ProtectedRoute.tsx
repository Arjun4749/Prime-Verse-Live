import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const DEMO_SESSION_KEY = 'prime_verse_demo_session';
export const DEMO_ROLE_KEY = 'prime_verse_demo_role';

export const isDemoAuthenticated = (): boolean => {
  return localStorage.getItem(DEMO_SESSION_KEY) === 'true';
};

export const getDemoRole = (): 'player' | 'admin' | null => {
  const role = localStorage.getItem(DEMO_ROLE_KEY);

  if (role === 'player' || role === 'admin') {
    return role;
  }

  return null;
};

export const clearDemoSession = (): void => {
  localStorage.removeItem(DEMO_SESSION_KEY);
  localStorage.removeItem(DEMO_ROLE_KEY);
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const location = useLocation();

  const isAuthenticated = isDemoAuthenticated();

  if (!isAuthenticated) {
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

export default ProtectedRoute;
