
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DoctorLayout from "@/components/layout/DoctorLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ExternalLink, FileText } from "lucide-react";
import { CheckupApplication } from "@/types";
import ChatSection from "@/components/checkup/ChatSection"; 
import CheckupApplicationList from "@/components/checkup/CheckupApplicationList";

const DoctorApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<CheckupApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<CheckupApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | undefined>();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === activeTab));
    }
  }, [activeTab, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checkup_applications')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Type assertion to ensure the data is cast to CheckupApplication[]
      const typedData = data as unknown as CheckupApplication[];
      setApplications(typedData);
      setFilteredApplications(typedData);
      
      // Select the first application by default if available
      if (typedData.length > 0 && !selectedApplicationId) {
        setSelectedApplicationId(typedData[0].id);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load checkup applications");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (id: string) => {
    navigate(`/doctor/recommend-kit/${id}`);
  };

  return (
    <DoctorLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkup Applications</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CheckupApplicationList
              applications={filteredApplications}
              onSelectApplication={setSelectedApplicationId}
              selectedApplicationId={selectedApplicationId}
              doctorView={true}
            />
            
            <ChatSection applicationId={selectedApplicationId} doctorView={true} />
            
            {selectedApplicationId && (
              <div className="xl:col-span-2 flex justify-end mt-4">
                <Button 
                  onClick={() => handleViewApplication(selectedApplicationId)}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Full Application & Recommend Kit
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorApplications;
