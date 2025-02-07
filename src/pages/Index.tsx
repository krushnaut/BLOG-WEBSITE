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
    <div>
      <h1 className="text-4xl font-bold text-blog-title mb-12">Latest Posts</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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