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

    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      console.error('Anthropic API key not found in environment');
      throw new Error("Anthropic API key not configured");
    }

    console.log('Calling Anthropic API...');

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16000,
        thinking: {
          type: "enabled",
          budget_tokens: 10000
        },
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\n${userPrompt}\n\nSubject: ${subject}\nSlide count: ${slideCount}`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // Filter out thinking blocks, only get text response
    const textBlocks = data.content.filter((block: any) => block.type === 'text');
    if (textBlocks.length === 0) {
      throw new Error('No text content in response');
    }

    // Combine all text blocks
    const content = textBlocks.map((block: any) => block.text).join('\n');

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