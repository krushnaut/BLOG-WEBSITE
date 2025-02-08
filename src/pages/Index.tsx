
import BlogCard from "@/components/BlogCard";
import { useEffect, useState } from "react";

interface Blog {
  id: number;
  title: string;
  content: string;
  date: string;
}

const Index = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const storedBlogs = localStorage.getItem("blogs");
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-blog-title mb-12 text-center sm:text-left">Latest Posts</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            id={blog.id.toString()}
            title={blog.title}
            description={blog.content}
            date={blog.date}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
