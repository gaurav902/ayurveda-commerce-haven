
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DoctorLayout from "@/components/layout/DoctorLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckupApplication } from "@/types";
import { Calendar, CheckCircle, Clock, UserRound, Users } from "lucide-react";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<CheckupApplication[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get applications
        const { data, error } = await supabase
          .from('checkup_applications')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setApplications(data || []);
        
        // Calculate stats
        const pending = data?.filter(app => app.status === 'pending').length || 0;
        const completed = data?.filter(app => app.status === 'completed').length || 0;
        
        setStats({
          pending,
          completed,
          total: data?.length || 0,
        });
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <DoctorLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Doctor Dashboard</h1>
          <Button onClick={() => navigate('/doctor/appointments')}>
            <Calendar className="mr-2 h-4 w-4" />
            Manage Appointments
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Checkups</p>
                  <h3 className="text-2xl font-bold">{stats.pending}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <h3 className="text-2xl font-bold">{stats.completed}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Checkup Applications</CardTitle>
            <CardDescription>
              Review and manage patient applications for skin and hair checkups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                {renderApplicationsList(applications.filter(app => app.status === 'pending'))}
              </TabsContent>
              
              <TabsContent value="in-progress">
                {renderApplicationsList(applications.filter(app => app.status === 'in-progress'))}
              </TabsContent>
              
              <TabsContent value="completed">
                {renderApplicationsList(applications.filter(app => app.status === 'completed'))}
              </TabsContent>
              
              <TabsContent value="all">
                {renderApplicationsList(applications)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
  
  function renderApplicationsList(apps: CheckupApplication[]) {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading applications...</p>
        </div>
      );
    }
    
    if (apps.length === 0) {
      return (
        <div className="text-center py-8">
          <UserRound className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No applications found</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {apps.map((app) => (
          <Card key={app.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="p-4 md:p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{app.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Application Date: {formatDate(app.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age & Gender</p>
                    <p>{app.age} years, {app.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Group</p>
                    <p>{app.blood_group}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p>{app.email} / {app.phone}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Skin Problem:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{app.skin_problem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hair Problem:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{app.hair_problem}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 md:w-48 flex flex-row md:flex-col md:justify-center items-center gap-3">
                <Button 
                  onClick={() => navigate(`/doctor/application/${app.id}`)}
                  className="w-full"
                >
                  View Details
                </Button>
                {app.status === 'pending' && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/doctor/recommend-kit/${app.id}`)}
                  >
                    Review & Recommend
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
};

export default DoctorDashboard;
