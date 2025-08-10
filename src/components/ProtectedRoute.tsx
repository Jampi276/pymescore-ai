import React from 'react';
import { Navigate } from 'react-router-dom';
import { sessionManager } from '@/lib/session';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = sessionManager.isLoggedIn();
  
  if (!isLoggedIn) {
    // Redirigir a login si no hay sesión activa
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};