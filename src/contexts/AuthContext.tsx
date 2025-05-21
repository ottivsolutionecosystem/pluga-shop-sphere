
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from "lucide-react";

type UserRole = 'console' | 'admin' | 'user' | 'support' | null;

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
}

interface AuthUser {
  id: string;
  email: string;
  roles: UserRole[];
  name: string;
  profile?: Profile;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to fetch user roles from the database
  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role, store_id')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return roles.map(r => r.role) as UserRole[];
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      return [];
    }
  };

  // Helper function to fetch user profile from the database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Helper to create AuthUser object from Supabase User and additional data
  const createAuthUser = async (supabaseUser: User): Promise<AuthUser | null> => {
    try {
      const roles = await fetchUserRoles(supabaseUser.id);
      const profile = await fetchUserProfile(supabaseUser.id);
      
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        roles: roles,
        name: profile?.first_name 
          ? `${profile.first_name} ${profile.last_name || ''}`
          : supabaseUser.email?.split('@')[0] || 'User',
        profile: profile || undefined
      };
    } catch (error) {
      console.error('Error creating auth user:', error);
      return null;
    }
  };

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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
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
        <Spinner className="h-8 w-8 animate-spin" />
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
