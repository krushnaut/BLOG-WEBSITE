
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { categories } from "./constants";

interface BlogFormProps {
  onBlogUpdated: () => void;
  editingBlog?: {
    id: number;
    title: string;
    content: string;
    category?: string;
  } | null;
}

const BlogForm = ({ onBlogUpdated, editingBlog }: BlogFormProps) => {
  const [title, setTitle] = useState(editingBlog?.title || "");
  const [content, setContent] = useState(editingBlog?.content || "");
  const [category, setCategory] = useState(editingBlog?.category || "");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBlog?.id) {
        const { error } = await supabase
          .from('blogs')
          .update({
            title,
            content,
            category
          })
          .eq('id', editingBlog.id);

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

      setTitle("");
      setContent("");
      setCategory("");
      onBlogUpdated();
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: "Error",
        description: "Failed to save blog. Please try again later.",
        variant: "destructive"
      });
    }
  };

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
            className="min-h-[300px]"
            placeholder="Write your blog content here..."
            required
          />
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        {editingBlog?.id ? "Update Blog" : "Create Blog"}
      </Button>
    </form>
  );
};

export default BlogForm;
