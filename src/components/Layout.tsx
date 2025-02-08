
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Search, Instagram } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

interface Blog {
  category: string;
}

const Layout = ({ children }: LayoutProps) => {
  const getCategories = () => {
    const blogs = JSON.parse(localStorage.getItem("blogs") || "[]") as Blog[];
    const categories = new Set(blogs.map((blog) => blog.category || "Uncategorized"));
    return Array.from(categories) as string[];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-blog-title">
              Krsnasakhaa
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                to="https://instagram.com/krsnasakhaa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {getCategories().map((category) => (
                    <DropdownMenuItem key={category}>
                      <Link to={`/?category=${category}`}>{category}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/admin" className="button-secondary text-sm">
                Admin
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <div className="bg-white/80 backdrop-blur-sm py-2 text-center text-blog-body">
        We are eternal servants of Supreme Lord Sri Krishna
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t mt-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-blog-muted">
          © {new Date().getFullYear()} krsnasakhaa. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
