
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'console' | 'admin' | 'user' | 'support' | null;

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  roles: UserRole[];
  name: string;
  profile?: Profile;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  session: Session | null;
}
