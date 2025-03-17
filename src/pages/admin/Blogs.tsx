
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { BlogPost } from "@/types";

const Blogs = () => {
  const { data: blogs, isLoading, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false }) as unknown as { data: BlogPost[] | null, error: Error | null };
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id) as unknown as { error: Error | null };
      
      if (error) throw error;
      
      toast.success("Blog post deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(`Error deleting blog post: ${error.message}`);
    }
  };

  function formatDate(dateString: string) {
    return format(new Date(dateString), 'MMM dd, yyyy');
  }

  function truncateText(text: string, maxLength: number = 60) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Blog Posts</h1>
          <Link to="/admin/blogs/add">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add New Post
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : blogs && blogs.length > 0 ? (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Content Preview</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{truncateText(blog.title, 30)}</TableCell>
                    <TableCell>{truncateText(blog.content)}</TableCell>
                    <TableCell>{formatDate(blog.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={`/blog/${blog.id}`}>
                            <DropdownMenuItem>
                              View
                            </DropdownMenuItem>
                          </Link>
                          <Link to={`/admin/blogs/edit/${blog.id}`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleDelete(blog.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-md shadow">
            <h2 className="text-xl font-medium mb-2">No blog posts yet</h2>
            <p className="text-muted-foreground mb-6">Start by creating your first blog post</p>
            <Link to="/admin/blogs/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Blog Post
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Blogs;
