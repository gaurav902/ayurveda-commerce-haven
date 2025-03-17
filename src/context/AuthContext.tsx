
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Profile } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          // Get user profile
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
            setProfile(null);
            setIsAdmin(false);
          } else {
            // Add the email from auth.user to the profile
            const profileWithEmail = {
              ...profileData,
              email: data.session.user.email
            } as Profile;
            
            setProfile(profileWithEmail);
            
            // Check if user is an admin using the admin_users table
            const { data: adminData, error: adminError } = await supabase
              .from('admin_users')
              .select('*')
              .eq('id', data.session.user.id)
              .single();
              
            if (!adminError && adminData) {
              setIsAdmin(true);
            } else {
              // Fallback to checking is_admin in profiles table
              setIsAdmin(profileData?.is_admin || false);
            }
          }
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error in getSession:", error);
        setProfile(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        try {
          // Get user profile
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching profile:", error);
            setProfile(null);
            setIsAdmin(false);
          } else {
            // Add the email from auth.user to the profile
            const profileWithEmail = {
              ...profileData,
              email: session.user.email
            } as Profile;
            
            setProfile(profileWithEmail);
            
            // Check if user is an admin using the admin_users table
            const { data: adminData, error: adminError } = await supabase
              .from('admin_users')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (!adminError && adminData) {
              setIsAdmin(true);
            } else {
              // Fallback to checking is_admin in profiles table
              setIsAdmin(profileData?.is_admin || false);
            }
          }
        } catch (error) {
          console.error("Error in onAuthStateChange:", error);
          setProfile(null);
          setIsAdmin(false);
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success("Logged in successfully!");
      
      // If logging in as admin@tellmeindia.com, ensure the user is in admin_users table
      if (email === "admin@tellmeindia.com") {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // Check if user exists in admin_users table
          const { data: adminData, error: adminCheckError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', userData.user.id)
            .single();
            
          if (adminCheckError) {
            // Insert into admin_users if not already there
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert([{ id: userData.user.id, email: email }]);
              
            if (insertError) {
              console.error("Error adding admin user:", insertError);
            }
            
            // Update profiles to set is_admin flag
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ is_admin: true })
              .eq('id', userData.user.id);
              
            if (updateError) {
              console.error("Error updating admin status:", updateError);
            }
          }
        }
      }
      
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success("Account created successfully!");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setIsAdmin(false);
      toast.info("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return { error: "No user logged in" };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        toast.error(`Error updating profile: ${error.message}`);
        return { error };
      }

      // Add email to the returned profile data
      const updatedProfile = {
        ...data,
        email: user.email
      } as Profile;
      
      setProfile(updatedProfile);
      toast.success("Profile updated successfully!");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || "Profile update failed");
      return { error };
    }
  };

  const value = {
    session,
    user,
    profile,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
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
