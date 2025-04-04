
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface ProfileData {
  // Personal Details
  name: string;
  dateOfBirth: string | undefined;
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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (profileData: ProfileData) => void;
  hasProfile: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (profileData: ProfileData) => {
    if (user) {
      const updatedUser = {
        ...user,
        profile: profileData
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasProfile: !!(user?.profile),
        login,
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
