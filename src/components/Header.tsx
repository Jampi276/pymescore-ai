import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BarChart3 } from "lucide-react";
import { BrandButton } from "./ui/brand-button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Análisis", href: "/analysis" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Chat", href: "/chat" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="PYME Credit AI" className="h-8 w-8" />
            <div className="flex items-center space-x-1">
              <span className="text-xl font-bold text-brand-primary">PYME</span>
              <span className="text-xl font-bold text-brand-secondary">Credit</span>
              <BarChart3 className="h-6 w-6 text-brand-accent" />
              <span className="text-xl font-bold text-brand-accent">AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-smooth hover:text-brand-primary",
                  isActive(item.href)
                    ? "text-brand-primary border-b-2 border-brand-primary pb-1"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <BrandButton asChild variant="primary" size="sm">
              <Link to="/login">Iniciar Sesión</Link>
            </BrandButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-smooth px-2 py-1 rounded",
                    isActive(item.href)
                      ? "text-brand-primary bg-brand-primary/10"
                      : "text-muted-foreground hover:text-brand-primary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              
              <BrandButton asChild variant="primary" size="sm" className="mt-4 w-fit">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Iniciar Sesión
                </Link>
              </BrandButton>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;