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
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      // הגדרת תחילת היום (00:00) וסוף היום (23:59)
      const startOfDay = `${year}-${month}-${day}T00:00:00`;
      const endOfDay = `${year}-${month}-${day}T23:59:59`;

      const { data, error } = await supabase
        .from('torah_snippets')
        .select('*')
        .gte('date', startOfDay)
        .lt('date', endOfDay)
        .order('date', { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
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

  const handleAddTorahContent = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const { error } = await supabase.from('torah_snippets').insert([
        {
          title: torahContent.title,
          content: torahContent.content,
          date: formattedDate,
          created_by: user?.id || null,
        },
      ]);

      if (error) {
        toast({
          title: "שגיאה בהוספה",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "התווסף בהצלחה!",
        description: "התוכן נוסף ל-20 שניות תורה.",
      });

      setTorahContent({ title: '', content: '' });
    } catch (err: any) {
      toast({
        title: "שגיאה לא צפויה",
        description: err.message,
        variant: "destructive",
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
