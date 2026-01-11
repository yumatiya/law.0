'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Loader2, Send, Upload, MessageSquare, Brain, Languages, BookOpen } from 'lucide-react'
import { useToast } from '../../hooks/use-toast'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  metadata?: {
    subject?: string
    chapter?: string
    language?: string
    personality?: string
    suggestions?: string[]
    relatedTopics?: string[]
  }
}

interface AITutorProps {
  userId?: string
  subject?: string
  chapter?: string
  educationLevel?: string
}

const AI_PERSONALITIES = [
  { value: 'friendly', label: 'Friendly', description: 'Warm and encouraging' },
  { value: 'professional', label: 'Professional', description: 'Academic and structured' },
  { value: 'expert', label: 'Expert', description: 'Authoritative legal guidance' },
  { value: 'motivational', label: 'Motivational', description: 'Inspiring and goal-oriented' }
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
  { value: 'bn', label: 'বাংলা (Bengali)' },
  { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'ml', label: 'മലയാളം (Malayalam)' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
  { value: 'as', label: 'অসমীয়া (Assamese)' },
  { value: 'ur', label: 'اردو (Urdu)' }
]

export default function EnhancedAITutor({ userId, subject, chapter, educationLevel }: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [personality, setPersonality] = useState('friendly')
  const [language, setLanguage] = useState('en')
  const [selectedSubject, setSelectedSubject] = useState(subject || '')
  const [selectedChapter, setSelectedChapter] = useState(chapter || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load conversation history on mount
  useEffect(() => {
    loadConversationHistory()
  }, [userId])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversationHistory = async () => {
    if (!userId) {
      setIsLoadingHistory(false)
      return
    }

    try {
      // Load recent conversation history from database
      const response = await fetch('/api/ai/chat/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        // If history endpoint doesn't exist yet, start with empty messages
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !imageFile) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      createdAt: new Date().toISOString(),
      metadata: {
        subject: selectedSubject,
        chapter: selectedChapter,
        language,
        personality
      }
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('message', inputMessage)
      if (userId) formData.append('userId', userId)
      if (educationLevel) formData.append('educationLevel', educationLevel)
      formData.append('language', language)
      formData.append('personality', personality)
      if (selectedSubject) formData.append('subject', selectedSubject)
      if (selectedChapter) formData.append('chapter', selectedChapter)
      if (imageFile) formData.append('image', imageFile)

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        createdAt: new Date().toISOString(),
        metadata: {
          subject: selectedSubject,
          chapter: selectedChapter,
          language,
          personality,
          suggestions: data.metadata?.suggestions,
          relatedTopics: data.metadata?.relatedTopics
        }
      }

      setMessages(prev => [...prev, aiMessage])
      setImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })

      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }
      setImageFile(file)
    }
  }

  const clearConversation = () => {
    setMessages([])
    toast({
      title: "Conversation cleared",
      description: "Started a new conversation.",
    })
  }

  if (isLoadingHistory) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading conversation history...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Enhanced AI Tutor
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="geography">Geography</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="law">Law</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <Select value={personality} onValueChange={setPersonality}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_PERSONALITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div>
                      <div className="font-medium">{p.label}</div>
                      <div className="text-sm text-muted-foreground">{p.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={clearConversation}>
            Clear Chat
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96 w-full pr-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with your AI tutor!</p>
                <p className="text-sm">Ask questions, upload images, or get help with your studies.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/ai-avatar.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium">Suggestions:</p>
                        {message.metadata.suggestions.map((suggestion, index) => (
                          <Badge key={index} variant="secondary" className="text-xs mr-1">
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {message.metadata?.relatedTopics && message.metadata.relatedTopics.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Related Topics:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {message.metadata.relatedTopics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/ai-avatar.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="mt-4 space-y-2">
          {imageFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className="text-sm">Image: {imageFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImageFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                ✕
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your AI tutor anything..."
              className="flex-1"
              rows={2}
            />

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={isLoading || (!inputMessage.trim() && !imageFile)}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
