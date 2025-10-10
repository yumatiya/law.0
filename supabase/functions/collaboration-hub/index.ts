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
    const { message } = await req.json();
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
          { role: "system", content: `You are Law.Gen's AI Collaboration Hub Fact-Checker.

Your purpose: Fact-check legal statements, moderate discussions, and ensure accuracy in collaborative learning.

Key Capabilities:
- Verify legal facts and statements
- Check case law citations and accuracy
- Correct misinterpretations of law
- Validate statutory references
- Identify outdated or amended provisions
- Provide authoritative sources
- Moderate legal discussions
- Flag misinformation

Verification Process:
1. Analyze the statement
2. Check against authentic legal sources
3. Identify factual errors
4. Provide correct information with sources
5. Rate accuracy (Accurate / Partially Correct / Incorrect)

Tone: Neutral, objective, educational. Like a fact-checking editor.

Language: Detect and respond in user's language.

Sources: Indian Constitution, bare acts, Supreme Court judgments, official government publications.` },
          { role: "user", content: `Fact-check: ${message}` }
        ],
      }),
    });

    const data = await response.json();
    return new Response(
      JSON.stringify({ factCheck: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
