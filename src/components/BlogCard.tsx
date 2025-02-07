import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
}

const BlogCard = ({ id, title, description, date }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/blog/${id}`} className="blog-card block">
        <h2 className="blog-title">{title}</h2>
        <p className="blog-description">{description}</p>
        <div className="blog-meta">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;