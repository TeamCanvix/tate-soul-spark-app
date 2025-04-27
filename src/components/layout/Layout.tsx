
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  BookOpen, 
  User, 
  Settings, 
  MessageCircle, 
  LogOut, 
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if we're on a public route that doesn't need auth
  const isPublicRoute = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/forgot-password';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "שגיאה בהתנתקות",
        description: "נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  // Navigation items
  const navigationItems = [
    { name: "דף הבית", hebrewName: "דף הבית", icon: <Home className="h-5 w-5" />, path: "/" },
    { name: "תפילות", hebrewName: "תפילות", icon: <BookOpen className="h-5 w-5" />, path: "/prayers" },
    { name: "20 שניות תורה", hebrewName: "20 שניות תורה", icon: <MessageCircle className="h-5 w-5" />, path: "/torah" },
    { name: "צ'אט AI", hebrewName: "צ'אט AI", icon: <MessageCircle className="h-5 w-5" />, path: "/chat" },
    { name: "הפרופיל שלי", hebrewName: "הפרופיל שלי", icon: <User className="h-5 w-5" />, path: "/profile" },
  ];

  // Admin items (only for admin users)
  const adminItems = [
    { name: "ניהול", hebrewName: "ניהול", icon: <Settings className="h-5 w-5" />, path: "/admin" },
  ];

  // Check if user should see admin items (placeholder logic)
  const isAdmin = user?.email === "admin@example.com";

  // Return a simplified layout for public routes (login/register)
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-spiritual-light flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-center">
            <h1 className="text-2xl font-bold text-spiritual-dark rtl">טאטע</h1>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} טאטע - כל הזכויות שמורות
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spiritual-light flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-spiritual-dark rtl">טאטע</h1>
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-spiritual-dark hover:text-spiritual-secondary hover:bg-spiritual-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-spiritual-secondary md:hidden"
            >
              <span className="sr-only">Toggle menu</span>
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 rtl">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
              className={`${
                location.pathname === item.path
                  ? 'bg-spiritual-light text-spiritual-secondary'
                  : 'text-spiritual-dark hover:bg-spiritual-light hover:text-spiritual-secondary'
              } block px-3 py-2 rounded-md text-base font-medium w-full text-right`}
            >
              <span className="flex items-center justify-end gap-2">
                {item.hebrewName}
                {item.icon}
              </span>
            </button>
          ))}
          
          {isAdmin && adminItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
              className={`${
                location.pathname === item.path
                  ? 'bg-spiritual-light text-spiritual-secondary'
                  : 'text-spiritual-dark hover:bg-spiritual-light hover:text-spiritual-secondary'
              } block px-3 py-2 rounded-md text-base font-medium w-full text-right`}
            >
              <span className="flex items-center justify-end gap-2">
                {item.hebrewName}
                {item.icon}
              </span>
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="text-spiritual-dark hover:bg-spiritual-light hover:text-spiritual-secondary block px-3 py-2 rounded-md text-base font-medium w-full text-right"
          >
            <span className="flex items-center justify-end gap-2">
              התנתק
              <LogOut className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:flex-col md:w-64 bg-white shadow-sm rtl">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-spiritual-light text-spiritual-secondary'
                      : 'text-spiritual-dark hover:bg-spiritual-light hover:text-spiritual-secondary'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full justify-end`}
                >
                  <span className="flex items-center gap-2">
                    {item.hebrewName}
                    {item.icon}
                  </span>
                </button>
              ))}
              
              {isAdmin && adminItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-spiritual-light text-spiritual-secondary'
                      : 'text-spiritual-dark hover:bg-spiritual-light hover:text-spiritual-secondary'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full justify-end`}
                >
                  <span className="flex items-center gap-2">
                    {item.hebrewName}
                    {item.icon}
                  </span>
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                className="text-spiritual-dark hover:bg-spiritual-light hover:text-spiritual-secondary group flex items-center px-2 py-2 text-base font-medium rounded-md w-full justify-end"
              >
                <span className="flex items-center gap-2">
                  התנתק
                  <LogOut className="h-5 w-5" />
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 bg-spiritual-light">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} טאטע - כל הזכויות שמורות
        </div>
      </footer>
    </div>
  );
};

export default Layout;
