import { Suspense } from 'react'
import EnhancedAITutor from '../../../components/ai-tutor/EnhancedAITutor'
import { Card, CardContent } from '../../../components/ui/card'
import { Loader2 } from 'lucide-react'

export default function AITutorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Tutor</h1>
        <p className="text-muted-foreground">
          Get personalized help with your studies. Ask questions, upload images, and receive guidance in multiple languages.
        </p>
      </div>

      <Suspense fallback={
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading AI Tutor...</span>
          </CardContent>
        </Card>
      }>
        <EnhancedAITutor />
      </Suspense>
    </div>
  )
}
