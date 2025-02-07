import Layout from "@/components/Layout";
import BlogCard from "@/components/BlogCard";

// Temporary mock data
const mockBlogs = [
  {
    id: "1",
    title: "The Art of Minimalist Design",
    description:
      "Explore the principles of minimalist design and how it can enhance user experience while maintaining functionality.",
    date: "2024-02-20",
  },
  {
    id: "2",
    title: "Building Scalable Applications",
    description:
      "Learn the best practices for creating scalable applications that can handle growth and maintain performance.",
    date: "2024-02-19",
  },
  {
    id: "3",
    title: "The Future of Web Development",
    description:
      "Discover emerging trends and technologies that are shaping the future of web development and user interfaces.",
    date: "2024-02-18",
  },
];

const Index = () => {
  return (
    <Layout>
      <section className="space-y-8">
        <h1 className="section-title">Latest Posts</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockBlogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;