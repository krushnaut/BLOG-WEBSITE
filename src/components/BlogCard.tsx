
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
}

const BlogCard = ({ id, title }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <Link to={`/blog/${id}`} className="blog-card block h-full">
        <div className="flex flex-col h-full">
          <h2 className="blog-title">{title}</h2>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
