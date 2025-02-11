
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

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
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
      if (!isLoggedIn) {
        navigate("/admin");
        return;
      }
      fetchBlogs();
    };

    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
      if (!isLoggedIn) {
        navigate("/admin");
        return;
      }
      fetchBlogs();
    };

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

    checkAuth();
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

  const handleContentFormat = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = '';

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'heading':
        newText = `# ${selectedText}`;
        break;
      case 'quote':
        newText = `> ${selectedText}`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blog-title">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full"
          />
        </div>

        <div>
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

        <Card>
          <CardContent className="p-4">
            <label htmlFor="content" className="block text-sm font-medium text-blog-body mb-2">
              Blog Content
            </label>
            <div className="space-x-2 mb-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleContentFormat('heading')}
              >
                Heading
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleContentFormat('bold')}
              >
                Bold
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleContentFormat('italic')}
              >
                Italic
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleContentFormat('quote')}
              >
                Quote
              </Button>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] font-mono"
              placeholder="Write your blog content here..."
              required
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
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
