import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
  category?: string;
}

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const storedBlogs = localStorage.getItem("blogs");
    if (storedBlogs) {
      const blogs = JSON.parse(storedBlogs);
      const currentBlog = blogs.find((b: Blog) => b.id.toString() === id);
      setBlog(currentBlog);
    }
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-3xl font-bold text-blog-title text-center mb-8">
          {blog.title}
        </h1>
        <div className="text-blog-body text-justify">
          {blog.content}
        </div>
        <div className="mt-4 text-blog-muted">
          Category: {blog.category || "Uncategorized"}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" className="gap-2">
            <ThumbsUp className="w-4 h-4" />
            Like
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;