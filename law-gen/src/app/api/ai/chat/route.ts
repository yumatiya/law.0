import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '../../../../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface ChatContext {
  userId: string
  educationLevel: string
  subject?: string
  chapter?: string
  language: string
  personality: string
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  userStats?: {
    totalBooksRead: number
    totalVideosWatched: number
    totalWatchTime: number
    totalReadingTime: number
  }
  recentActivity?: {
    lastReadChapter?: string
    lastWatchedChapter?: string
    bookmarksCount: number
    completedChapters: number
  }
  bookContent?: string
}

const AI_PERSONALITIES = {
  friendly: {
    systemPrompt: `You are a friendly, patient AI tutor for students from Class 9 to PhD level. Your personality is warm, encouraging, and supportive. You explain concepts clearly and motivate students to learn. Always be positive and use simple language when appropriate.`,
    tone: "warm and encouraging"
  },
  professional: {
    systemPrompt: `You are a professional academic mentor specializing in higher education. You provide structured, in-depth explanations with academic rigor. You focus on critical thinking, research methodology, and advanced concepts.`,
    tone: "professional and academic"
  },
  expert: {
    systemPrompt: `You are an expert legal guide with deep knowledge of law, jurisprudence, and legal practice. You provide authoritative guidance on legal concepts, case law, and professional development for lawyers.`,
    tone: "authoritative and expert"
  },
  motivational: {
    systemPrompt: `You are a motivational coach who inspires students to achieve their goals. You focus on building confidence, time management, study strategies, and overcoming learning challenges.`,
    tone: "inspiring and goal-oriented"
  }
}

const LANGUAGE_PROMPTS = {
  hi: "Respond in Hindi (हिंदी) using simple, clear language. Use Devanagari script.",
  gu: "Respond in Gujarati (ગુજરાતી) using simple, clear language.",
  ta: "Respond in Tamil (தமிழ்) using simple, clear language.",
  te: "Respond in Telugu (తెలుగు) using simple, clear language.",
  mr: "Respond in Marathi (मराठी) using simple, clear language.",
  bn: "Respond in Bengali (বাংলা) using simple, clear language.",
  kn: "Respond in Kannada (ಕನ್ನಡ) using simple, clear language.",
  ml: "Respond in Malayalam (മലയാളം) using simple, clear language.",
  pa: "Respond in Punjabi (ਪੰਜਾਬੀ) using simple, clear language.",
  or: "Respond in Odia (ଓଡ଼ିଆ) using simple, clear language.",
  as: "Respond in Assamese (অসমীয়া) using simple, clear language.",
  ur: "Respond in Urdu (اردو) using clear language.",
  en: "Respond in English using clear, educational language."
}

async function buildContext(userId: string, subject?: string, chapter?: string): Promise<ChatContext> {
  // Get user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      educationLevel: true,
      name: true
    }
  })

  if (!user) throw new Error('User not found')

  // Get user stats
  const userStats = await prisma.userStats.findUnique({
    where: { userId },
    select: {
      totalBooksRead: true,
      totalVideosWatched: true,
      totalWatchTime: true,
      totalReadingTime: true
    }
  })

  // Get recent activity
  const recentWatchHistory = await prisma.watchHistory.findMany({
    where: { userId },
    orderBy: { lastWatched: 'desc' },
    take: 5,
    include: {
      chapter: {
        select: { title: true, book: { select: { title: true } } }
      }
    }
  })

  const recentReadingProgress = await prisma.readingProgress.findMany({
    where: { userId },
    orderBy: { lastRead: 'desc' },
    take: 5,
    include: {
      chapter: {
        select: { title: true, book: { select: { title: true } } }
      }
    }
  })

  const bookmarksCount = await prisma.bookmark.count({
    where: { userId }
  })

  const completedChapters = await prisma.readingProgress.count({
    where: {
      userId,
      completed: true
    }
  }) + await prisma.watchHistory.count({
    where: {
      userId,
      completed: true
    }
  })

  // Get relevant book content if subject/chapter specified
  let bookContent = ''
  if (subject && chapter) {
    const bookChapter = await prisma.chapter.findFirst({
      where: {
        book: {
          subject: {
            name: subject,
            educationLevel: user.educationLevel as any
          }
        },
        title: { contains: chapter }
      },
      select: {
        title: true,
        content: true,
        description: true,
        book: {
          select: {
            title: true,
            subject: { select: { name: true } }
          }
        }
      }
    })

    if (bookChapter) {
      bookContent = `
Book: ${bookChapter.book.title}
Subject: ${bookChapter.book.subject.name}
Chapter: ${bookChapter.title}
Description: ${bookChapter.description || 'N/A'}
Content: ${bookChapter.content || 'Content not available in text format'}
      `.trim()
    }
  }

  return {
    userId,
    educationLevel: user.educationLevel || 'CLASS_9',
    subject,
    chapter,
    language: 'en', // Will be set from request
    personality: 'friendly', // Will be set from request
    conversationHistory: [], // Will be populated from recent messages
    userStats: userStats || undefined,
    recentActivity: {
      lastReadChapter: recentReadingProgress[0]?.chapter.title,
      lastWatchedChapter: recentWatchHistory[0]?.chapter.title,
      bookmarksCount,
      completedChapters
    },
    bookContent
  }
}

async function callAnthropicAPI(context: ChatContext, message: string, imageData?: string): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured')
  }

  const personality = AI_PERSONALITIES[context.personality as keyof typeof AI_PERSONALITIES] || AI_PERSONALITIES.friendly
  const languagePrompt = LANGUAGE_PROMPTS[context.language as keyof typeof LANGUAGE_PROMPTS] || LANGUAGE_PROMPTS.en

  let systemPrompt = `${personality.systemPrompt}

${languagePrompt}

CONTEXT INFORMATION:
- Student Name: ${context.userId} (placeholder - implement user name lookup)
- Education Level: ${context.educationLevel.replace('_', ' ')}
- Current Subject: ${context.subject || 'General'}
- Current Chapter: ${context.chapter || 'General'}
- Learning Progress: ${context.userStats ? `Books Read: ${context.userStats.totalBooksRead}, Videos Watched: ${context.userStats.totalVideosWatched}, Watch Time: ${Math.floor(context.userStats.totalWatchTime / 60)} minutes` : 'New student'}
- Recent Activity: ${context.recentActivity ? `Completed ${context.recentActivity.completedChapters} chapters, ${context.recentActivity.bookmarksCount} bookmarks` : 'No recent activity'}

${context.bookContent ? `RELEVANT BOOK CONTENT:\n${context.bookContent}\n\nUse this content to provide accurate, contextual answers.` : ''}

INSTRUCTIONS:
1. Always be encouraging and supportive
2. Explain concepts clearly with examples
3. Provide practice questions when appropriate
4. Suggest related topics for deeper learning
5. Track student progress and adapt explanations
6. Use the student's native language for better understanding
7. Be available 24/7 like a real mentor
8. Focus on conceptual understanding, not just memorization

RESPONSE FORMAT:
- Start with a brief, encouraging acknowledgment
- Provide clear explanation with examples
- End with 2-3 suggested next steps or questions
- Include related topics when relevant`

  let messages: any[] = []

  if (imageData) {
    messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: message },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageData
            }
          }
        ]
      }
    ]
  } else {
    messages = [
      {
        role: 'user',
        content: message
      }
    ]
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        system: systemPrompt,
        messages: messages
      })
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    console.error('Anthropic API error:', error)
    throw new Error('Failed to get AI response')
  }
}

function extractSuggestions(response: string): string[] {
  // Extract suggested questions/topics from the response
  const suggestions = []
  const lines = response.split('\n')

  for (const line of lines) {
    if (line.toLowerCase().includes('try') ||
        line.toLowerCase().includes('practice') ||
        line.toLowerCase().includes('next') ||
        line.toLowerCase().includes('learn') ||
        line.startsWith('-') ||
        line.startsWith('•')) {
      const cleanLine = line.replace(/^[-•]\s*/, '').trim()
      if (cleanLine.length > 10 && cleanLine.length < 100) {
        suggestions.push(cleanLine)
      }
    }
  }

  return suggestions.slice(0, 3) // Return up to 3 suggestions
}

function extractRelatedTopics(response: string, subject?: string): string[] {
  // Extract related topics mentioned in the response
  const topics = []
  const commonTopics = [
    'algebra', 'geometry', 'calculus', 'physics', 'chemistry', 'biology',
    'history', 'geography', 'civics', 'literature', 'grammar',
    'programming', 'algorithms', 'data structures', 'machine learning',
    'law', 'constitution', 'contracts', 'criminal law', 'civil law'
  ]

  const responseLower = response.toLowerCase()

  for (const topic of commonTopics) {
    if (responseLower.includes(topic) && (!subject || !responseLower.includes(subject.toLowerCase()))) {
      topics.push(topic.charAt(0).toUpperCase() + topic.slice(1))
    }
  }

  return topics.slice(0, 5)
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }

    const decoded = verify(token, JWT_SECRET) as { userId: string }

    const formData = await request.formData()
    const message = formData.get('message') as string
    const userId = formData.get('userId') as string || decoded.userId
    const educationLevel = formData.get('educationLevel') as string
    const language = formData.get('language') as string || 'en'
    const personality = formData.get('personality') as string || 'friendly'
    const subject = formData.get('subject') as string
    const chapter = formData.get('chapter') as string
    const imageFile = formData.get('image') as File

    if (!message && !imageFile) {
      return NextResponse.json(
        { message: "Message or image is required" },
        { status: 400 }
      )
    }

    // Build context
    const context = await buildContext(userId, subject, chapter)
    context.language = language
    context.personality = personality

    // Handle image if provided
    let imageData: string | undefined
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer()
      imageData = Buffer.from(bytes).toString('base64')
    }

    // Save user message to database
    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'user',
        content: message,
        metadata: {
          subject,
          chapter,
          language,
          personality,
          hasImage: !!imageFile
        }
      }
    })

    // Get AI response
    const aiResponse = await callAnthropicAPI(context, message, imageData)

    // Extract metadata
    const suggestions = extractSuggestions(aiResponse)
    const relatedTopics = extractRelatedTopics(aiResponse, subject)

    // Save AI response to database
    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'assistant',
        content: aiResponse,
        metadata: {
          subject,
          chapter,
          language,
          personality,
          suggestions,
          relatedTopics,
          confidence: 0.9
        }
      }
    })

    const metadata = {
      suggestions,
      relatedTopics,
      confidence: 0.9, // Placeholder - could be calculated based on context match
      subject: subject,
      chapter: chapter,
      language: language,
      personality: personality
    }

    return NextResponse.json({
      response: aiResponse,
      metadata
    }, { status: 200 })

  } catch (error) {
    console.error('AI Chat API error:', error)
    return NextResponse.json(
      { message: "Failed to process AI request", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
