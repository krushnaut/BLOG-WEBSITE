import BlogCard from "@/components/BlogCard";

const Index = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-blog-title mb-12">Latest Posts</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {mockBlogs.map((blog) => (
          <BlogCard key={blog.id} {...blog} />
        ))}
      </div>
    </div>
  );
};

export default Index;