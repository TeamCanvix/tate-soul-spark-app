
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('נא להזין כתובת אימייל');
      return;
    }
    
    setLoading(true);
    
    try {
      await forgotPassword(email);
      setMessage('נשלח קישור לאיפוס סיסמה לכתובת האימייל שהזנת.');
      setEmail('');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('אירעה שגיאה בשליחת הבקשה. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md animate-fade-in rtl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">שכחת סיסמה?</CardTitle>
          <CardDescription>הזן את האימייל שלך כדי לקבל קישור לאיפוס הסיסמה</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-right">
                אימייל
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="rtl text-right"
                required
              />
            </div>
            {error && <p className="text-destructive text-sm text-right">{error}</p>}
            {message && <p className="text-green-600 text-sm text-right">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "שולח..." : "שלח קישור לאיפוס סיסמה"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            נזכרת בסיסמה?{' '}
            <Link to="/login" className="text-spiritual-secondary underline-offset-4 hover:underline">
              חזור להתחברות
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
