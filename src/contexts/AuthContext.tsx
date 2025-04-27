import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthStatus, User } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

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
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              displayName: profile.full_name,
              createdAt: new Date(session.user.created_at),
              premium: false,
            });
          }
          setStatus('authenticated');
        } else {
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email!,
                displayName: profile.full_name,
                createdAt: new Date(session.user.created_at),
                premium: false,
              });
            }
            setStatus('authenticated');
          });
      } else {
        setStatus('unauthenticated');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const hebrewError = getHebrewErrorMessage(error.message);
        throw new Error(hebrewError);
      }

      toast({
        title: "ברוך הבא לטאטע",
        description: "התחברת בהצלחה",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "שגיאה בהתחברות",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }

  async function register(email: string, password: string, displayName?: string) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
          },
        },
      });

      if (error) {
        const hebrewError = getHebrewErrorMessage(error.message);
        throw new Error(hebrewError);
      }

      toast({
        title: "ברוך הבא לטאטע",
        description: "נרשמת בהצלחה",
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "שגיאה בהרשמה",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "להתראות",
        description: "התנתקת בהצלחה",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "שגיאה בהתנתקות",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function forgotPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;

      toast({
        title: "נשלח קישור לאיפוס סיסמה",
        description: "בדוק את תיבת הדואר שלך",
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast({
        title: "שגיאה בשחזור סיסמה",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  function getHebrewErrorMessage(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'Invalid email': 'כתובת אימייל לא תקינה',
      'Password should be at least 6 characters': 'הסיסמה חייבת להכיל לפחות 6 תווים',
      'User already registered': 'משתמש כבר קיים במערכת',
      'Invalid login credentials': 'פרטי התחברות שגויים',
      'Email not confirmed': 'האימייל טרם אומת',
      'Invalid password': 'סיסמה שגויה',
      'Email link is invalid or has expired': 'קישור האיפוס לא תקין או שפג תוקפו',
    };

    return errorMap[errorMessage] || 'אירעה שגיאה. אנא נסה שוב';
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
