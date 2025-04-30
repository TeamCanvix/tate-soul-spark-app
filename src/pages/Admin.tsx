
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Admin = () => {
  const { user } = useAuth();
  const [torahContent, setTorahContent] = useState({ title: '', content: '' });
  const [motivation, setMotivation] = useState({ title: '', content: '' });
  const [userList] = useState([
    { id: '1', email: 'user1@example.com', name: 'משתמש 1', premium: true, lastLogin: '2025-04-25' },
    { id: '2', email: 'user2@example.com', name: 'משתמש 2', premium: false, lastLogin: '2025-04-26' },
    { id: '3', email: 'user3@example.com', name: 'משתמש 3', premium: false, lastLogin: '2025-04-27' },
  ]);
  
  // New state for admin notifications
  const [notification, setNotification] = useState({
    type: 'encouragement' as 'encouragement' | 'reminder',
    content: ''
  });
  
  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ['isUserAdmin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data?.role === 'admin';
    },
  });
  
  const handleAddTorahContent = () => {
    if (!torahContent.title || !torahContent.content) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would add the content to the database
    toast({
      title: "תוכן נוסף בהצלחה",
      description: "תוכן התורה החדש נוסף למערכת",
    });
    
    setTorahContent({ title: '', content: '' });
  };
  
  const handleAddMotivation = () => {
    if (!motivation.title || !motivation.content) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would add the motivation to the database
    toast({
      title: "תוכן נוסף בהצלחה",
      description: "המוטיבציה היומית החדשה נוספה למערכת",
    });
    
    setMotivation({ title: '', content: '' });
  };

  // New function to handle notification submission
  const handleAddNotification = async () => {
    if (!notification.content) {
      toast({
        title: "שגיאה",
        description: "יש למלא את שדה התוכן",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "שגיאה",
        description: "יש להתחבר מחדש",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('admin_notifications')
        .insert({
          type: notification.type,
          content: notification.content,
          created_by: user.id
        });
      
      if (error) throw error;
      
      toast({
        title: "הודעה נשלחה בהצלחה",
        description: notification.type === 'encouragement' ? "החיזוק היומי נשלח בהצלחה" : "התזכורת נשלחה בהצלחה",
      });
      
      setNotification({
        type: 'encouragement',
        content: ''
      });
    } catch (error) {
      console.error('Error adding notification:', error);
      toast({
        title: "שגיאה בשליחת ההודעה",
        description: "אנא נסה שנית מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  // If user is not admin, don't show the admin page
  if (isAdmin === false) {
    return (
      <div className="space-y-6 rtl animate-fade-in text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">גישה נדחתה</h1>
        <p className="text-spiritual-dark">אין לך הרשאות מנהל לצפות בעמוד זה</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">לוח ניהול</h1>
        <p className="text-spiritual-dark mt-2">ניהול תוכן ומשתמשים</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">ניהול תוכן</TabsTrigger>
          <TabsTrigger value="notifications">הודעות והתראות</TabsTrigger>
          <TabsTrigger value="users">ניהול משתמשים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6 mt-6">
          <Card className="spiritual-card">
            <CardHeader>
              <CardTitle>הוספת תוכן תורה יומי</CardTitle>
              <CardDescription>הוסף תוכן חדש לסדרה "20 שניות תורה"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="torah-title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-right">
                  כותרת
                </label>
                <Input
                  id="torah-title"
                  value={torahContent.title}
                  onChange={(e) => setTorahContent(prev => ({ ...prev, title: e.target.value }))}
                  className="rtl text-right"
                  placeholder="הכנס כותרת"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="torah-content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-right">
                  תוכן
                </label>
                <Textarea
                  id="torah-content"
                  value={torahContent.content}
                  onChange={(e) => setTorahContent(prev => ({ ...prev, content: e.target.value }))}
                  className="rtl text-right h-32"
                  placeholder="הכנס את תוכן הלימוד"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleAddTorahContent}>
                הוסף תוכן תורה
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="spiritual-card">
            <CardHeader>
              <CardTitle>הוספת מוטיבציה יומית</CardTitle>
              <CardDescription>הוסף תוכן מוטיבציה יומית חדש למסך הבית</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="motivation-title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-right">
                  כותרת
                </label>
                <Input
                  id="motivation-title"
                  value={motivation.title}
                  onChange={(e) => setMotivation(prev => ({ ...prev, title: e.target.value }))}
                  className="rtl text-right"
                  placeholder="הכנס כותרת"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="motivation-content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block text-right">
                  תוכן
                </label>
                <Textarea
                  id="motivation-content"
                  value={motivation.content}
                  onChange={(e) => setMotivation(prev => ({ ...prev, content: e.target.value }))}
                  className="rtl text-right h-32"
                  placeholder="הכנס את תוכן המוטיבציה"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleAddMotivation}>
                הוסף מוטיבציה יומית
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* New Notifications tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="spiritual-card">
            <CardHeader>
              <CardTitle>פאנל הודעות</CardTitle>
              <CardDescription>שלח הודעות וחיזוקים למשתמשי האפליקציה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="notification-type" className="text-sm font-medium leading-none block text-right">
                  סוג הודעה
                </label>
                <Select
                  value={notification.type}
                  onValueChange={(value) => setNotification(prev => ({ ...prev, type: value as 'encouragement' | 'reminder' }))}
                >
                  <SelectTrigger id="notification-type" className="w-full rtl text-right">
                    <SelectValue placeholder="בחר סוג הודעה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encouragement" className="text-right">חיזוק יומי</SelectItem>
                    <SelectItem value="reminder" className="text-right">תזכורת</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="notification-content" className="text-sm font-medium leading-none block text-right">
                  תוכן ההודעה
                </label>
                <Textarea
                  id="notification-content"
                  value={notification.content}
                  onChange={(e) => setNotification(prev => ({ ...prev, content: e.target.value }))}
                  className="rtl text-right h-32"
                  placeholder="הכנס את תוכן ההודעה"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleAddNotification}>
                {notification.type === 'encouragement' ? 'שלח חיזוק' : 'שלח תזכורת'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card className="spiritual-card">
            <CardHeader>
              <CardTitle>ניהול משתמשים</CardTitle>
              <CardDescription>צפה וערוך פרטי משתמשים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted">
                    <tr>
                      <th className="py-3 px-4 text-right">שם</th>
                      <th className="py-3 px-4 text-right">אימייל</th>
                      <th className="py-3 px-4 text-right">חבילה</th>
                      <th className="py-3 px-4 text-right">כניסה אחרונה</th>
                      <th className="py-3 px-4 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.premium ? 'פרימיום' : 'בסיסי'}</td>
                        <td className="py-3 px-4">{user.lastLogin}</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            ערוך
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
