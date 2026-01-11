import { prisma } from './prisma'
import { hashPassword, verifyPassword } from './auth'
import { UserRole } from '@prisma/client'

export interface CreateUserData {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface LoginUserData {
  email: string
  password: string
}

export async function createUser(data: CreateUserData) {
  const hashedPassword = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
    },
  })

  return user
}

export async function authenticateUser(data: LoginUserData) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      student: true,
      schoolAdmin: true,
      collegeAdmin: true,
      lawyer: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isValidPassword = await verifyPassword(data.password, user.password)
  if (!isValidPassword) {
    throw new Error('Invalid password')
  }

  return user
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      student: true,
      schoolAdmin: true,
      collegeAdmin: true,
      lawyer: true,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      student: true,
      schoolAdmin: true,
      collegeAdmin: true,
      lawyer: true,
    },
  })
}

export async function updateUserVerificationToken(userId: string, token: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      verificationToken: token,
    },
  })
}

export async function verifyUserEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  })

  if (!user) {
    throw new Error('Invalid verification token')
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
    },
  })
}

export async function updatePasswordResetToken(userId: string, token: string, expiry: Date) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  })
}

export async function resetUserPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  })

  if (!user) {
    throw new Error('Invalid or expired reset token')
  }

  const hashedPassword = await hashPassword(newPassword)

  return prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  })
}
