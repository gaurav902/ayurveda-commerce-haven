
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDashboardSidebar from "@/components/dashboard/UserDashboardSidebar";
import ChatSection from "@/components/checkup/ChatSection";
import CheckupApplicationList from "@/components/checkup/CheckupApplicationList";
import { toast } from "sonner";
import { CheckupApplication } from "@/types";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const UserCheckups = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<CheckupApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | undefined>();

  useEffect(() => {
    fetchUserApplications();
  }, [user]);

  const fetchUserApplications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checkup_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Type assertion to ensure the data is cast to CheckupApplication[]
      const typedData = data as unknown as CheckupApplication[];
      setApplications(typedData);
      
      // Select the first application by default if available
      if (typedData.length > 0 && !selectedApplicationId) {
        setSelectedApplicationId(typedData[0].id);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load your checkup applications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <UserDashboardSidebar />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">My Checkups</h1>
              <Link to="/checkup/apply">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Checkup
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <CheckupApplicationList
                  applications={applications}
                  onSelectApplication={setSelectedApplicationId}
                  selectedApplicationId={selectedApplicationId}
                />
                
                <ChatSection applicationId={selectedApplicationId} />
              </div>
            )}
            
            {applications.length > 0 && selectedApplicationId && (
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Checkup Details</CardTitle>
                    <CardDescription>View the details of your selected checkup application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Display application details and kit recommendation if available */}
                    {applications.find(app => app.id === selectedApplicationId)?.status === 'completed' && (
                      <>
                        <h3 className="text-lg font-medium mb-2">Recommended Kit</h3>
                        {/* Kit recommendations would be displayed here */}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserCheckups;
