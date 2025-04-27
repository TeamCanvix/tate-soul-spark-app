
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "תשלום התקבל",
        description: "החשבון שלך שודרג בהצלחה לחבילת פרימיום!",
      });
      
      navigate('/profile');
    }, 2000);
  };

  return (
    <div className="space-y-6 rtl animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-spiritual-dark">שדרוג חשבון</h1>
        <p className="text-spiritual-dark mt-2">בחר את חבילת הפרימיום המתאימה לך</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <Card className="spiritual-card">
            <CardHeader>
              <CardTitle>יתרונות חבילת פרימיום</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-right list-disc list-inside">
                <li>גישה למאמרים מתקדמים</li>
                <li>צ'אט AI ללא הגבלה</li>
                <li>שיעורים ייעודיים</li>
                <li>אפשרויות התאמה אישית</li>
                <li>תמיכה בפיתוח האפליקציה</li>
                <li>תרומה לקהילה</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <form onSubmit={handlePayment}>
            <Card className="spiritual-card">
              <CardHeader>
                <CardTitle>בחר תוכנית</CardTitle>
                <CardDescription>כל התוכניות כוללות את כל יתרונות הפרימיום</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <Label htmlFor="monthly" className="flex flex-col">
                      <span className="font-medium">חודשי</span>
                      <span className="text-muted-foreground text-sm">₪29.90 לחודש</span>
                    </Label>
                    <RadioGroupItem value="monthly" id="monthly" />
                  </div>
                  <div className="flex items-center justify-between border p-4 rounded-md bg-spiritual-light border-spiritual-accent">
                    <Label htmlFor="yearly" className="flex flex-col">
                      <span className="font-medium">שנתי</span>
                      <span className="text-muted-foreground text-sm">₪249 לשנה (חיסכון של ₪110)</span>
                    </Label>
                    <RadioGroupItem value="yearly" id="yearly" />
                  </div>
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <Label htmlFor="lifetime" className="flex flex-col">
                      <span className="font-medium">לכל החיים</span>
                      <span className="text-muted-foreground text-sm">₪599 חד פעמי</span>
                    </Label>
                    <RadioGroupItem value="lifetime" id="lifetime" />
                  </div>
                </RadioGroup>
                
                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-center text-sm">תשלום מאובטח באמצעות CardCom</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                      <div className="space-y-2">
                        <Input placeholder="מספר כרטיס" className="rtl text-right" />
                      </div>
                      <div className="flex gap-4">
                        <Input placeholder="תוקף (MM/YY)" className="rtl text-right" />
                        <Input placeholder="CVV" className="rtl text-right" />
                      </div>
                      <div>
                        <Input placeholder="שם בעל הכרטיס" className="rtl text-right" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "מעבד תשלום..." : "שלם ושדרג"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>התשלום מאובטח ומוצפן. ניתן לבטל את המנוי בכל עת.</p>
        <p>לשאלות או בירורים, ניתן לפנות אלינו בדוא"ל: support@tate-app.com</p>
      </div>
    </div>
  );
};

export default Payment;
