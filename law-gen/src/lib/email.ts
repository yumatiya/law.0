// Email utilities - using console.log for now, can be replaced with real email service later

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // For now, just log to console
  console.log('📧 Email would be sent:', {
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })

  // TODO: Replace with actual email service like SendGrid, Mailgun, etc.
  // Example:
  // const transporter = nodemailer.createTransporter({...})
  // await transporter.sendMail({...})
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`

  await sendEmail({
    to: email,
    subject: 'Verify your Law.Gen account',
    html: `
      <h1>Welcome to Law.Gen!</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
    text: `Welcome to Law.Gen! Please verify your email: ${verificationUrl}`,
  })
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/api/auth/reset-password?token=${token}`

  await sendEmail({
    to: email,
    subject: 'Reset your Law.Gen password',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
    `,
    text: `Password reset link: ${resetUrl}`,
  })
}
