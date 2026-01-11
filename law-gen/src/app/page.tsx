'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import {
  BookOpen,
  GraduationCap,
  Scale,
  Sparkles,
  Target,
  Gavel,
  Brain,
  Shield,
  ChevronRight,
  Star
} from 'lucide-react'

type Mode = 'school' | 'college' | 'lawyer'

interface ModeConfig {
  id: Mode
  title: string
  description: string
  icon: React.ReactNode
  color: string
  features: string[]
  route: string
}

const modes: ModeConfig[] = [
  {
    id: 'school',
    title: 'School Mode',
    description: 'NCERT-based learning for Class 9-12 with AI Teacher support',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    features: ['NCERT Curriculum', 'Exam Preparation', 'AI Teacher', 'Practice Questions'],
    route: '/school'
  },
  {
    id: 'college',
    title: 'College Mode',
    description: 'Advanced education for Engineering, Medical, CA, Law & more',
    icon: <GraduationCap className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    features: ['Industry Focus', 'Advanced Topics', 'Research Tools', 'Career Guidance'],
    route: '/college'
  },
  {
    id: 'lawyer',
    title: 'Lawyer Mode',
    description: 'Professional legal tools with complete Indian legal database',
    icon: <Scale className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    features: ['Legal Database', 'Court Simulation', 'Document Drafting', 'Case Research'],
    route: '/lawyer'
  }
]

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        router.push('/auth')
        return
      }
    } catch (error) {
      router.push('/auth')
      return
    } finally {
      setLoading(false)
    }
  }

  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode)
    localStorage.setItem('selectedMode', mode)
    const modeConfig = modes.find(m => m.id === mode)
    if (modeConfig) {
      router.push(modeConfig.route)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in checkAuth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <Scale className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              LAW.GEN
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Next-generation AI Teacher, Professional AI Lawyer, and Legal Research Engine for India and the world
            </p>

            <div className="flex justify-center space-x-8 mb-12">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered Learning</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Legal Safety</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Professional Standards</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Mode
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Select the LAW.GEN experience that matches your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 shadow-lg"
              onClick={() => handleModeSelect(mode.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-10`}></div>
              <CardHeader className="relative pb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${mode.color} flex items-center justify-center mb-4 mx-auto`}>
                  {mode.icon}
                </div>
                <CardTitle className="text-xl text-center text-gray-900 dark:text-white">
                  {mode.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  {mode.description}
                </p>

                <div className="space-y-2 mb-6">
                  {mode.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${mode.color}`}></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90 text-white border-0`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleModeSelect(mode.id)
                  }}
                >
                  Enter {mode.title}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            LAW.GEN operates in completely isolated modes for focused, professional experiences
          </p>
        </div>
      </div>
    </div>
  )
}
