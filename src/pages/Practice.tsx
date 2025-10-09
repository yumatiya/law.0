import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Clock, 
  Trophy, 
  TrendingUp, 
  BookOpen,
  CheckCircle,
  Play,
  BarChart3,
  Zap,
  Star
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface PracticeTest {
  id: string;
  title: string;
  subject: string;
  questions: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  attempts: number;
  bestScore?: number;
  topics: string[];
}

interface QuizResult {
  testId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: Date;
}

const Practice = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState("tests");

  // Generate practice tests based on profile
  const getPracticeTestsByProfile = () => {
    if (state.currentProfile === 'school') {
      return [
        {
          id: "1",
          title: "Mathematics - Class 10",
          subject: "Mathematics",
          questions: 30,
          duration: 45,
          difficulty: "medium" as const,
          attempts: 2,
          bestScore: 85,
          topics: ["Algebra", "Geometry", "Trigonometry"]
        },
        {
          id: "2",
          title: "Science - Physics",
          subject: "Physics",
          questions: 25,
          duration: 40,
          difficulty: "easy" as const,
          attempts: 1,
          bestScore: 92,
          topics: ["Light", "Motion", "Electricity"]
        },
        {
          id: "3",
          title: "Hindi Grammar",
          subject: "Hindi",
          questions: 20,
          duration: 30,
          difficulty: "medium" as const,
          attempts: 0,
          topics: ["व्याकरण", "छंद", "संधि"]
        },
        {
          id: "4",
          title: "English Literature",
          subject: "English",
          questions: 25,
          duration: 35,
          difficulty: "medium" as const,
          attempts: 3,
          bestScore: 78,
          topics: ["Poetry", "Prose", "Grammar"]
        }
      ];
    } else if (state.currentProfile === 'college') {
      return [
        {
          id: "1",
          title: "Engineering Mathematics",
          subject: "Mathematics",
          questions: 50,
          duration: 90,
          difficulty: "hard" as const,
          attempts: 2,
          bestScore: 75,
          topics: ["Calculus", "Linear Algebra", "Probability"]
        },
        {
          id: "2",
          title: "Computer Networks",
          subject: "CSE",
          questions: 40,
          duration: 60,
          difficulty: "medium" as const,
          attempts: 1,
          bestScore: 88,
          topics: ["OSI Model", "TCP/IP", "Routing"]
        },
        {
          id: "3",
          title: "Business Analytics",
          subject: "MBA",
          questions: 35,
          duration: 75,
          difficulty: "hard" as const,
          attempts: 0,
          topics: ["Statistics", "Data Mining", "Forecasting"]
        },
        {
          id: "4",
          title: "Constitutional Law",
          subject: "LLB",
          questions: 30,
          duration: 60,
          difficulty: "medium" as const,
          attempts: 1,
          bestScore: 82,
          topics: ["Fundamental Rights", "Parliament", "Judiciary"]
        }
      ];
    } else {
      return [
        {
          id: "1",
          title: "Criminal Law Practice",
          subject: "Criminal Law",
          questions: 40,
          duration: 90,
          difficulty: "hard" as const,
          attempts: 3,
          bestScore: 89,
          topics: ["IPC", "CrPC", "Evidence Act"]
        },
        {
          id: "2",
          title: "Civil Procedure Code",
          subject: "Civil Law",
          questions: 35,
          duration: 75,
          difficulty: "medium" as const,
          attempts: 2,
          bestScore: 85,
          topics: ["Pleadings", "Trial", "Decree"]
        },
        {
          id: "3",
          title: "Constitutional Provisions",
          subject: "Constitutional Law",
          questions: 50,
          duration: 120,
          difficulty: "hard" as const,
          attempts: 1,
          bestScore: 78,
          topics: ["Fundamental Rights", "DPSP", "Emergency"]
        },
        {
          id: "4",
          title: "Contract Law Essentials",
          subject: "Contract Law",
          questions: 30,
          duration: 60,
          difficulty: "medium" as const,
          attempts: 0,
          topics: ["Agreement", "Consideration", "Breach"]
        }
      ];
    }
  };

  const practiceTests: PracticeTest[] = getPracticeTestsByProfile();

  const recentResults: QuizResult[] = [
    {
      testId: "1",
      score: 17,
      totalQuestions: 20,
      timeSpent: 28,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      testId: "2",
      score: 11,
      totalQuestions: 15,
      timeSpent: 23,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      testId: "3",
      score: 22,
      totalQuestions: 25,
      timeSpent: 42,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            {state.currentProfile === 'school' ? 'School Practice Hub' : 
             state.currentProfile === 'college' ? 'College Practice Hub' : 
             'Legal Practice Hub'}
          </h1>
          <p className="text-muted-foreground">
            {state.currentProfile === 'school' ? 'Master your school subjects with practice tests' : 
             state.currentProfile === 'college' ? 'Excel in your college studies with comprehensive tests' : 
             'Sharpen your legal skills with professional practice tests'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-gold mr-3" />
                <div>
                  <p className="text-2xl font-bold text-navy">12</p>
                  <p className="text-xs text-muted-foreground">Tests Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-gold mr-3" />
                <div>
                  <p className="text-2xl font-bold text-navy">78%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-gold mr-3" />
                <div>
                  <p className="text-2xl font-bold text-navy">45h</p>
                  <p className="text-xs text-muted-foreground">Study Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-gold mr-3" />
                <div>
                  <p className="text-2xl font-bold text-navy">8</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tests">Available Tests</TabsTrigger>
            <TabsTrigger value="results">Recent Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {practiceTests.map((test) => (
                <Card key={test.id} className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-navy">{test.title}</CardTitle>
                      <Badge className={getDifficultyColor(test.difficulty)}>
                        {test.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {test.subject}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {test.questions} Questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {test.duration} min
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {test.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {test.attempts > 0 ? (
                            <span>
                              Best Score: <span className={getScoreColor(test.bestScore || 0)}>{test.bestScore}%</span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Not attempted</span>
                          )}
                        </div>
                        <Button>
                          <Play className="h-4 w-4 mr-2" />
                          {test.attempts > 0 ? 'Practice Again' : 'Start Test'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="space-y-4">
              {recentResults.map((result, index) => {
                const test = practiceTests.find(t => t.id === result.testId);
                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                
                return (
                  <Card key={index} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-gold/10">
                            <CheckCircle className="h-5 w-5 text-gold" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-navy">{test?.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {result.completedAt.toLocaleDateString()} • {test?.subject}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className={`text-lg font-bold ${getScoreColor(percentage)}`}>
                                {result.score}/{result.totalQuestions}
                              </p>
                              <p className="text-sm text-muted-foreground">{percentage}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                {result.timeSpent} min
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Subject Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { subject: state.currentProfile === 'lawyer' ? 'Criminal Law' : 'Mathematics', score: 85 },
                    { subject: state.currentProfile === 'lawyer' ? 'Civil Law' : 'Science', score: 72 },
                    { subject: state.currentProfile === 'lawyer' ? 'Constitutional Law' : 'English', score: 90 },
                    { subject: state.currentProfile === 'lawyer' ? 'Contract Law' : 'History', score: 68 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.subject}</span>
                        <span className="text-sm text-muted-foreground">{item.score}%</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { icon: Trophy, title: "Perfect Score", description: "Scored 100% in a test" },
                      { icon: Zap, title: "Speed Demon", description: "Completed test in record time" },
                      { icon: Target, title: "Consistent Performer", description: "Maintained 80%+ average" },
                      { icon: Star, title: "Subject Master", description: "Completed all tests in a subject" }
                    ].map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                        <achievement.icon className="h-8 w-8 text-gold" />
                        <div>
                          <p className="font-medium text-navy">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Practice;