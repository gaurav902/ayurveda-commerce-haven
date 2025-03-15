
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, MessageSquare, Trash2, Eye, MailOpen, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

const AdminContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);
  const [viewSubmission, setViewSubmission] = useState<ContactSubmission | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectSubmission = (id: string) => {
    setSelectedSubmissions((prev) =>
      prev.includes(id)
        ? prev.filter((submissionId) => submissionId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(filteredSubmissions.map((submission) => submission.id));
    }
  };

  const handleViewSubmission = async (submission: ContactSubmission) => {
    setViewSubmission(submission);
    
    // If the submission is new, mark it as read
    if (submission.status === 'new') {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .update({ status: 'read' })
          .eq('id', submission.id);

        if (error) throw error;
        
        // Update the local state
        setSubmissions(submissions.map(sub => 
          sub.id === submission.id ? { ...sub, status: 'read' } : sub
        ));
      } catch (error) {
        console.error("Error updating submission status:", error);
      }
    }
  };

  const handleCloseDialog = () => {
    setViewSubmission(null);
    setReplyText("");
  };

  const handleDeleteSelected = async () => {
    if (!selectedSubmissions.length) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedSubmissions.length} submission(s)?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .in('id', selectedSubmissions);

      if (error) throw error;
      
      setSubmissions(submissions.filter(submission => !selectedSubmissions.includes(submission.id)));
      setSelectedSubmissions([]);
      toast.success(`${selectedSubmissions.length} submission(s) deleted successfully`);
    } catch (error) {
      console.error("Error deleting submissions:", error);
      toast.error("Failed to delete submissions");
    }
  };

  const handleSendReply = async () => {
    if (!viewSubmission || !replyText.trim()) return;
    
    setIsSendingReply(true);
    
    try {
      // In a real app, you would send an email here
      // For this demo, we'll just update the status
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'replied' })
        .eq('id', viewSubmission.id);

      if (error) throw error;
      
      // Update the local state
      setSubmissions(submissions.map(sub => 
        sub.id === viewSubmission.id ? { ...sub, status: 'replied' } : sub
      ));
      
      toast.success(`Reply sent to ${viewSubmission.email}`);
      handleCloseDialog();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsSendingReply(false);
    }
  };

  const exportToCSV = () => {
    const csvData = [
      ["Name", "Email", "Subject", "Status", "Date"],
      ...filteredSubmissions.map((submission) => [
        submission.name,
        submission.email,
        submission.subject,
        submission.status,
        new Date(submission.created_at).toLocaleDateString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + csvData.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `contact_submissions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = submissions.filter((submission) =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'read':
        return <Badge variant="outline">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500">Replied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
              <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Contact Submissions ({submissions.length})</span>
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contact submissions..."
                      className="pl-9 w-full sm:w-[300px]"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={exportToCSV}
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No contact submissions yet</h3>
                    <p className="text-muted-foreground">
                      When users submit the contact form, their messages will appear here.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                      >
                        {selectedSubmissions.length === filteredSubmissions.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                      
                      {selectedSubmissions.length > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={handleDeleteSelected}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Selected ({selectedSubmissions.length})
                        </Button>
                      )}
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <span className="sr-only">Select</span>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-12">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedSubmissions.includes(submission.id)}
                                  onChange={() => handleSelectSubmission(submission.id)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {submission.name}
                              </TableCell>
                              <TableCell>{submission.email}</TableCell>
                              <TableCell>{submission.subject}</TableCell>
                              <TableCell>{getStatusBadge(submission.status)}</TableCell>
                              <TableCell>{formatDate(submission.created_at)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewSubmission(submission)}
                                  className="h-8 w-8 p-0"
                                >
                                  <span className="sr-only">View submission</span>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* View Submission Dialog */}
      <Dialog open={!!viewSubmission} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Contact Submission</DialogTitle>
            <DialogDescription>
              View the details of this contact submission and reply to the sender
            </DialogDescription>
          </DialogHeader>

          {viewSubmission && (
            <div className="space-y-4 mt-4">
              <div className="grid gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                <p className="font-medium">{viewSubmission.name} ({viewSubmission.email})</p>
              </div>
              
              <div className="grid gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p className="font-medium">{viewSubmission.subject}</p>
              </div>
              
              <div className="grid gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                <div className="p-4 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">{viewSubmission.message}</p>
                </div>
              </div>
              
              <div className="grid gap-2 pt-4">
                <h3 className="text-sm font-medium text-muted-foreground">Reply</h3>
                <Textarea
                  placeholder="Type your reply here..."
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendReply} 
                  disabled={!replyText.trim() || isSendingReply}
                  className="flex items-center gap-1"
                >
                  {isSendingReply ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default AdminContactSubmissions;
