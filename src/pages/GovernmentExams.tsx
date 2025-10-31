import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Trophy, Clock, Target, Brain, TrendingUp } from 'lucide-react';

interface Exam {
  id: string;
  exam_name: string;
  exam_type: string;
  description: string;
  total_seats: number;
}

interface ExamAttempt {
  id: string;
  exam_id: string;
  score: number;
  total_questions: number;
  time_taken_seconds: number;
  created_at: string;
}

export default function GovernmentExams() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [startingExam, setStartingExam] = useState<string | null>(null);

  useEffect(() => {
    loadExams();
    loadAttempts();
  }, []);

  const loadExams = async () => {
    const { data, error } = await supabase
      .from('government_exams')
      .select('*')
      .order('exam_name');

    if (error) {
      toast({
        title: 'Error loading exams',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setExams(data || []);
    }
    setLoading(false);
  };

  const loadAttempts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('exam_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setAttempts(data);
    }
  };

  const startExam = async (examId: string) => {
    setStartingExam(examId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-exam-test', {
        body: { examId },
      });

      if (error) throw error;

      toast({
        title: 'Exam Started',
        description: 'Good luck with your test!',
      });

      // Navigate to exam interface with questions
      // This would be a separate component to handle the actual exam
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setStartingExam(null);
    }
  };

  const examTypes = ['UPSC', 'SSC', 'Banking', 'Defence', 'Police', 'PSC', 'Teaching'];

  const filteredExams = selectedType === 'all' 
    ? exams 
    : exams.filter(e => e.exam_type === selectedType);

  const stats = {
    totalAttempts: attempts.length,
    averageScore: attempts.length > 0 
      ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.total_questions * 100), 0) / attempts.length)
      : 0,
    bestScore: attempts.length > 0
      ? Math.max(...attempts.map(a => (a.score / a.total_questions * 100)))
      : 0,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">🇮🇳 Government Exam Zone</h1>
          <p className="text-muted-foreground">
            Prepare for UPSC, SSC, Banking, Defence, Police, PSC, Teaching exams with AI-powered mock tests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bestScore}%</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="exams" className="w-full">
        <TabsList>
          <TabsTrigger value="exams">Available Exams</TabsTrigger>
          <TabsTrigger value="history">My Attempts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Exams
            </Button>
            {examTypes.map(type => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-8">Loading exams...</div>
          ) : filteredExams.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No exams available yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExams.map(exam => (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{exam.exam_name}</CardTitle>
                        <CardDescription>{exam.description}</CardDescription>
                      </div>
                      <Badge>{exam.exam_type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>Total Seats: {exam.total_seats?.toLocaleString() || 'TBA'}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => startExam(exam.id)}
                      disabled={startingExam === exam.id}
                    >
                      {startingExam === exam.id ? 'Starting...' : 'Start Mock Test'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {attempts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No exam attempts yet. Start your first mock test!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {attempts.map(attempt => {
                const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
                return (
                  <Card key={attempt.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">Score: {attempt.score}/{attempt.total_questions}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(attempt.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={percentage >= 70 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'}>
                          {percentage}%
                        </Badge>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Track your progress across different exam types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Performance</span>
                    <span className="text-sm text-muted-foreground">{stats.averageScore}%</span>
                  </div>
                  <Progress value={stats.averageScore} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep practicing to improve your scores. AI adapts to your performance!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
