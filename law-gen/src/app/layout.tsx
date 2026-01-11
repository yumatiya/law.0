import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/context/AuthContext'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'LAW.GEN - AI-Powered Education & Legal Ecosystem',
  description: 'Next-generation AI Teacher, Professional AI Lawyer, and Legal Research Engine for India and the world',
  authors: [{ name: 'Akil Umatiya', url: 'https://lawgen.com' }],
  creator: 'Akil Umatiya',
  keywords: ['education', 'AI teacher', 'AI lawyer', 'legal research', 'law', 'medical', 'engineering', 'court simulation', 'legal drafting'],
  openGraph: {
    title: 'LAW.GEN - AI-Powered Education & Legal Ecosystem',
    description: 'Next-generation AI Teacher, Professional AI Lawyer, and Legal Research Engine for India and the world',
    url: 'https://lawgen.com',
    siteName: 'LAW.GEN',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LAW.GEN - AI-Powered Education & Legal Ecosystem',
    description: 'Next-generation AI Teacher, Professional AI Lawyer, and Legal Research Engine for India and the world',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
