import { LLMChain } from "langchain/chains";
import { ChatAnthropic } from "@langchain/anthropic";
import { schoolPrompt, schoolFollowupPrompt } from "../prompts/schoolPrompt";
import { LAWGenContext, ChainConfig, ChainResponse, SessionMemory } from "../types";

// School Mode Chain Implementation
// Uses age-appropriate language and structured learning approach

export class SchoolChain {
  private chain: LLMChain;
  private followupChain: LLMChain;
  private memory: SessionMemory;
  private config: ChainConfig;

  constructor(config: ChainConfig, memory: SessionMemory) {
    this.config = config;
    this.memory = memory;

    // Initialize Anthropic model with school-appropriate settings
    const model = new ChatAnthropic({
      modelName: "claude-3-sonnet-20240229",
      temperature: config.temperature || 0.6,
      maxTokens: config.maxTokens || 2000,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Create main chain for school interactions
    this.chain = new LLMChain({
      llm: model,
      prompt: schoolPrompt,
      memory: this.memory.getMemory(`school-${config.mode}`),
    });

    // Create followup chain for additional guidance
    this.followupChain = new LLMChain({
      llm: model,
      prompt: schoolFollowupPrompt,
    });
  }

  async call(context: LAWGenContext, message: string): Promise<ChainResponse> {
    try {
      // Validate mode isolation
      if (context.mode !== 'school') {
        throw new Error('Invalid mode for SchoolChain');
      }

      // Prepare input variables for the prompt
      const inputVariables = {
        userId: context.userId,
        educationLevel: context.educationLevel,
        subject: context.subject || 'General',
        chapter: context.chapter || 'General',
        userStats: context.userStats
          ? `Books Read: ${context.userStats.totalBooksRead}, Videos Watched: ${context.userStats.totalVideosWatched}, Watch Time: ${Math.floor(context.userStats.totalWatchTime / 60)} minutes`
          : 'New student',
        recentActivity: context.recentActivity
          ? `Completed ${context.recentActivity.completedChapters} chapters, ${context.recentActivity.bookmarksCount} bookmarks`
          : 'No recent activity',
        bookContent: context.bookContent || '',
        language: context.language,
        question: message,
      };

      // Get AI response
      const result = await this.chain.call(inputVariables);

      // Extract suggestions and related topics (simplified for school mode)
      const suggestions = this.extractSuggestions(result.text);
      const relatedTopics = this.extractRelatedTopics(result.text, context.subject);

      // Add to session memory
      this.memory.addToMemory(`school-${context.userId}`, {
        role: 'user',
        content: message,
        timestamp: new Date(),
      });
      this.memory.addToMemory(`school-${context.userId}`, {
        role: 'assistant',
        content: result.text,
        timestamp: new Date(),
      });

      return {
        response: result.text,
        metadata: {
          suggestions,
          relatedTopics,
          confidence: 0.9,
          subject: context.subject,
          chapter: context.chapter,
          language: context.language,
          personality: context.personality,
        },
      };
    } catch (error) {
      console.error('SchoolChain error:', error);
      throw new Error(`School chain processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async followup(question: string, context: string): Promise<string> {
    try {
      const result = await this.followupChain.call({
        question,
        context,
      });
      return result.text;
    } catch (error) {
      console.error('SchoolChain followup error:', error);
      throw new Error('Followup processing failed');
    }
  }

  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    const lines = response.split('\n');

    for (const line of lines) {
      if (line.toLowerCase().includes('try') ||
          line.toLowerCase().includes('practice') ||
          line.toLowerCase().includes('next') ||
          line.toLowerCase().includes('learn') ||
          line.startsWith('-') ||
          line.startsWith('•')) {
        const cleanLine = line.replace(/^[-•]\s*/, '').trim();
        if (cleanLine.length > 10 && cleanLine.length < 100) {
          suggestions.push(cleanLine);
        }
      }
    }

    return suggestions.slice(0, 3);
  }

  private extractRelatedTopics(response: string, subject?: string): string[] {
    const topics: string[] = [];
    const commonTopics = [
      'algebra', 'geometry', 'calculus', 'physics', 'chemistry', 'biology',
      'history', 'geography', 'civics', 'literature', 'grammar',
    ];

    const responseLower = response.toLowerCase();

    for (const topic of commonTopics) {
      if (responseLower.includes(topic) && (!subject || !responseLower.includes(subject.toLowerCase()))) {
        topics.push(topic.charAt(0).toUpperCase() + topic.slice(1));
      }
    }

    return topics.slice(0, 5);
  }
}
