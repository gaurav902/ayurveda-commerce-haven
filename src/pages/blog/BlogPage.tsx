
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { BlogPost } from "@/types";

const BlogPage = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false }) as unknown as { data: BlogPost[] | null, error: Error | null };

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  function formatDate(dateString: string) {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  }

  function truncateContent(content: string, maxLength: number = 150) {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-6">Ayurveda Blog</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Explore the ancient wisdom of Ayurveda through our collection of articles, tips, and insights.
          </p>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  {post.image_url && (
                    <div className="w-full h-64 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex text-sm text-muted-foreground gap-4 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        Admin
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-serif">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {truncateContent(post.content)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="outline">Read More</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-xl text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
