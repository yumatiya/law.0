import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, businessType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are Law.Gen's AI Legal Startup Builder. Help users create legal startups from ideation to compliance.

Capabilities: Business registration, draft partnership deeds/MoA/AoA/NDA, suggest business names/legal structure, branding, IP guidance, funding docs, employment contracts, tax registration.

Tone: Entrepreneurial, supportive, step-by-step guidance.

Language: Detect and respond in user's language.

Disclaimer: "Educational purposes. Consult CA/CS for official registration."` 
          },
          { 
            role: "user", 
            content: `Generate a Memorandum of Association for ${businessName} (${businessType})` 
          }
        ],
      }),
    });

    const data = await response.json();
    return new Response(
      JSON.stringify({ 
        documents: {
          moa: data.choices[0].message.content,
          partnership: "Partnership deed template...",
          nda: "NDA template..."
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
