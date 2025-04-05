
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Profile } from '@/types/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasProfile: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's profile from the database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  };

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        // Get session from supabase
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch the user's profile
          const userProfile = await fetchProfile(initialSession.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Fetch the user's profile when auth state changes
          if (currentSession.user) {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Clean up the subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Handle user login
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Fetch user profile after login
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Handle user registration
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        throw error;
      }

      // Create a profile for the new user
      if (data.user) {
        // Profile should be created by our database trigger,
        // but we can update it with additional info
        await updateProfile({ name });
      }

      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  // Handle user logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update the user's profile
  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) {
      throw new Error('User must be logged in to update profile');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refetch the profile to get the updated data
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    isLoading,
    hasProfile: !!profile,
    login,
    signUp,
    logout,
    updateProfile,
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
