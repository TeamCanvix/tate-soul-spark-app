
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DailyContent } from '@/types';
import { Share, Bookmark } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const torahContentSamples = [
  {
    id: '1',
    date: '2025-04-27',
    title: 'אהבת ישראל',
    content: 'אמר רבי עקיבא: "ואהבת לרעך כמוך" - זה כלל גדול בתורה. כל יהודי הוא אח, וכשם שאחים אוהבים זה את זה למרות חילוקי דעות, כך עלינו לאהוב כל יהודי באשר הוא.',
    type: 'torah' as const
  },
  {
    id: '2',
    date: '2025-04-28',
    title: 'חשיבות התפילה',
    content: 'אמר רבי שמעון: תפילה היא עבודת הלב. כשאדם מתפלל בכוונה אמיתית ובמיקוד מלא, תפילתו עולה למעלה ופועלת את פעולתה בעולמות העליונים.',
    type: 'torah' as const
  },
  {
    id: '3',
    date: '2025-04-29',
    title: 'חשיבות לימוד התורה',
    content: 'אמר רבי יהושע בן לוי: "בכל יום ויום בת קול יוצאת מהר חורב ומכרזת ואומרת: אוי להם לבריות מעלבונה של תורה". לימוד התורה הוא חיינו ואורך ימינו.',
    type: 'torah' as const
  },
  {
    id: '4',
    date: '2025-04-30',
    title: 'ענווה ושפלות רוח',
    content: 'אמר רבי לוי יצחק מברדיטשוב: "לעולם יהא אדם רך כקנה ואל יהא קשה כארז". הענווה היא מידה חשובה, ודוקא דרכה אדם יכול להתקרב לקב״ה.',
    type: 'torah' as const
  },
  {
    id: '5',
    date: '2025-05-01',
    title: 'שמחה בעבודת השם',
    content: 'אמר רבי נחמן מברסלב: "מצווה גדולה להיות בשמחה תמיד". השמחה פורצת גדרים ומאפשרת לאדם להתעלות מעל מגבלותיו ולהתקרב לקב״ה.',
    type: 'torah' as const
  },
];

const Torah = () => {
  const [currentTorahContent, setCurrentTorahContent] = useState<DailyContent | null>(null);
  const [savedContents, setSavedContents] = useState<string[]>([]);

  // Get a daily Torah content based on the current date
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use a sample based on the day of the month
    const day = new Date().getDate() % torahContentSamples.length;
    setCurrentTorahContent(torahContentSamples[day]);
    
    // Load saved contents from localStorage
    const saved = localStorage.getItem('tate-saved-torah');
    if (saved) {
      try {
        setSavedContents(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved Torah contents:', error);
      }
    }
  }, []);

  const handleSaveContent = (id: string) => {
    const newSavedContents = [...savedContents];
    
    if (savedContents.includes(id)) {
      // Remove from saved
      const index = newSavedContents.indexOf(id);
      newSavedContents.splice(index, 1);
      toast({
        title: "הוסר מהשמורים",
        description: "התוכן הוסר מהפריטים השמורים שלך",
      });
    } else {
      // Add to saved
      newSavedContents.push(id);
      toast({
        title: "נשמר",
        description: "התוכן נשמר ברשימת הפריטים השמורים שלך",
      });
    }
    
    setSavedContents(newSavedContents);
    localStorage.setItem('tate-saved-torah', JSON.stringify(newSavedContents));
  };

  const handleShareContent = () => {
    // In a real app, this would open a share dialog
    // For now, we'll just copy to clipboard
    if (currentTorahContent) {
      const text = `${currentTorahContent.title}\n\n${currentTorahContent.content}\n\n- מתוך אפליקציית טאטע`;
      navigator.clipboard.writeText(text);
      toast({
        title: "הועתק ללוח",
        description: "התוכן הועתק ללוח. כעת תוכל להדביק אותו בכל מקום.",
      });
    }
  };

  const isPreviouslySaved = currentTorahContent && savedContents.includes(currentTorahContent.id);

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">20 שניות תורה</h1>
        <p className="text-spiritual-dark mt-2">לימוד יומי קצר ומשמעותי</p>
      </div>

      {currentTorahContent && (
        <Card className="spiritual-card">
          <CardHeader>
            <CardTitle>{currentTorahContent.title}</CardTitle>
            <CardDescription>לימוד יומי - {new Date().toLocaleDateString('he-IL')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{currentTorahContent.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => handleSaveContent(currentTorahContent.id)}
              className="flex items-center gap-2"
            >
              <Bookmark className={`h-4 w-4 ${isPreviouslySaved ? 'fill-spiritual-secondary' : ''}`} />
              {isPreviouslySaved ? 'הוסר מהשמורים' : 'שמור'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShareContent}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              שתף
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-spiritual-dark">לימודים קודמים</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {torahContentSamples
            .filter(content => content.id !== currentTorahContent?.id)
            .slice(0, 4)
            .map(content => (
              <Card key={content.id} className="spiritual-card">
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{content.content}</p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveContent(content.id)}
                    className="flex items-center gap-2"
                  >
                    <Bookmark className={`h-4 w-4 ${savedContents.includes(content.id) ? 'fill-spiritual-secondary' : ''}`} />
                    {savedContents.includes(content.id) ? 'הוסר מהשמורים' : 'שמור'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Torah;
