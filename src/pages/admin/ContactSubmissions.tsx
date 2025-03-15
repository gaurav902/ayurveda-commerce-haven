
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Eye, Trash2, Check, X } from "lucide-react";
import { ContactSubmission } from "@/types";

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const AdminContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      toast.error("Could not load contact submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setSubmissions(submissions.map(submission => 
        submission.id === id 
          ? { ...submission, status: newStatus, updated_at: new Date().toISOString() } 
          : submission
      ));
      
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus, updated_at: new Date().toISOString() });
      }
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSubmissions(submissions.filter(submission => submission.id !== id));
      
      if (isViewDialogOpen && selectedSubmission?.id === id) {
        setIsViewDialogOpen(false);
      }
      
      toast.success("Contact submission deleted successfully");
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-serif mb-8">Contact Submissions</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <AdminSidebar />
          </div>
          
          <div className="md:col-span-4 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Contact Submissions ({submissions.length})</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No contact submissions yet</h3>
                    <p className="text-muted-foreground">
                      When customers submit the contact form, their messages will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="font-medium">{submission.name}</TableCell>
                            <TableCell>{submission.subject}</TableCell>
                            <TableCell>{formatDate(submission.created_at)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${submission.status === 'new' ? 'bg-blue-100 text-blue-800' : submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : submission.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleViewSubmission(submission)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteSubmission(submission.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* View Submission Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSubmission.subject}</DialogTitle>
                <DialogDescription>
                  From: {selectedSubmission.name} ({selectedSubmission.email})
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Message:</div>
                  <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Date:</div>
                  <div>{formatDate(selectedSubmission.created_at)}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Status:</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${selectedSubmission.status === 'new' ? 'bg-blue-100 text-blue-800' : selectedSubmission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : selectedSubmission.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                    </Badge>
                    
                    <div className="ml-2 flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className={selectedSubmission.status === 'pending' ? 'bg-yellow-100' : ''}
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'pending')}
                      >
                        Pending
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={selectedSubmission.status === 'resolved' ? 'bg-green-100' : ''}
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'resolved')}
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Resolved
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={selectedSubmission.status === 'closed' ? 'bg-gray-100' : ''}
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'closed')}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Closed
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                  
                  <a href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`} className="inline-block">
                    <Button>
                      <Mail className="mr-2 h-4 w-4" />
                      Reply via Email
                    </Button>
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminContactSubmissions;
