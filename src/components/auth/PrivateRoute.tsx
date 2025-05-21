
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * A wrapper around routes that redirects to login page if user is not authenticated
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // If still loading auth state, render nothing
  if (loading) {
    return null;
  }
  
  // If not logged in, redirect to login with return path
  if (!user) {
    const loginRedirect = redirectTo.includes('?') 
      ? `${redirectTo}&returnTo=${location.pathname}`
      : `${redirectTo}?returnTo=${location.pathname}`;
    
    return <Navigate to={loginRedirect} replace />;
  }
  
  // User is logged in, render the protected route
  return <>{children}</>;
};

export default PrivateRoute;
