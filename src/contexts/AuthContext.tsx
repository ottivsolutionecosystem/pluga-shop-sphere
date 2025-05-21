
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'console' | 'admin' | 'user' | 'support' | null;

interface User {
  id: string;
  email: string;
  roles: UserRole[];
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

// Mock user data for development
const mockUsers = [
  {
    id: '1',
    email: 'console@plugashop.com',
    password: 'password',
    roles: ['console'] as UserRole[],
    name: 'Console Admin'
  },
  {
    id: '2',
    email: 'admin@loja.com',
    password: 'password',
    roles: ['admin'] as UserRole[],
    name: 'Loja Admin'
  },
  {
    id: '3',
    email: 'user@example.com',
    password: 'password',
    roles: ['user'] as UserRole[],
    name: 'Cliente'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('plugashop_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This would be replaced with actual Supabase auth
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage - this would be handled by Supabase auth in production
      localStorage.setItem('plugashop_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('plugashop_user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole
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
