import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Clock, Trophy, Target, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function PracticeHub() {
  const [mode, setMode] = useState<'school' | 'college' | 'lawyer'>('school');
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeStarted, setTimeStarted] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const subjects = {
    school: ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi'],
    college: ['Computer Science', 'Business', 'Law', 'Engineering', 'Medicine'],
    lawyer: ['IPC', 'CrPC', 'CPC', 'Constitution', 'Evidence Act', 'Contract Law']
  };

  const startQuiz = async () => {
    if (!subject) {
      toast({
        title: "Select a subject",
        description: "Please choose a subject to begin",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { mode, subject, questionCount: 5 }
      });

      if (error) throw error;

      setQuestions(data.questions);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setTimeStarted(Date.now());
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      }, 1500);
    } else {
      saveQuizResult();
      setShowResult(true);
    }
  };

  const saveQuizResult = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const timeTaken = Math.floor((Date.now() - timeStarted) / 1000);

    await supabase.from('quiz_results').insert([{
      user_id: user.id,
      mode,
      subject,
      score,
      total_questions: questions.length,
      time_taken_seconds: timeTaken,
      quiz_data: { questions } as any
    }]);

    await supabase.from('learning_analytics').insert([{
      user_id: user.id,
      mode,
      activity_type: 'quiz',
      subject,
      duration_seconds: timeTaken
    }]);
  };

  const restartQuiz = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  if (questions.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎯 Practice Hub</h1>
          <p className="text-muted-foreground">Test your knowledge with AI-generated quizzes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start a New Quiz</CardTitle>
            <CardDescription>Select your mode and subject to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base mb-3 block">Select Mode</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['school', 'college', 'lawyer'] as const).map((m) => (
                  <Button
                    key={m}
                    variant={mode === m ? 'default' : 'outline'}
                    onClick={() => {
                      setMode(m);
                      setSubject('');
                    }}
                    className="capitalize"
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base mb-3 block">Select Subject</Label>
              <div className="grid grid-cols-2 gap-3">
                {subjects[mode].map((s) => (
                  <Button
                    key={s}
                    variant={subject === s ? 'default' : 'outline'}
                    onClick={() => setSubject(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={startQuiz} 
              disabled={!subject || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Generating Quiz...' : 'Start Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription>Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{percentage}%</div>
              <p className="text-muted-foreground">
                {score} out of {questions.length} correct
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Correct</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Incorrect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{questions.length - score}</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button onClick={restartQuiz} className="flex-1">
                Try New Quiz
              </Button>
              <Button onClick={() => window.location.href = '/profile'} variant="outline" className="flex-1">
                View Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answered = selectedAnswer !== null;
  const isCorrect = answered && selectedAnswer === question.correctAnswer;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">Question {currentQuestion + 1} of {questions.length}</Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Target className="h-3 w-3" />
            Score: {score}/{questions.length}
          </Badge>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedAnswer?.toString()} onValueChange={(v) => setSelectedAnswer(parseInt(v))}>
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-colors ${
                  answered
                    ? index === question.correctAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-950'
                      : index === selectedAnswer
                      ? 'border-red-500 bg-red-50 dark:bg-red-950'
                      : 'border-muted'
                    : selectedAnswer === index
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={answered} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
                {answered && index === question.correctAnswer && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                {answered && index === selectedAnswer && index !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            ))}
          </RadioGroup>

          {answered && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
              <p className="font-semibold mb-2">{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</p>
              <p className="text-sm">{question.explanation}</p>
            </div>
          )}

          <Button 
            onClick={handleAnswer} 
            disabled={selectedAnswer === null || answered}
            className="w-full"
          >
            {answered ? 'Next Question...' : 'Submit Answer'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
