
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Prayers = () => {
  const navigate = useNavigate();

  const prayers = [
    {
      id: 'shacharit',
      name: 'שחרית',
      description: 'תפילת הבוקר',
      time: 'מהנץ החמה עד סוף שליש היום',
      path: '/prayers/shacharit'
    },
    {
      id: 'mincha',
      name: 'מנחה',
      description: 'תפילת אחר הצהריים',
      time: 'מחצי היום עד השקיעה',
      path: '/prayers/mincha'
    },
    {
      id: 'maariv',
      name: 'ערבית',
      description: 'תפילת הערב',
      time: 'מצאת הכוכבים',
      path: '/prayers/maariv'
    },
    {
      id: 'tefillin',
      name: 'תפילין',
      description: 'הנחת תפילין',
      time: 'במהלך תפילת שחרית',
      path: '/prayers/tefillin'
    }
  ];

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">תפילות</h1>
        <p className="text-spiritual-dark mt-2">תפילות לאורך היום</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prayers.map((prayer) => (
          <Card 
            key={prayer.id} 
            className="spiritual-card hover:bg-spiritual-light transition-colors cursor-pointer"
            onClick={() => navigate(prayer.path)}
          >
            <CardHeader>
              <CardTitle>{prayer.name}</CardTitle>
              <CardDescription>{prayer.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">זמן תפילה: {prayer.time}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate(prayer.path)}>
                פתח תפילה
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Prayers;
