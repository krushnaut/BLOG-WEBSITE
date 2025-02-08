
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
  category?: string;
  likes?: number;
}

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedBlogs = localStorage.getItem("blogs");
    if (storedBlogs) {
      const blogs = JSON.parse(storedBlogs);
      const currentBlog = blogs.find((b: Blog) => b.id.toString() === id);
      setBlog(currentBlog);
    }
  }, [id]);

  const handleLike = () => {
    if (!blog) return;
    
    const storedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    const updatedBlogs = storedBlogs.map((b: Blog) => {
      if (b.id.toString() === id) {
        return { ...b, likes: (b.likes || 0) + 1 };
      }
      return b;
    });
    
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
    setBlog({ ...blog, likes: (blog.likes || 0) + 1 });
    
    toast({
      title: "Thanks for your like!",
      description: "Your appreciation means a lot to us.",
    });
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

  if (!blog) return <div>Loading...</div>;

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
