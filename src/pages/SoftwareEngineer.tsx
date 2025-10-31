import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Code, Play, Trophy, Brain, Target, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface CodingProblem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  test_cases: any;
  tags: string[];
  company_tags: string[];
}

interface Submission {
  id: string;
  problem_id: string;
  language: string;
  status: string;
  test_cases_passed: number;
  total_test_cases: number;
  created_at: string;
}

export default function SoftwareEngineer() {
  const { toast } = useToast();
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [running, setRunning] = useState(false);
  const [interviewMode, setInterviewMode] = useState(false);

  useEffect(() => {
    loadProblems();
    loadSubmissions();
  }, []);

  const loadProblems = async () => {
    const { data, error } = await supabase
      .from('coding_problems')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error loading problems',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setProblems(data || []);
    }
  };

  const loadSubmissions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('coding_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setSubmissions(data);
    }
  };

  const runCode = async () => {
    if (!selectedProblem) {
      toast({
        title: 'No problem selected',
        description: 'Please select a problem first',
        variant: 'destructive',
      });
      return;
    }

    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-code', {
        body: {
          problemId: selectedProblem.id,
          code,
          language,
        },
      });

      if (error) throw error;

      toast({
        title: data.status === 'accepted' ? 'Success! ✅' : 'Failed',
        description: `${data.test_cases_passed}/${data.total_test_cases} test cases passed`,
        variant: data.status === 'accepted' ? 'default' : 'destructive',
      });

      loadSubmissions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setRunning(false);
    }
  };

  const startInterview = async () => {
    setInterviewMode(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-interview', {
        body: {
          interviewType: 'technical',
          difficulty: 'medium',
        },
      });

      if (error) throw error;

      toast({
        title: 'Interview Started',
        description: 'AI interviewer is ready. Good luck!',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const stats = {
    totalSubmissions: submissions.length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    successRate: submissions.length > 0 
      ? Math.round((submissions.filter(s => s.status === 'accepted').length / submissions.length) * 100)
      : 0,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">💻 Software Engineer Zone</h1>
          <p className="text-muted-foreground">
            Practice coding, prepare for technical interviews, and improve your programming skills with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="problems" className="w-full">
        <TabsList>
          <TabsTrigger value="problems">Coding Problems</TabsTrigger>
          <TabsTrigger value="interview">AI Interview</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="problems" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Problem List</CardTitle>
                <CardDescription>Select a problem to start coding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {problems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No problems available yet. Check back soon!
                  </p>
                ) : (
                  problems.map(problem => (
                    <Card
                      key={problem.id}
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedProblem?.id === problem.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedProblem(problem)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{problem.title}</h3>
                          <Badge className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {problem.tags?.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
                <CardDescription>
                  {selectedProblem ? selectedProblem.title : 'Select a problem to start'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProblem && (
                  <>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm">{selectedProblem.description}</p>
                    </div>

                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>

                    <Textarea
                      placeholder="Write your code here..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="font-mono min-h-[300px]"
                    />

                    <Button onClick={runCode} disabled={running || !code} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      {running ? 'Running...' : 'Run Code'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Interview Simulator</CardTitle>
              <CardDescription>
                Practice technical and HR interviews with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={startInterview} className="h-32">
                  <div className="flex flex-col items-center gap-2">
                    <Brain className="h-8 w-8" />
                    <span>Technical Interview</span>
                  </div>
                </Button>
                <Button onClick={startInterview} variant="outline" className="h-32">
                  <div className="flex flex-col items-center gap-2">
                    <Target className="h-8 w-8" />
                    <span>HR Interview</span>
                  </div>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Get real-time feedback and improve your interview skills
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {submissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No submissions yet. Start solving problems!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {submissions.map(submission => (
                <Card key={submission.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {submission.status === 'accepted' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-semibold">{submission.language}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission.test_cases_passed}/{submission.total_test_cases} passed
                          </p>
                        </div>
                      </div>
                      <Badge variant={submission.status === 'accepted' ? 'default' : 'destructive'}>
                        {submission.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
