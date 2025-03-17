
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { BlogPost } from "@/types";

const EditBlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blogPost", id],
    queryFn: async () => {
      if (!id) throw new Error("Blog post ID is required");
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setImageUrl(post.image_url || "");
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !title || !content) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ 
          title, 
          content, 
          image_url: imageUrl || null 
        })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("Blog post updated successfully");
      navigate("/admin/blogs");
    } catch (error: any) {
      toast.error(`Error updating blog post: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/blogs")}
            className="flex items-center pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog Posts
          </Button>
          <h1 className="text-2xl font-bold mt-2">Edit Blog Post</h1>
        </div>
        
        <div className="bg-white rounded-md shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg (optional)"
              />
              {imageUrl && (
                <div className="mt-2 w-full h-40 overflow-hidden rounded border">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Error+Loading+Image";
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content <span className="text-red-500">*</span></Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here..."
                rows={12}
                required
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/admin/blogs")}
                className="mr-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Update Post'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditBlogPost;
