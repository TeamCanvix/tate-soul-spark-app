
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share, Bookmark } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const defaultMessage = {
  title: 'מחשבה יומית',
  content: 'תזכור, כל יום הוא הזדמנות להתקרב עוד קצת.',
  date: new Date().toISOString(),
};

const Torah = () => {
  const { data: torahSnippet, isLoading } = useQuery({
    queryKey: ['torahSnippet', new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('torah_snippets')
        .select('*')
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching Torah snippet:', error);
        throw error;
      }

      return data || defaultMessage;
    },
  });

  const handleShare = () => {
    if (torahSnippet) {
      const text = `${torahSnippet.title}\n\n${torahSnippet.content}\n\n- מתוך אפליקציית טאטע`;
      navigator.clipboard.writeText(text);
      toast({
        title: "הועתק ללוח",
        description: "התוכן הועתק ללוח. כעת תוכל להדביק אותו בכל מקום.",
      });
    }
  };

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">20 שניות תורה</h1>
        <p className="text-spiritual-dark mt-2">לימוד יומי קצר ומשמעותי</p>
      </div>

      {isLoading ? (
        <Card className="spiritual-card animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      ) : (
        <Card className="spiritual-card">
          <CardHeader>
            <CardTitle>{torahSnippet?.title}</CardTitle>
            <CardDescription>
              לימוד יומי - {new Date(torahSnippet?.date || '').toLocaleDateString('he-IL')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{torahSnippet?.content}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              שתף
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Torah;
