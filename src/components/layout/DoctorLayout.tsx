
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  ClipboardList, 
  Home, 
  LogOut, 
  Settings, 
  UserRound, 
  Menu, 
  X, 
  MessageCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Doctor } from "@/types";

interface DoctorLayoutProps {
  children: ReactNode;
}

const DoctorLayout = ({ children }: DoctorLayoutProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const NavItems = () => (
    <>
      <Button
        variant="ghost" 
        className="w-full justify-start"
        onClick={() => {
          navigate('/doctor/dashboard');
          closeMobileMenu();
        }}
      >
        <Home className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      
      <Button
        variant="ghost" 
        className="w-full justify-start"
        onClick={() => {
          navigate('/doctor/applications');
          closeMobileMenu();
        }}
      >
        <ClipboardList className="mr-2 h-4 w-4" />
        Checkup Applications
      </Button>
      
      <Button
        variant="ghost" 
        className="w-full justify-start"
        onClick={() => {
          navigate('/doctor/appointments');
          closeMobileMenu();
        }}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Appointments
      </Button>
      
      <Button
        variant="ghost" 
        className="w-full justify-start"
        onClick={() => {
          navigate('/doctor/chats');
          closeMobileMenu();
        }}
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Patient Chats
      </Button>
      
      <Button
        variant="ghost" 
        className="w-full justify-start"
        onClick={() => {
          navigate('/doctor/profile');
          closeMobileMenu();
        }}
      >
        <UserRound className="mr-2 h-4 w-4" />
        My Profile
      </Button>
      
      <Button
        variant="ghost" 
        className="w-full justify-start"
        onClick={() => {
          navigate('/doctor/settings');
          closeMobileMenu();
        }}
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - desktop */}
      <div className="w-64 bg-white p-4 border-r hidden md:flex flex-col">
        <div className="py-4 px-2 flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
            <AvatarFallback>
              {doctor?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-primary">Doctor Portal</h2>
            <p className="text-sm text-muted-foreground">{doctor?.specialization || 'Specialist'}</p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-1">
          <NavItems />
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
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
              <AvatarFallback>
                {doctor?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-primary">Doctor Portal</h2>
          </div>
          
          {/* Mobile menu button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-6 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                      <AvatarFallback>
                        {doctor?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'DR'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{doctor?.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{doctor?.specialization}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <NavItems />
                <div className="mt-8">
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
            </SheetContent>
          </Sheet>
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
