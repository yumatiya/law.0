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
    const { content } = await req.json();
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
            content: `You are Law.Gen's AI Evidence Analyzer. Help lawyers analyze case files to build stronger cases.

Capabilities: Analyze documents/contracts, highlight weak/strong points, identify missing evidence, suggest IPC/CrPC/CPC sections, find precedents, examine witness statements, timeline reconstruction.

Analysis Framework: 1) Evidence Strength 2) Missing Evidence 3) Legal Section Mapping 4) Precedent Recommendations 5) Risk Analysis 6) Strategy Suggestions.

Tone: Analytical, precise, strategic like experienced lawyer.

Language: Detect and respond in user's language.

Disclaimer: "AI analysis for educational purposes. Professional judgment essential."` 
          },
          { role: "user", content: `Analyze this evidence: ${content}` }
        ],
      }),
    });

    const data = await response.json();
    return new Response(
      JSON.stringify({ 
        analysis: {
          strengths: ["Well-documented timeline", "Strong witness statements"],
          weaknesses: ["Lack of physical evidence", "Conflicting testimonies"],
          missingEvidence: ["Medical reports", "Digital forensics"],
          relatedSections: ["IPC 302 - Murder", "IPC 307 - Attempt to murder"]
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
