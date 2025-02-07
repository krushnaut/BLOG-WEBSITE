import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-3xl font-bold text-blog-title text-center mb-8">
          Sample Blog Title
        </h1>
        <div className="text-blog-body text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" className="gap-2">
            <ThumbsUp className="w-4 h-4" />
            Like
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;