
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
  category?: string;
}

interface BlogListProps {
  blogs: Blog[];
  onEdit: (blog: Blog) => void;
  onBlogDeleted: () => void;
}

const BlogList = ({ blogs, onEdit, onBlogDeleted }: BlogListProps) => {
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Blog deleted",
        description: "The blog post has been deleted successfully.",
      });
      onBlogDeleted();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
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
                  <Button variant="outline" size="sm" onClick={() => onEdit(blog)}>
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
  );
};

export default BlogList;
