
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import { cleanupAuthState } from '@/utils/auth';
import AuthContext from './AuthContext';
import { createAuthUser } from './utils';
import { AuthUser, UserRole } from './types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Set up auth state change listener
  useEffect(() => {
    setLoading(true);
    
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent blocking the auth state change handler
          setTimeout(async () => {
            const authUser = await createAuthUser(currentSession.user);
            setUser(authUser);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const authUser = await createAuthUser(currentSession.user);
        setUser(authUser);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // First clean up any existing auth state
      cleanupAuthState();
      
      // Attempt global sign out in case there's an existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Global sign out failed, continuing with login');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Auth state listener will handle updating the user state
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      
      // Auth state listener will handle updating the user state
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // First clean up auth state
      cleanupAuthState();
      
      // Then attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // Force page reload for a clean state
      window.location.href = '/login';
      
      // Auth state listener will handle updating the user state
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    hasRole,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
