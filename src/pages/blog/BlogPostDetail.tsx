
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { BlogPost } from "@/types";

const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blogPost", id],
    queryFn: async () => {
      if (!id) throw new Error("Blog post ID is required");
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single() as unknown as { data: BlogPost | null, error: Error | null };

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!id,
  });

  function formatDate(dateString: string) {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6 pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : post ? (
            <div>
              {post.image_url && (
                <div className="w-full h-80 mb-8 overflow-hidden rounded-lg">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h1 className="text-4xl font-serif font-bold mb-4">{post.title}</h1>
              
              <div className="flex text-sm text-muted-foreground gap-4 mb-6">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(post.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <User size={14} />
                  Admin
                </span>
              </div>
              
              <Separator className="mb-8" />
              
              <div className="prose prose-green max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium mb-2">Blog post not found</h2>
              <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
              <Link to="/blog">
                <Button>Return to Blog</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPostDetail;
