'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Progress } from '../../../components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Play,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Brain,
  Trophy,
  Zap,
  Heart,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Lightbulb,
  Timer,
  Users,
  MessageSquare
} from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import EnhancedAITutor from '../../../components/ai-tutor/EnhancedAITutor'

interface DashboardData {
  user: {
    name: string
    educationLevel: string
    avatar?: string
  }
  stats: {
    totalBooksRead: number
    totalVideosWatched: number
    totalWatchTime: number
    totalReadingTime: number
    completedChapters: number
    totalChapters: number
    currentStreak: number
    longestStreak: number
  }
  recommendations: {
    nextTopics: Array<{
      id: string
      title: string
      subject: string
      difficulty: 'easy' | 'medium' | 'hard'
      estimatedTime: number
      priority: 'high' | 'medium' | 'low'
      reason: string
    }>
    practiceQuestions: Array<{
      id: string
      question: string
      subject: string
      type: 'multiple-choice' | 'short-answer' | 'essay'
    }>
    studyReminders: Array<{
      id: string
      title: string
      time: string
      type: 'revision' | 'practice' | 'new-topic'
    }>
  }
  recentActivity: Array<{
    id: string
    type: 'read' | 'watch' | 'quiz' | 'practice'
    title: string
    subject: string
    timestamp: Date
    progress?: number
    score?: number
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: Date
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }>
  learningPath: {
    currentWeek: {
      completed: number
      total: number
      subjects: Array<{
        name: string
        progress: number
        chapters: Array<{
          title: string
          completed: boolean
          priority: 'high' | 'medium' | 'low'
        }>
      }>
    }
    upcomingWeeks: Array<{
      week: number
      focus: string
      goals: string[]
    }>
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAITutor, setShowAITutor] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')

      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800'
      case 'rare': return 'bg-blue-100 text-blue-800'
      case 'epic': return 'bg-purple-100 text-purple-800'
      case 'legendary': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Unable to load dashboard information.</p>
        </div>
      </div>
    )
  }

  const { user, stats, recommendations, recentActivity, achievements, learningPath } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.educationLevel.replace('_', ' ')} • {stats.currentStreak} day streak 🔥
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowAITutor(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Ask AI Tutor
              </Button>
              <Badge variant="secondary" className="px-3 py-1">
                <Trophy className="w-4 h-4 mr-1" />
                Level {Math.floor(stats.completedChapters / 10) + 1}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning Path</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Books Read</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBooksRead}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalReadingTime} min reading time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVideosWatched}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(stats.totalWatchTime / 60)}h {stats.totalWatchTime % 60}m watch time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalChapters > 0 ? Math.round((stats.completedChapters / stats.totalChapters) * 100) : 0}%
                  </div>
                  <Progress
                    value={stats.totalChapters > 0 ? (stats.completedChapters / stats.totalChapters) * 100 : 0}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.currentStreak}</div>
                  <p className="text-xs text-muted-foreground">
                    Best: {stats.longestStreak} days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                    AI Recommended Next Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.nextTopics.slice(0, 3).map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex-1">
                        <h4 className="font-medium">{topic.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {topic.subject}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(topic.difficulty)}`}>
                            {topic.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {topic.estimatedTime} min
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {topic.reason}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-500" />
                    Study Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recommendations.studyReminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{reminder.title}</h4>
                        <p className="text-xs text-gray-500">{reminder.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {reminder.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        {activity.type === 'read' && <BookOpen className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'watch' && <Play className="w-5 h-5 text-green-600" />}
                        {activity.type === 'quiz' && <Target className="w-5 h-5 text-purple-600" />}
                        {activity.type === 'practice' && <CheckCircle className="w-5 h-5 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        <p className="text-xs text-gray-500">
                          {activity.subject} • {activity.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      {activity.progress && (
                        <div className="text-right">
                          <div className="text-sm font-medium">{activity.progress}%</div>
                          <Progress value={activity.progress} className="w-16" />
                        </div>
                      )}
                      {activity.score && (
                        <div className="text-right">
                          <div className="text-sm font-medium">{activity.score}%</div>
                          <Badge variant="outline" className="text-xs">
                            Score
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            {/* Current Week Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  This Week's Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-500">
                      {learningPath.currentWeek.completed}/{learningPath.currentWeek.total} chapters
                    </span>
                  </div>
                  <Progress
                    value={(learningPath.currentWeek.completed / learningPath.currentWeek.total) * 100}
                    className="h-3"
                  />
                </div>

                <div className="space-y-4">
                  {learningPath.currentWeek.subjects.map((subject, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{subject.name}</h4>
                        <span className="text-sm text-gray-500">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="mb-3" />

                      <div className="space-y-2">
                        {subject.chapters.slice(0, 3).map((chapter, chapterIndex) => (
                          <div key={chapterIndex} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {chapter.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                              )}
                              <span className={`text-sm ${chapter.completed ? 'line-through text-gray-500' : ''}`}>
                                {chapter.title}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(chapter.priority)}`}
                            >
                              {chapter.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Weeks */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Weeks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPath.upcomingWeeks.map((week) => (
                    <div key={week.week} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Week {week.week}</h4>
                        <Badge variant="outline">{week.focus}</Badge>
                      </div>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {week.goals.map((goal, index) => (
                          <li key={index} className="flex items-center">
                            <ChevronRight className="w-3 h-3 mr-2" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Study Time This Week</span>
                      <span className="font-medium">24h 30m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Daily Study</span>
                      <span className="font-medium">3h 28m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Most Productive Day</span>
                      <span className="font-medium">Wednesday</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Strongest Subject</span>
                      <span className="font-medium">Mathematics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Quiz Average</span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Improvement Rate</span>
                      <span className="font-medium text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Consistency Score</span>
                      <span className="font-medium text-blue-600">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Focus Areas</span>
                      <span className="font-medium text-orange-600">Geometry</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Tutor Modal */}
      {showAITutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">AI Tutor</h2>
              <Button variant="ghost" onClick={() => setShowAITutor(false)}>
                ✕
              </Button>
            </div>
            <div className="h-full">
              <EnhancedAITutor
                userId="current-user-id" // This should come from auth context
                educationLevel={user.educationLevel}
                language="en"
                onLanguageChange={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
