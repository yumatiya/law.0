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

    // Get user to determine education level
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { educationLevel: true }
    })

    if (!user?.educationLevel) {
      return NextResponse.json(
        { message: "User education level not set" },
        { status: 400 }
      )
    }

    const subjects = await prisma.subject.findMany({
      where: {
        educationLevel: user.educationLevel as any,
        isActive: true
      },
      include: {
        _count: {
          select: { books: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ subjects }, { status: 200 })
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
