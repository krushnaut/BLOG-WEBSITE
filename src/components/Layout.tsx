import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="page-container flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-blog-title">
            Blog
          </Link>
          <Link to="/admin" className="button-secondary">
            Admin
          </Link>
        </nav>
      </header>
      <main className="page-container">{children}</main>
      <footer className="border-t mt-16">
        <div className="page-container py-8 text-center text-blog-muted">
          © {new Date().getFullYear()} Blog. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;