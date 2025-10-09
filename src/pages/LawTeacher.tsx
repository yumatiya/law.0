import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen, Brain, HelpCircle } from 'lucide-react';

const LawTeacher = () => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [quiz, setQuiz] = useState<Array<{ question: string; options: string[] }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const learnTopic = async (mode: 'story' | 'example' | 'quiz') => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a legal topic to learn about",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('law-teacher', {
        body: { topic, mode }
      });

      if (error) throw error;
      
      if (mode === 'quiz') {
        setQuiz(data.quiz);
        setExplanation('');
      } else {
        setExplanation(data.explanation);
        setQuiz([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">AI Law Teacher</CardTitle>
          <CardDescription>
            Interactive learning for school & college students - stories, examples, and quizzes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            placeholder="Enter a legal topic (e.g., Article 21, IPC 302, Fundamental Rights)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="grid gap-3 md:grid-cols-3">
            <Button
              onClick={() => learnTopic('story')}
              disabled={isLoading}
              variant="outline"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Teach as Story
            </Button>
            <Button
              onClick={() => learnTopic('example')}
              disabled={isLoading}
              variant="outline"
            >
              <Brain className="mr-2 h-4 w-4" />
              Real-Life Example
            </Button>
            <Button
              onClick={() => learnTopic('quiz')}
              disabled={isLoading}
              variant="outline"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Quiz Me
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {explanation && !isLoading && (
            <Card className="bg-secondary/30">
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                  {explanation}
                </div>
              </CardContent>
            </Card>
          )}

          {quiz.length > 0 && !isLoading && (
            <div className="space-y-4">
              {quiz.map((q, idx) => (
                <Card key={idx} className="bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-base">Question {idx + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, optIdx) => (
                        <Button
                          key={optIdx}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {String.fromCharCode(65 + optIdx)}. {option}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LawTeacher;
