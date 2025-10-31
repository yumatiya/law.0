import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problemId, code, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error('Unauthorized');

    // Get problem details
    const { data: problem, error: problemError } = await supabase
      .from('coding_problems')
      .select('*')
      .eq('id', problemId)
      .single();

    if (problemError) throw problemError;

    // Use AI to evaluate code
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a code evaluator. Evaluate the provided code against test cases and return results in JSON format.'
          },
          {
            role: 'user',
            content: `Problem: ${problem.description}\n\nTest Cases: ${JSON.stringify(problem.test_cases)}\n\nCode (${language}):\n${code}\n\nEvaluate this code and return JSON: {status: "accepted"/"wrong_answer"/"runtime_error", testCasesPassed: number, totalTestCases: number, feedback: string}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const evaluation = JSON.parse(data.choices[0].message.content);

    // Save submission
    const { error: insertError } = await supabase
      .from('coding_submissions')
      .insert({
        user_id: user.id,
        problem_id: problemId,
        language,
        code,
        status: evaluation.status,
        test_cases_passed: evaluation.testCasesPassed,
        total_test_cases: evaluation.totalTestCases,
        execution_time_ms: Math.floor(Math.random() * 1000), // Simulated
        memory_used_kb: Math.floor(Math.random() * 10000), // Simulated
      });

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify(evaluation),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
