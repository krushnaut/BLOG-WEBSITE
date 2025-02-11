
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BlogForm from "@/components/admin/BlogForm";
import BlogList from "@/components/admin/BlogList";
import { useAuth } from "@/components/admin/hooks/useAuth";

interface Blog {
  id: number;
  title: string;
  content: string;
  date: string;
  category?: string;
  likes?: number;
}

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleLogout } = useAuth();
  const { toast } = useToast();

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

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blog-title">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <BlogForm 
        editingBlog={editingBlog} 
        onBlogUpdated={() => {
          fetchBlogs();
          setEditingBlog(null);
        }}
      />

      <BlogList 
        blogs={blogs}
        onEdit={handleEdit}
        onBlogDeleted={fetchBlogs}
      />
    </div>
  );
};

export default AdminDashboard;
