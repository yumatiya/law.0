import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function chatWithClaude(message: string, context?: string): Promise<string> {
  try {
    const systemPrompt = context
      ? `You are a helpful AI assistant for legal education. Use the following context to inform your response: ${context}`
      : 'You are a helpful AI assistant for legal education. Provide accurate, helpful responses about legal concepts, education, and related topics.';

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to get response from Claude');
  }
}

export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI embeddings error:', error);
    throw new Error('Failed to generate embeddings');
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // This would use OpenAI Whisper or similar service
    // Simplified implementation
    return 'Transcribed text from audio';
  } catch (error) {
    console.error('Audio transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function textToSpeech(text: string): Promise<Buffer> {
  try {
    // This would use a TTS service like OpenAI TTS or ElevenLabs
    // Simplified implementation
    return Buffer.from('audio data');
  } catch (error) {
    console.error('Text-to-speech error:', error);
    throw new Error('Failed to generate speech');
  }
}

export async function analyzeDocumentOCR(imageBuffer: Buffer): Promise<string> {
  try {
    // This would use OCR service like Google Vision AI or Tesseract
    // Simplified implementation
    return 'Extracted text from document';
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('Failed to analyze document');
  }
}
