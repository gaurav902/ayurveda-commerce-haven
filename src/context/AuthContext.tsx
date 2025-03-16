
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { signIn, signUp, getCurrentUser } from "@/lib/auth/auth";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const currentUser = await getCurrentUser(token);
          if (currentUser) {
            setUser(currentUser);
            setProfile(currentUser);
            setIsAdmin(currentUser.is_admin);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('auth_token');
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          localStorage.removeItem('auth_token');
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
      }
      
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { user, token } = await signIn(email, password);
      
      // Save token to localStorage
      localStorage.setItem('auth_token', token);
      
      setUser(user);
      setProfile(user);
      setIsAdmin(user.is_admin);
      
      toast.success("Logged in successfully!");
      return { error: null };
    } catch (error) {
      toast.error(error.message);
      return { error };
    }
  };

  const handleSignUp = async (email: string, password: string, userData: any) => {
    try {
      const { user, token } = await signUp(email, password, userData);
      
      // Save token to localStorage
      localStorage.setItem('auth_token', token);
      
      setUser(user);
      setProfile(user);
      setIsAdmin(user.is_admin);
      
      toast.success("Account created successfully!");
      return { error: null };
    } catch (error) {
      toast.error(error.message);
      return { error };
    }
  };

  const handleSignOut = async () => {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    
    toast.info("Logged out successfully");
  };

  const handleUpdateProfile = async (profileData: Partial<User>) => {
    try {
      // Implementation of update profile will be in API
      // This is a placeholder for now
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      toast.success("Profile updated successfully!");
      return { error: null };
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    isAdmin,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
