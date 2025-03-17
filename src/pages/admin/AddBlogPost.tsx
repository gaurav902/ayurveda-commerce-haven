
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const AddBlogPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert([
          { 
            title, 
            content, 
            image_url: imageUrl || null 
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success("Blog post created successfully");
      navigate("/admin/blogs");
    } catch (error: any) {
      toast.error(`Error creating blog post: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold mt-2">Add New Blog Post</h1>
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
                  'Publish Post'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddBlogPost;
