
import { useState } from "react";
import { CheckupApplication } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, User } from "lucide-react";

interface CheckupApplicationListProps {
  applications: CheckupApplication[];
  onSelectApplication: (applicationId: string) => void;
  selectedApplicationId?: string;
  doctorView?: boolean;
}

const CheckupApplicationList = ({ 
  applications, 
  onSelectApplication, 
  selectedApplicationId,
  doctorView = false
}: CheckupApplicationListProps) => {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'completed': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="h-[450px]">
      <CardHeader>
        <CardTitle className="text-lg">
          {doctorView ? "Checkup Applications" : "My Checkup Applications"}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[370px]">
        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((application) => (
              <div 
                key={application.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedApplicationId === application.id ? 'bg-accent border-primary' : 'hover:bg-accent/50'
                }`}
                onClick={() => onSelectApplication(application.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{application.full_name}</span>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(application.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>{application.selfie_urls.length} photos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              {doctorView 
                ? "No applications to review yet"
                : "You haven't applied for any checkups yet"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckupApplicationList;
