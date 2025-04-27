
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthStatus, User } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Check for existing session on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('tate-user');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setStatus('authenticated');
      } catch (e) {
        setStatus('unauthenticated');
        localStorage.removeItem('tate-user');
      }
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  // Mock login functionality (to be replaced with Supabase)
  async function login(email: string, password: string) {
    try {
      // Mock authentication successful response
      const mockUser: User = {
        id: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0],
        createdAt: new Date(),
        premium: false,
      };

      // Save to local storage (temporary)
      localStorage.setItem('tate-user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setStatus('authenticated');
      toast({
        title: "ברוך הבא",
        description: "התחברת בהצלחה",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "שגיאה בהתחברות",
        description: "בדוק את הפרטים שהזנת ונסה שוב",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Mock registration functionality (to be replaced with Supabase)
  async function register(email: string, password: string, displayName?: string) {
    try {
      // Mock registration successful response
      const mockUser: User = {
        id: 'mock-user-id',
        email: email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date(),
        premium: false,
      };

      // Save to local storage (temporary)
      localStorage.setItem('tate-user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setStatus('authenticated');
      toast({
        title: "ברוך הבא",
        description: "נרשמת בהצלחה",
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "שגיאה בהרשמה",
        description: "בדוק את הפרטים שהזנת ונסה שוב",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Mock logout functionality
  async function logout() {
    try {
      localStorage.removeItem('tate-user');
      setUser(null);
      setStatus('unauthenticated');
      toast({
        title: "להתראות",
        description: "התנתקת בהצלחה",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "שגיאה בהתנתקות",
        description: "נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  }

  // Mock forgot password functionality
  async function forgotPassword(email: string) {
    try {
      toast({
        title: "נשלח קישור לאיפוס סיסמה",
        description: "בדוק את תיבת הדואר שלך",
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "שגיאה בשחזור סיסמה",
        description: "נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
