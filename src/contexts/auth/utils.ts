
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthUser, Profile } from './types';

// Helper function to fetch user roles from the database
export const fetchUserRoles = async (userId: string) => {
  try {
    const { data: roles, error } = await supabase
      .from('user_roles')
      .select('role, store_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }

    return roles.map(r => r.role);
  } catch (error) {
    console.error('Error in fetchUserRoles:', error);
    return [];
  }
};

// Helper function to fetch user profile from the database
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
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
export const createAuthUser = async (supabaseUser: User): Promise<AuthUser | null> => {
  try {
    const roles = await fetchUserRoles(supabaseUser.id);
    const profile = await fetchUserProfile(supabaseUser.id);
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      roles,
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
