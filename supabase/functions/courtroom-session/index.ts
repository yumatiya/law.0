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
    const { action } = await req.json();
    
    if (action === 'start') {
      return new Response(
        JSON.stringify({ 
          intro: "नमस्ते | Welcome to Law.Gen AI Courtroom Simulation 2.0. This is a voice-interactive courtroom where you can practice with AI Judge, AI Lawyers, and receive real-time feedback. Court is now in session. AI Judge presiding. Please state your case, role (Judge, Prosecutor, Defense, Witness, Observer), or begin your argument. The system will provide objections, verdicts, and performance feedback in real-time. You may speak in any Indian language." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
