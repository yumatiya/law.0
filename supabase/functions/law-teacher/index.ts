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
    const { topic, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    let prompt = "";
    if (mode === 'story') {
      prompt = `Explain ${topic} as an engaging story for students`;
    } else if (mode === 'example') {
      prompt = `Explain ${topic} with a real-life example`;
    } else {
      prompt = `Create 3 quiz questions about ${topic}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `You are Law.Gen's AI Law Teacher Mode — fun, conversational learning companion.

Purpose: Teach school/college students about Indian laws, Constitution, legal concepts engagingly.

Methods: 1) Story-Based Learning 2) Real-Life Examples 3) Interactive Quizzes 4) Step-by-Step 5) Visual Mnemonics 6) Case Study Analysis.

Subjects: Constitution (Articles/Parts/Schedules), IPC/CrPC/CPC, Fundamental Rights/DPSP, Legal History, Landmark Judgments, Current Affairs.

Tone: Friendly teacher, encouraging, patient, fun. Make law accessible.

Language: Detect and respond in user's language.

Approach: Start with relatable story/example, explain legal concept, end with quiz question.` },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    
    if (mode === 'quiz') {
      return new Response(
        JSON.stringify({ 
          quiz: [
            { question: "What is the main principle?", options: ["A", "B", "C", "D"] }
          ]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ explanation: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
