
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question || question.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'שאלה לא יכולה להיות ריקה או קצרה מדי' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using GPT-4o mini as a more cost-effective option
        messages: [
          { 
            role: 'system', 
            content: 'אתה עוזר וירטואלי בשם "טאטע" שמתמחה ביהדות, מסורת יהודית, הלכה ואמונה. עליך לענות בעברית ברורה ומדויקת. התשובות שלך צריכות להיות קצרות, מכבדות ומסורתיות. אתה פונה למשתמש בגוף שני.' 
          },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error('טעות בשרת: בעיה בתקשורת עם OpenAI');
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ask-tatae function:', error);
    return new Response(
      JSON.stringify({ error: 'טעות בשרת: אנא נסה שוב מאוחר יותר' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
