
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ClipboardList, Home, LogOut, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/types";

interface DoctorLayoutProps {
  children: ReactNode;
}

const DoctorLayout = ({ children }: DoctorLayoutProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const checkDoctorStatus = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          toast.error("Please login to access doctor features");
          navigate("/doctor/login");
          return;
        }
        
        // Using the correct type casting for the database query
        const { data: doctorData, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', session.session.user.id)
          .single();
          
        if (error || !doctorData) {
          toast.error("You don't have doctor privileges");
          navigate("/");
          return;
        }
        
        if (doctorData.status === 'pending') {
          toast.error("Your doctor account is pending approval");
          navigate("/");
          return;
        }
        
        setDoctor(doctorData as Doctor);
      } catch (error) {
        console.error("Error checking doctor status:", error);
        navigate("/doctor/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDoctorStatus();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/doctor/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r hidden md:block">
        <div className="py-4 px-2">
          <h2 className="text-2xl font-bold text-primary">Doctor Portal</h2>
          <p className="text-sm text-muted-foreground mt-1">Skin & Hair Specialist</p>
        </div>
        
        <div className="mt-6 flex flex-col gap-1">
          <Button
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/doctor/dashboard')}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/doctor/applications')}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Checkup Applications
          </Button>
          
          <Button
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/doctor/appointments')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Appointments
          </Button>
          
          <Button
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/doctor/profile')}
          >
            <UserRound className="mr-2 h-4 w-4" />
            My Profile
          </Button>
          
          <Button
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => navigate('/doctor/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
        
        <div className="mt-auto pt-6">
          <Button
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Doctor Portal</h2>
          {/* Mobile menu button */}
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 md:ml-64 md:pl-0 pt-16 md:pt-0">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default DoctorLayout;
