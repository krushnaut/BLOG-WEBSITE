
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface BlogCardProps {
  id: number;
  title: string;
  date: string;
}

const BlogCard = ({ id, title, date }: BlogCardProps) => {
  // Format the date to match the design (e.g., "December 27, 2024")
  const formattedDate = format(new Date(date), "MMMM dd, yyyy");

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
        <div className="text-gray-500 text-sm mb-4">
          {formattedDate}
        </div>
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
