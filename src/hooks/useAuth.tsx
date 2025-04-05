
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface ProfileData {
  // Personal Details
  name: string;
  dateOfBirth: Date | undefined;
  gender: string;
  category: string;
  email: string;
  phone: string;
  
  // Academic Details
  educationLevel: string;
  course: string;
  board: string;
  yearOfStudy: string;
  marks: string;
  
  // Financial Details
  familyIncome: string;
  parentsOccupation: string;
  
  // Location
  state: string;
  district: string;
  pincode: string;
  
  // Special Categories
  isDisabled: boolean;
  isOrphan: boolean;
  hasSingleParent: boolean;
}

interface User {
  email: string;
  isLoggedIn: boolean;
  profile?: ProfileData;
  id?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: ProfileData) => Promise<void>;
  hasProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize the auth state
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      }
      
      // Set up auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || '');
        } else {
          setUser(null);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);
  
  // Fetch user profile data from database
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      let userData: ProfileData | undefined;
      
      if (data) {
        userData = {
          name: data.name || '',
          dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
          gender: data.gender || '',
          category: data.category || '',
          email: email,
          phone: data.phone || '',
          educationLevel: data.education_level || '',
          course: data.course || '',
          board: data.board || '',
          yearOfStudy: data.year_of_study || '',
          marks: data.marks || '',
          familyIncome: data.family_income || '',
          parentsOccupation: data.parents_occupation || '',
          state: data.state || '',
          district: data.district || '',
          pincode: data.pincode || '',
          isDisabled: data.is_disabled || false,
          isOrphan: data.is_orphan || false,
          hasSingleParent: data.has_single_parent || false
        };
      }
      
      setUser({
        email,
        isLoggedIn: true,
        id: userId,
        profile: userData
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser({
        email,
        isLoggedIn: true,
        id: userId
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Successfully logged in');
    } catch (error: any) {
      toast.error(error.message || 'Failed to log in');
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Registration successful! Check your email for confirmation.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const updateProfile = async (profileData: ProfileData) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          date_of_birth: profileData.dateOfBirth,
          gender: profileData.gender,
          category: profileData.category,
          email: profileData.email,
          phone: profileData.phone,
          education_level: profileData.educationLevel,
          course: profileData.course,
          board: profileData.board,
          year_of_study: profileData.yearOfStudy,
          marks: profileData.marks,
          family_income: profileData.familyIncome,
          parents_occupation: profileData.parentsOccupation,
          state: profileData.state,
          district: profileData.district,
          pincode: profileData.pincode,
          is_disabled: profileData.isDisabled,
          is_orphan: profileData.isOrphan,
          has_single_parent: profileData.hasSingleParent
        }, { 
          onConflict: 'id' 
        });
      
      if (error) {
        throw error;
      }
      
      setUser({
        ...user,
        profile: profileData
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasProfile: !!(user?.profile),
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
