import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '../../../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }

    const decoded = verify(token, JWT_SECRET) as { userId: string }
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')

    if (!subjectId) {
      return NextResponse.json(
        { message: "Subject ID is required" },
        { status: 400 }
      )
    }

    const books = await prisma.book.findMany({
      where: {
        subjectId: subjectId,
        isActive: true
      },
      include: {
        _count: {
          select: { chapters: true }
        },
        chapters: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            order: true,
            watchHistory: {
              where: { userId: decoded.userId },
              select: { completed: true }
            },
            readingProgress: {
              where: { userId: decoded.userId },
              select: { completed: true }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { title: 'asc' }
    })

    // Calculate progress for each book
    const booksWithProgress = books.map(book => {
      const totalChapters = book.chapters.length
      const completedChapters = book.chapters.filter(chapter =>
        chapter.watchHistory.some(h => h.completed) ||
        chapter.readingProgress.some(p => p.completed)
      ).length

      return {
        ...book,
        progress: totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0,
        completedChapters,
        totalChapters
      }
    })

    return NextResponse.json({ books: booksWithProgress }, { status: 200 })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
