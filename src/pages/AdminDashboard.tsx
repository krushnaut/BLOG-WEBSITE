
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  date: string;
  category?: string;
  likes?: number;
}

const categories = [
  "Bhakti",
  "Philosophy",
  "Lifestyle",
  "Culture",
  "Festivals",
  "Other"
];

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }

    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast({
          title: "Error",
          description: "Failed to load blogs. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId !== null) {
        const { error } = await supabase
          .from('blogs')
          .update({
            title,
            content,
            category
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Blog updated",
          description: "The blog post has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([{
            title,
            content,
            category,
            likes: 0
          }]);

        if (error) throw error;

        toast({
          title: "Blog created",
          description: "New blog post has been created successfully.",
        });
      }

      // Refresh blogs list
      const { data: updatedBlogs } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      setBlogs(updatedBlogs || []);
      setTitle("");
      setContent("");
      setCategory("");
      setEditingId(null);
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: "Error",
        description: "Failed to save blog. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (blog: Blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setCategory(blog.category || "");
    setEditingId(blog.id);
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBlogs(blogs.filter(blog => blog.id !== id));
      toast({
        title: "Blog deleted",
        description: "The blog post has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blog-title">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
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
        <div className="text-left">
          <label htmlFor="category" className="block text-sm font-medium text-blog-body mb-1">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-left">
          <label htmlFor="content" className="block text-sm font-medium text-blog-body mb-1">
            Blog Content
          </label>
          <div className="border rounded-md p-2">
            <div className="space-x-2 mb-2">
              <button
                type="button"
                onClick={() => setContent(content + "<h1>")}
                className="px-2 py-1 border rounded"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => setContent(content + "<br>")}
                className="px-2 py-1 border rounded"
              >
                BR
              </button>
              <button
                type="button"
                onClick={() => setContent(content + "<b>")}
                className="px-2 py-1 border rounded"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => setContent(content + "<i>")}
                className="px-2 py-1 border rounded"
              >
                Italic
              </button>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-2 border rounded"
              required
            />
          </div>
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
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>{blog.category || "Uncategorized"}</TableCell>
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
