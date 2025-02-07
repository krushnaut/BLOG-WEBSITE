import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const getCategories = () => {
    const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    const categories = new Set(blogs.map((blog: any) => blog.category || "Uncategorized"));
    return Array.from(categories);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-blog-title">
            krsnasakhaa
          </Link>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Search className="w-6 h-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {getCategories().map((category) => (
                  <DropdownMenuItem key={category}>
                    <Link to={`/?category=${category}`}>{category}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/admin" className="button-secondary">
              Admin
            </Link>
          </div>
        </nav>
      </header>
      <div className="bg-gray-100 py-2 text-center text-blog-body">
        We are eternal servants of Supreme Lord Sri Krishna
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-blog-muted">
          © {new Date().getFullYear()} krsnasakhaa. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;