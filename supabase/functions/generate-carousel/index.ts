import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CarouselRequest {
  systemPrompt: string;
  userPrompt: string;
  subject: string;
  slideCount: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { systemPrompt, userPrompt, subject, slideCount }: CarouselRequest = await req.json();

    console.log('Received request for:', subject);

    const openrouterApiKey = Deno.env.get("OPENROUTER_API_KEY");
    if (!openrouterApiKey) {
      console.error('OpenRouter API key not found in environment');
      throw new Error("OpenRouter API key not configured");
    }

    console.log('Calling OpenRouter API...');

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openrouterApiKey}`,
        "HTTP-Referer": "https://carousel-generator.app",
        "X-Title": "Carousel Generator"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `${userPrompt}\n\nSubject: ${subject}\nSlide count: ${slideCount}`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenRouter API');
    }

    const content = data.choices[0].message.content;

    console.log('Successfully generated content');

    return new Response(
      JSON.stringify({ content }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
