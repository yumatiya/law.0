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
    const { situation } = await req.json();
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
            content: `You are Law.Gen's AI Rights Guardian — protecting citizens' rights using AI.

Purpose: Explain fundamental rights, constitutional protections, guide on legal remedies when violated.

Capabilities: Rights under Constitution (Fundamental Rights, DPSP), what to do if violated, legal steps to file complaints (IPC/CrPC), rights of women/children/minorities, consumer/labor rights, police procedures, approach courts/file PILs.

Tone: Empowering, compassionate, clear.

Language: Detect and respond in user's language.

Social Impact: Protect citizens' rights.

Disclaimer: "Educational. For legal action, consult lawyer/legal aid."` 
          },
          { role: "user", content: situation }
        ],
      }),
    });

    const data = await response.json();
    return new Response(
      JSON.stringify({ analysis: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
