
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, Users, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Subscriber } from "@/types";

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSubscribers(data || []);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        toast.error("Could not load subscribers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectSubscriber = (id: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id)
        ? prev.filter((subscriberId) => subscriberId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map((subscriber) => subscriber.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedSubscribers.length) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscriber(s)?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .in('id', selectedSubscribers);

      if (error) throw error;
      
      setSubscribers(subscribers.filter(subscriber => !selectedSubscribers.includes(subscriber.id)));
      setSelectedSubscribers([]);
      toast.success(`${selectedSubscribers.length} subscriber(s) deleted successfully`);
    } catch (error) {
      console.error("Error deleting subscribers:", error);
      toast.error("Failed to delete subscribers");
    }
  };

  const exportToCSV = () => {
    const csvData = [
      ["Email", "Notifications", "Subscribed On"],
      ...filteredSubscribers.map((subscriber) => [
        subscriber.email,
        subscriber.receive_notifications ? "Yes" : "No",
        new Date(subscriber.created_at).toLocaleDateString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + csvData.map((row) => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-serif mb-8">Newsletter Subscribers</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-1">
            <AdminSidebar />
          </div>
          
          <div className="md:col-span-4 space-y-6">
            <Card className="shadow-md">
              <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Subscribers ({subscribers.length})</span>
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subscribers..."
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
                {subscribers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No subscribers yet</h3>
                    <p className="text-muted-foreground">
                      When users subscribe to your newsletter, they'll appear here.
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
                        {selectedSubscribers.length === filteredSubscribers.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                      
                      {selectedSubscribers.length > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={handleDeleteSelected}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Selected ({selectedSubscribers.length})
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
                            <TableHead>Email</TableHead>
                            <TableHead>Notifications</TableHead>
                            <TableHead>Subscribed On</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSubscribers.map((subscriber) => (
                            <TableRow key={subscriber.id}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedSubscribers.includes(subscriber.id)}
                                  onChange={() => handleSelectSubscriber(subscriber.id)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {subscriber.email}
                              </TableCell>
                              <TableCell>
                                <Badge variant={subscriber.receive_notifications ? "default" : "outline"}>
                                  {subscriber.receive_notifications ? "Enabled" : "Disabled"}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(subscriber.created_at)}</TableCell>
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
    </Layout>
  );
};

export default AdminSubscribers;
