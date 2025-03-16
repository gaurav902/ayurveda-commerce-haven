
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { signIn, signUp, getCurrentUser } from "@/lib/auth/auth";
import { toast } from "sonner";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Set up Supabase auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // If we have a session, get the token and update the user
          const token = localStorage.getItem('auth_token');
          if (token) {
            const currentUser = await getCurrentUser(token);
            if (currentUser) {
              setUser(currentUser);
              setProfile(currentUser);
              setIsAdmin(currentUser.is_admin);
            }
          }
        } else {
          // If no session, clear the user state
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
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
    } catch (error: any) {
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
    } catch (error: any) {
      toast.error(error.message);
      return { error };
    }
  };

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear token from localStorage
      localStorage.removeItem('auth_token');
      
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      
      toast.info("Logged out successfully");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const handleUpdateProfile = async (profileData: Partial<User>) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      toast.success("Profile updated successfully!");
      return { error: null };
    } catch (error: any) {
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
