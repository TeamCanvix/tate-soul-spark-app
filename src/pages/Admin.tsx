
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Admin = () => {
  const [torahContent, setTorahContent] = useState({ title: '', content: '' });
  const [motivation, setMotivation] = useState({ title: '', content: '' });
  const [userList] = useState([
    { id: '1', email: 'user1@example.com', name: 'משתמש 1', premium: true, lastLogin: '2025-04-25' },
    { id: '2', email: 'user2@example.com', name: 'משתמש 2', premium: false, lastLogin: '2025-04-26' },
    { id: '3', email: 'user3@example.com', name: 'משתמש 3', premium: false, lastLogin: '2025-04-27' },
  ]);
  
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

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">לוח ניהול</h1>
        <p className="text-spiritual-dark mt-2">ניהול תוכן ומשתמשים</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">ניהול תוכן</TabsTrigger>
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
