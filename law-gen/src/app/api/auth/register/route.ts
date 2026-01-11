import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createUser, getUserByEmail } from '@/lib/auth-utils'
import { sendVerificationEmail } from '@/lib/email'
import { generateToken } from '@/lib/auth'
import { UserRole } from '@prisma/client'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'SCHOOL_ADMIN', 'COLLEGE_ADMIN', 'LAWYER', 'SUPER_ADMIN']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser({
      email,
      password,
      name,
      role: role as UserRole,
    })

    // Generate verification token
    const verificationToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      mode: 'verification',
    })

    // Update user with verification token
    await updateUserVerificationToken(user.id, verificationToken)

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
