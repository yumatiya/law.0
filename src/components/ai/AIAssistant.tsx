import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ChatMessage } from '@/types';

const AI_PROMPTS = {
  lawyer: `You are an AI legal assistant with comprehensive knowledge of Indian law. Your role is to provide detailed, accurate, and conversational explanations of any legal provision. This includes the entire Indian Constitution and all laws such as the IPC, CrPC, CPC, and every specific section (e.g., 302, 402, etc.). When a user asks about any legal concept, provision, or case, provide an explanation as if you are a seasoned legal professional. Ensure that your responses are detailed, accurate, and tailored to the user's query, just like a real legal advisor.`,
  
  school: `You are an AI tutor for school students (grades 1–12) in India. Your role is to provide clear, detailed, and easy-to-understand explanations for all NCERT subjects in every Indian language. When a student asks a question, respond in a friendly, conversational manner, just like a personal tutor. Provide step-by-step solutions and ensure the explanation is comprehensive and supportive.`,
  
  college: `You are an AI academic assistant for college students across all streams (BA, BSc, BCom, BBA, BTech, MCA, MBA, MTech, LLB, LLM, Pharmacy, Medical, Nursing, etc.). Your role is to help with academic queries, project guidance, viva preparation, and past paper analysis. Respond in a supportive, detailed, and conversational way, just like a knowledgeable mentor.`
};

const generateAIResponse = (message: string, profile: string): ChatMessage => {
  const prompt = AI_PROMPTS[profile as keyof typeof AI_PROMPTS] || AI_PROMPTS.school;
  
  const responses = {
    lawyer: {
      greeting: "Namaste! I'm your AI legal assistant. I can help you understand Indian laws, draft documents, analyze cases, and even simulate courtroom scenarios. What legal matter would you like to discuss today?",
      response: (msg: string) => `**Legal Analysis for: "${msg}"**

**Issue Identification:**
The query relates to ${msg.toLowerCase()}. Let me break this down legally:

**Applicable Law:**
• Relevant statutes: IPC, CrPC, CPC, or Constitutional provisions
• Key sections and articles that apply
• Recent amendments or notifications

**Legal Precedents:**
• Supreme Court landmark judgments
• High Court decisions
• Legal principles established

**Practical Application:**
Step-by-step legal procedure and documentation required.

**Courtroom Strategy:**
If this were a court case, here's how I'd approach it...

Would you like me to:
1. Draft related legal documents
2. Start a mock court session
3. Find more case precedents
4. Explain specific statutes in detail?`
    },
    
    school: {
      greeting: "नमस्ते! मैं आपका AI शिक्षा सहायक हूँ। मैं NCERT के सभी विषयों में हिंदी, अंग्रेजी और अन्य भारतीय भाषाओं में मदद कर सकता हूँ। आज आप क्या सीखना चाहते हैं?",
      response: (msg: string) => `**${msg} का Step-by-Step समाधान:**

**चरण 1: समस्या की पहचान**
${msg} में मुख्य concept यह है...

**चरण 2: Formula/Theory**
प्रासंगिक सूत्र या सिद्धांत:
• मुख्य नियम
• Important points

**चरण 3: हल करना**
विस्तृत solution के साथ explanation

**चरण 4: Verification**
Answer check करना और similar problems

**NCERT Reference:** Class [X], Chapter [Y]
**भाषा सहायता:** हिंदी, English, Gujarati में उपलब्ध

क्या आप चाहते हैं:
1. अधिक practice questions
2. Concept explanation
3. Previous year papers
4. Quick revision notes?`
    },
    
    college: {
      greeting: "Hello! I'm your AI college mentor. I specialize in all streams - Engineering, Medical, Commerce, Arts, Law, Management, and more. Ready to help with studies, projects, viva prep, and career guidance!",
      response: (msg: string) => `**Academic Analysis: "${msg}"**

**Subject Context:**
Relevant to your stream and semester requirements

**Detailed Explanation:**
• Core concepts and theory
• Practical applications
• Industry relevance

**Project/Assignment Help:**
• Research methodology
• Reference materials
• Structure and format

**Viva Preparation:**
Potential questions and model answers

**Career Connection:**
How this knowledge applies in your future profession

**Resources:**
• University syllabus alignment
• Reference books and papers
• Online resources

Would you like help with:
1. Assignment completion
2. Project planning
3. Viva preparation
4. Career guidance
5. Past paper analysis?`
    }
  };

  const profileResponses = responses[profile as keyof typeof responses] || responses.school;
  
  return {
    id: Date.now().toString(),
    content: profileResponses.response(message),
    isBot: true,
    timestamp: new Date(),
    messageType: 'step-solution',
    sources: [
      {
        type: profile === 'school' ? 'ncert' : profile === 'college' ? 'ugc' : 'statute',
        title: profile === 'lawyer' ? 'Legal Database' : profile === 'school' ? 'NCERT Textbook' : 'University Syllabus',
        chapter: 'Reference Material'
      }
    ]
  };
};

export { generateAIResponse, AI_PROMPTS };