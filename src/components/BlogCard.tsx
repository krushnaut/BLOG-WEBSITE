
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BlogCardProps {
  id: number;
  title: string;
  date: string;
}

const BlogCard = ({ id, title }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 h-full flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
          {title}
        </h2>
        <div className="mt-auto text-right">
          <Link 
            to={`/blog/${id}`} 
            className="text-blue-500 hover:text-blue-600 transition-colors text-sm"
          >
            Read Blog
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
