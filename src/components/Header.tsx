import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X, BarChart3, MessageSquare, Home, FileText, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sessionManager } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  const isLoggedIn = sessionManager.isLoggedIn();
  const userName = sessionManager.getUserName();
  
  const handleLogout = () => {
    sessionManager.clearSession();
    setIsOpen(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };
  
  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Análisis', href: '/analysis', icon: FileText, protected: true },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, protected: true },
    { name: 'Chat', href: '/chat', icon: MessageSquare, protected: true },
  ];
  
  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };
  
  const NavLinks = ({ mobile = false }) => (
    <>
      {navigation.map((item) => {
        if (item.protected && !isLoggedIn) return null;
        
        const Icon = item.icon;
        const isActive = isActiveRoute(item.href);
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth
              ${isActive 
                ? 'bg-brandPrimary text-white shadow-brand' 
                : 'text-brandSecondary hover:text-brandPrimary hover:bg-brandPrimary/10'
              }
              ${mobile ? 'w-full justify-start' : ''}
            `}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-brandPrimary to-brandAccent">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-brandPrimary">PYME Credit AI</span>
              <p className="text-xs text-brandSecondary">Evaluación de Riesgo Financiero</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLinks />
          </nav>
          
          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-brandSecondary" />
                  <span className="text-brandSecondary">
                    {userName || sessionManager.getUserEmail()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-brandSecondary hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" className="brand-gradient text-white" asChild>
                  <Link to="/login">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 pt-6">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-brandPrimary to-brandAccent">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-brandPrimary">PYME Credit AI</span>
                      <p className="text-xs text-brandSecondary">Evaluación de Riesgo</p>
                    </div>
                  </div>
                  
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    <NavLinks mobile />
                  </nav>
                  
                  {/* Mobile User Section */}
                  <div className="border-t pt-4">
                    {isLoggedIn ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                          <User className="h-5 w-5 text-brandSecondary" />
                          <div>
                            <p className="text-sm font-medium">
                              {userName || 'Usuario'}
                            </p>
                            <p className="text-xs text-brandSecondary">
                              {sessionManager.getUserEmail()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            Iniciar Sesión
                          </Link>
                        </Button>
                        <Button className="w-full brand-gradient text-white" asChild>
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            Registrarse
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};