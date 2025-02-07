import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Blog {
  id: number;
  title: string;
  content: string;
}

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlog = {
      id: editingId || Date.now(),
      title,
      content,
      date: new Date().toISOString(),
    };

    if (editingId !== null) {
      setBlogs(blogs.map(blog => 
        blog.id === editingId ? newBlog : blog
      ));
      toast({
        title: "Blog updated",
        description: "The blog post has been updated successfully.",
      });
    } else {
      setBlogs([newBlog, ...blogs]);
      toast({
        title: "Blog created",
        description: "New blog post has been created successfully.",
      });
    }
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  const handleEdit = (blog: Blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setEditingId(blog.id);
  };

  const handleDelete = (id: number) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
    toast({
      title: "Blog deleted",
      description: "The blog post has been deleted successfully.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blog-title">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-blog-body mb-1">
            Blog Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter blog title"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-blog-body mb-1">
            Blog Content
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your blog content here"
            className="min-h-[200px]"
          />
        </div>
        <Button type="submit">
          {editingId !== null ? "Update Blog" : "Create Blog"}
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-blog-title mb-4">Manage Blogs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;