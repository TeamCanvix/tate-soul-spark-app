
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Prayer } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';

const Prayers = () => {
  const navigate = useNavigate();

  // Fetch prayers data
  const { data: prayers, isLoading, error } = useQuery({
    queryKey: ['prayers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: "שגיאה בטעינת התפילות",
          description: "אירעה שגיאה בטעינת רשימת התפילות. אנא נסה שוב מאוחר יותר.",
          variant: "destructive"
        });
        throw new Error(error.message);
      }
      
      // Transform the data to match our Prayer type
      return data.map(item => ({
        id: item.id,
        name: item.name,
        hebrewName: item.hebrew_name,
        content: item.content
      })) as Prayer[];
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 rtl animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-spiritual-dark">תפילות</h1>
          <p className="text-spiritual-dark mt-2">תפילות לאורך היום</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="spiritual-card">
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 rtl animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-spiritual-dark">תפילות</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            אירעה שגיאה בטעינת רשימת התפילות. אנא נסה שוב מאוחר יותר.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">תפילות</h1>
        <p className="text-spiritual-dark mt-2">תפילות לאורך היום</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(prayers && prayers.length > 0) ? (
          prayers.map((prayer) => (
            <Card 
              key={prayer.id} 
              className="spiritual-card hover:bg-spiritual-light transition-colors cursor-pointer"
              onClick={() => navigate(`/prayers/${prayer.id}`)}
            >
              <CardHeader>
                <CardTitle>{prayer.hebrewName}</CardTitle>
                <CardDescription>{prayer.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2">{prayer.content.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate(`/prayers/${prayer.id}`)}>
                  פתח תפילה
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-xl text-muted-foreground">התפילות תעודכנה בקרוב בעזרת השם</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;
