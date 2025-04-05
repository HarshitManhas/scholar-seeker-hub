import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';
import { ProfileData, convertFormDataToSupabaseProfile, convertSupabaseProfileToFormData } from '@/utils/profileAdapter';
import { toast } from '@/components/ui/use-toast';

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  hasProfile: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: ProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  hasProfile: false,
  isLoading: true,
  login: async () => {},
  signUp: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

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

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          const userProfile = await fetchProfile(initialSession.user.id);
          setProfile(userProfile);
          setHasProfile(!!userProfile);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          if (currentSession.user) {
            const userProfile = await fetchProfile(currentSession.user.id);
            setProfile(userProfile);
            setHasProfile(!!userProfile);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setHasProfile(false);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        console.error("Login error details:", error);
        throw error;
      }

      if (data.user) {
        const userProfile = await fetchProfile(data.user.id);
        setProfile(userProfile);
        setHasProfile(!!userProfile);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

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

      if (data.user) {
        const initialProfileData: ProfileData = {
          name,
          dateOfBirth: undefined,
          gender: '',
          category: '',
          email,
          phone: '',
          educationLevel: '',
          course: '',
          board: '',
          yearOfStudy: '',
          marks: '',
          familyIncome: '',
          parentsOccupation: '',
          state: '',
          district: '',
          pincode: '',
          isDisabled: false,
          isOrphan: false,
          hasSingleParent: false
        };
        
        await updateProfile(initialProfileData);
      }

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account."
      });
      
      toast({
        title: "Important",
        description: "You may need to confirm your email before logging in, or disable email confirmation in Supabase dashboard.",
        duration: 8000
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      setHasProfile(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: ProfileData) => {
    if (!user) return;

    try {
      const supabaseProfileData = convertFormDataToSupabaseProfile(profileData, user.id);
      
      const { error } = await supabase
        .from('profiles')
        .upsert(supabaseProfileData);
      
      if (error) throw error;
      
      const userProfile = await fetchProfile(user.id);
      setProfile(userProfile);
      setHasProfile(!!userProfile);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    hasProfile: hasProfile,
    isLoading,
    login,
    signUp,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
