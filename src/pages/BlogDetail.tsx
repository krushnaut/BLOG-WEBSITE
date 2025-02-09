
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
  category?: string;
  likes: number;
}

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching blog:', error);
          toast({
            title: "Error",
            description: "Failed to load blog. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        setBlog(data);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load blog. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, toast]);

  const handleLike = async () => {
    if (!blog) return;
    
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ likes: (blog.likes || 0) + 1 })
        .eq('id', id);

      if (error) throw error;
      
      setBlog({ ...blog, likes: (blog.likes || 0) + 1 });
      
      toast({
        title: "Thanks for your like!",
        description: "Your appreciation means a lot to us.",
      });
    } catch (error) {
      console.error('Error updating likes:', error);
      toast({
        title: "Error",
        description: "Failed to update likes. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: blog?.title,
        text: blog?.title,
        url: window.location.href,
      });
      toast({
        title: "Shared successfully!",
        description: "Thanks for sharing our content.",
      });
    } catch (error) {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "The blog link has been copied to your clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-blog-title mb-4">Blog Not Found</h1>
        <p className="text-blog-body">The blog post you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-3xl font-bold text-blog-title text-center mb-8">
          {blog.title}
        </h1>
        <div 
          className="text-blog-body text-justify"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <div className="mt-4 text-blog-muted">
          Category: {blog.category || "Uncategorized"}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" className="gap-2" onClick={handleLike}>
            <ThumbsUp className="w-4 h-4" />
            Like {blog.likes || 0}
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
