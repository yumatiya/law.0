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
    const { text, mode, bookTitle } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === 'explain') {
      systemPrompt = `You are an expert educational AI assistant for LAW.GEN digital library. Your role is to explain legal concepts, laws, and academic topics in simple, clear language. 

Focus on:
- Breaking down complex legal terminology
- Providing real-world examples
- Explaining the practical implications
- Using simple language suitable for students
- Connecting to Indian legal context when relevant

Keep explanations concise but thorough (200-300 words).`;
      userPrompt = `Book: ${bookTitle}\n\nPlease explain this text in simple terms:\n\n"${text}"`;
    } else if (mode === 'summary') {
      systemPrompt = `You are an expert summarization AI for LAW.GEN digital library. Create concise, accurate summaries that capture key points.

Focus on:
- Main concepts and ideas
- Key legal principles or facts
- Important dates, cases, or sections (if applicable)
- Bullet points for clarity

Keep summaries to 150-200 words.`;
      userPrompt = `Book: ${bookTitle}\n\nPlease provide a summary of this text:\n\n"${text}"`;
    } else if (mode === 'quiz') {
      systemPrompt = `You are an expert quiz generator for LAW.GEN digital library. Create thoughtful multiple-choice questions to test understanding.

Format:
Question 1: [Question text]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
Correct Answer: [Letter]

Generate 3-5 questions based on the complexity of the text.`;
      userPrompt = `Book: ${bookTitle}\n\nCreate quiz questions based on this text:\n\n"${text}"`;
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ebook-ai-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
