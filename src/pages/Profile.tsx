
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { User, CreditCard, Lock } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSaveProfile = () => {
    // This would update the user's profile in a real app
    // For now, just show a success message
    toast({
      title: "פרופיל עודכן",
      description: "הפרטים שלך עודכנו בהצלחה",
    });
    setIsEditing(false);
  };
  
  const handleUpgrade = () => {
    // This would redirect to a payment page in a real app
    toast({
      title: "שדרוג חשבון",
      description: "מיד תועבר לעמוד התשלום",
    });
  };
  
  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">הפרופיל שלי</h1>
        <p className="text-spiritual-dark mt-2">נהל את החשבון והפרטים שלך</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="spiritual-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                פרטי משתמש
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-right">
                  שם תצוגה
                </label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="rtl text-right"
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-right">
                  אימייל
                </label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rtl text-right"
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    ביטול
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    שמור שינויים
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  ערוך פרטים
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card className="spiritual-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                אבטחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                שנה סיסמה
              </Button>
              <Button variant="destructive" className="w-full" onClick={() => logout()}>
                התנתק
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="spiritual-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                חבילה
              </CardTitle>
              <CardDescription>
                החבילה הנוכחית שלך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 space-y-4">
                <h3 className="text-xl font-semibold">{user?.premium ? 'חבילת פרימיום' : 'חבילה בסיסית'}</h3>
                <p className="text-muted-foreground">
                  {user?.premium 
                    ? 'אתה נהנה מגישה מלאה לכל התכונות והתוכן.'
                    : 'שדרג כדי לקבל גישה לתכונות ותוכן נוספים.'}
                </p>
                {!user?.premium && (
                  <div className="bg-spiritual-light p-3 rounded-md">
                    <span className="text-spiritual-dark font-semibold">יתרונות הפרימיום:</span>
                    <ul className="mt-2 text-spiritual-dark text-right list-disc list-inside">
                      <li>גישה למאמרים מתקדמים</li>
                      <li>צ'אט AI ללא הגבלה</li>
                      <li>שיעורים ייעודיים</li>
                      <li>אפשרויות התאמה אישית</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {user?.premium ? (
                <Button variant="outline" className="w-full">
                  נהל מנוי
                </Button>
              ) : (
                <Button className="w-full" onClick={handleUpgrade}>
                  שדרג לפרימיום
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
