import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: Array<'console' | 'admin' | 'user' | 'support'>;
  redirectTo?: string;
}

/**
 * A wrapper around routes that checks if user has required role
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  requiredRoles,
  redirectTo = '/login'
}) => {
  const { user, hasRole, loading } = useAuth();
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
  
  // Check if user has at least one of the required roles
  const hasRequiredRole = requiredRoles.some(role => hasRole(role));
  
  if (!hasRequiredRole) {
    // User doesn't have required role, redirect to dashboard or homepage
    return <Navigate to="/" replace />;
  }
  
  // User has required role, render the protected route
  return <>{children}</>;
};

export default RoleGuard;
