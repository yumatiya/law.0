import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '../../../../lib/prisma'

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

    // Get or create user stats
    let stats = await prisma.userStats.findUnique({
      where: { userId: decoded.userId },
    })

    if (!stats) {
      stats = await prisma.userStats.create({
        data: {
          userId: decoded.userId,
        },
      })
    }

    // Get additional stats
    const watchHistory = await prisma.watchHistory.findMany({
      where: { userId: decoded.userId },
    })

    const readingProgress = await prisma.readingProgress.findMany({
      where: { userId: decoded.userId },
    })

    const completedVideos = watchHistory.filter(w => w.completed).length
    const completedBooks = readingProgress.filter(r => r.completed).length

    return NextResponse.json({
      stats,
      completedVideos,
      completedBooks,
      totalWatchTime: watchHistory.reduce((sum, w) => sum + w.watchTime, 0),
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
