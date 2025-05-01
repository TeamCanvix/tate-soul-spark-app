
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { User, CreditCard, Lock } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Profile = () => {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch user profile from Supabase
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('משתמש לא מחובר');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user?.id
  });
  
  // Update displayName when profile data loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.full_name || '');
    }
  }, [profile]);
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (newName: string) => {
      if (!user?.id) throw new Error('משתמש לא מחובר');
      
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: newName })
        .eq('id', user.id);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: "פרופיל עודכן",
        description: "השם עודכן בהצלחה",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "שגיאת עדכון",
        description: "אירעה שגיאה בעדכון הפרופיל",
        variant: "destructive",
      });
    }
  });
  
  const handleSaveProfile = () => {
    if (!displayName.trim()) {
      toast({
        title: "שגיאת אימות",
        description: "שם לא יכול להיות ריק",
        variant: "destructive",
      });
      return;
    }
    
    updateProfileMutation.mutate(displayName);
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
              {isLoading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : error ? (
                <div className="text-destructive">אירעה שגיאה בטעינת פרטי המשתמש</div>
              ) : (
                <>
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
                      value={user?.email || ''}
                      className="rtl text-right"
                      disabled
                    />
                  </div>
                  {profile?.created_at && (
                    <div className="text-sm text-muted-foreground text-right">
                      נרשם ב: {new Date(profile.created_at).toLocaleDateString('he-IL')}
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {isLoading ? (
                <Skeleton className="h-10 w-24" />
              ) : isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setDisplayName(profile?.full_name || '');
                    }}
                    disabled={updateProfileMutation.isPending}
                  >
                    ביטול
                  </Button>
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'שומר...' : 'שמור שינויים'}
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
