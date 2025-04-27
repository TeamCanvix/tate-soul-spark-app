
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyContent } from '@/types';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dailyMotivationSamples = [
  {
    id: '1',
    date: '2025-04-27',
    title: 'אמונה יומית',
    content: 'תמיד תזכור שהקב״ה נמצא איתך בכל צעד ושעל. הוא מלווה אותך בכל רגע ומחזק אותך בכל אתגר.',
    type: 'motivation' as const
  },
  {
    id: '2',
    date: '2025-04-28',
    title: 'מחשבה יומית',
    content: 'אל תסתכל על העולם רק דרך העיניים שלך, אלא גם דרך הלב שלך. כך תראה את האמת האמיתית.',
    type: 'motivation' as const
  },
  {
    id: '3',
    date: '2025-04-29',
    title: 'חיזוק יומי',
    content: 'הצעד הראשון לקראת הצלחה הוא האמונה שאתה יכול. זכור שהקב״ה נתן לך את כל הכלים להצליח.',
    type: 'motivation' as const
  }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dailyMotivation, setDailyMotivation] = useState<DailyContent | null>(null);

  // Get a daily motivation based on the current date
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use a sample based on the day of the month
    const day = new Date().getDate() % dailyMotivationSamples.length;
    setDailyMotivation(dailyMotivationSamples[day]);
  }, []);

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">ברוך שובך, {user?.displayName || 'חבר יקר'}</h1>
        <p className="text-spiritual-dark mt-2">אנו שמחים לראות אותך שוב באפליקציית טאטע</p>
      </div>

      {dailyMotivation && (
        <Card className="spiritual-card">
          <CardHeader>
            <CardTitle>{dailyMotivation.title}</CardTitle>
            <CardDescription>מחשבה יומית לחיזוק הנשמה</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{dailyMotivation.content}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="spiritual-card hover:bg-spiritual-light transition-colors cursor-pointer" onClick={() => navigate('/prayers')}>
          <CardHeader>
            <CardTitle>תפילות</CardTitle>
            <CardDescription>שחרית, מנחה, ערבית ותפילין</CardDescription>
          </CardHeader>
          <CardContent>
            <p>גש לתפילות היומיות שלך בצורה נוחה ומסודרת.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">לתפילות</Button>
          </CardFooter>
        </Card>

        <Card className="spiritual-card hover:bg-spiritual-light transition-colors cursor-pointer" onClick={() => navigate('/torah')}>
          <CardHeader>
            <CardTitle>20 שניות תורה</CardTitle>
            <CardDescription>לימוד קצר ויומי</CardDescription>
          </CardHeader>
          <CardContent>
            <p>הקדש 20 שניות ללימוד תורה יומי קצר ומשמעותי.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">ללימוד היומי</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="spiritual-card">
        <CardHeader>
          <CardTitle>צ'אט עם טאטע</CardTitle>
          <CardDescription>שאל שאלות ברוחניות וקבל תשובות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <Button onClick={() => navigate('/chat')} className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>התחל צ'אט חדש</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
