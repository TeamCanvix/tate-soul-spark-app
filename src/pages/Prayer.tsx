
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Prayer as PrayerType } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';

const Prayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch prayer data
  const { data: prayer, isLoading, error } = useQuery({
    queryKey: ['prayer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as PrayerType;
    }
  });

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: "שגיאה בטעינת התפילה",
        description: "אירעה שגיאה בטעינת התפילה. אנא נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    }
  }, [error]);

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={() => navigate('/prayers')}
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          חזרה לתפילות
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            אירעה שגיאה בטעינת התפילה. אנא נסה שוב מאוחר יותר.
          </AlertDescription>
        </Alert>
      ) : prayer ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-spiritual-dark rtl">{prayer.hebrewName}</h1>
          
          <ScrollArea className="h-[50vh]">
            <div className="prayer-text" dir="rtl">
              {prayer.content}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-muted-foreground">התפילה תעודכן בקרוב בעזרת השם</p>
        </div>
      )}
    </div>
  );
};

export default Prayer;
