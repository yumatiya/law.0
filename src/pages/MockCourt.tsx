import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Gavel, 
  Users, 
  Clock, 
  Trophy,
  Play,
  BarChart3,
  FileText,
  MessageSquare,
  Star,
  Award,
  Target,
  Book
} from "lucide-react";

interface MockCourtCase {
  id: string;
  title: string;
  caseType: 'civil' | 'criminal' | 'constitutional' | 'consumer';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  facts: string;
  legalIssues: string[];
  completed: boolean;
  bestScore?: number;
  attempts: number;
}

const MockCourt = () => {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const mockCourtCases: MockCourtCase[] = [
    {
      id: "1",
      title: "Consumer Dispute: Defective Laptop",
      caseType: "consumer",
      difficulty: "beginner",
      estimatedTime: 30,
      facts: "22-year-old student bought laptop worth ₹65,000. Developed motherboard issues within 3 months. Company refused replacement citing user damage.",
      legalIssues: ["Consumer protection rights", "Warranty claims", "Burden of proof", "Compensation"],
      completed: true,
      bestScore: 85,
      attempts: 3
    },
    {
      id: "2",
      title: "Property Ownership Dispute",
      caseType: "civil",
      difficulty: "intermediate",
      estimatedTime: 45,
      facts: "Two brothers claim ownership of ancestral property. Elder has possession, younger has registered sale deed from father executed before death.",
      legalIssues: ["Property succession rights", "Documentary evidence", "Adverse possession", "Family settlement"],
      completed: true,
      bestScore: 72,
      attempts: 2
    },
    {
      id: "3",
      title: "Wrongful Termination Case",
      caseType: "civil",
      difficulty: "intermediate",
      estimatedTime: 40,
      facts: "Employee terminated after 8 years without notice. Company claims misconduct, employee claims discrimination based on union activities.",
      legalIssues: ["Labor law violations", "Natural justice principles", "Industrial disputes", "Compensation"],
      completed: false,
      attempts: 0
    },
    {
      id: "4",
      title: "Constitutional Challenge: Right to Privacy",
      caseType: "constitutional",
      difficulty: "advanced",
      estimatedTime: 60,
      facts: "Government introduces mandatory biometric data collection for public services. Citizens challenge constitutionality citing privacy rights.",
      legalIssues: ["Fundamental rights", "Privacy as fundamental right", "Proportionality test", "State power vs individual liberty"],
      completed: false,
      attempts: 0
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCaseTypeColor = (type: string) => {
    switch (type) {
      case 'civil': return 'bg-blue-100 text-blue-700';
      case 'criminal': return 'bg-red-100 text-red-700';
      case 'constitutional': return 'bg-purple-100 text-purple-700';
      case 'consumer': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const recentSessions = [
    {
      caseTitle: "Consumer Dispute: Defective Laptop",
      score: 85,
      duration: 28,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      caseTitle: "Property Ownership Dispute", 
      score: 72,
      duration: 42,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Mock Court</h1>
        <p className="text-muted-foreground">
          Practice advocacy skills with AI Judge and opposing counsel in realistic court scenarios
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-2xl font-bold text-navy">12</p>
              </div>
              <Gavel className="h-8 w-8 text-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold text-navy">78%</p>
              </div>
              <Trophy className="h-8 w-8 text-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Court Time</p>
                <p className="text-2xl font-bold text-navy">8.5h</p>
              </div>
              <Clock className="h-8 w-8 text-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cases Won</p>
                <p className="text-2xl font-bold text-navy">9/12</p>
              </div>
              <Award className="h-8 w-8 text-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Available Cases */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy">
                <Target className="h-5 w-5" />
                Available Cases
              </CardTitle>
              <CardDescription>
                Choose a case to practice your advocacy skills
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCourtCases.map((courtCase) => (
                <Card 
                  key={courtCase.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCase === courtCase.id ? 'ring-2 ring-navy' : ''
                  }`}
                  onClick={() => setSelectedCase(courtCase.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold text-navy">{courtCase.title}</h3>
                          <div className="flex gap-2">
                            <Badge className={getCaseTypeColor(courtCase.caseType)}>
                              {courtCase.caseType}
                            </Badge>
                            <Badge className={getDifficultyColor(courtCase.difficulty)}>
                              {courtCase.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {courtCase.estimatedTime}min
                          </div>
                          {courtCase.completed && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <Trophy className="h-4 w-4" />
                              {courtCase.bestScore}%
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {courtCase.facts}
                      </p>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Legal Issues:</p>
                        <div className="flex flex-wrap gap-1">
                          {courtCase.legalIssues.slice(0, 3).map((issue, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                          {courtCase.legalIssues.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{courtCase.legalIssues.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {courtCase.completed && courtCase.bestScore && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Best Performance</span>
                            <span>{courtCase.bestScore}% ({courtCase.attempts} attempts)</span>
                          </div>
                          <Progress value={courtCase.bestScore} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-navy hover:bg-navy-light">
                          <Play className="h-4 w-4 mr-2" />
                          {courtCase.completed ? 'Practice Again' : 'Start Session'}
                        </Button>
                        
                        {courtCase.completed && (
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Recent Sessions & Tips */}
        <div className="space-y-6">
          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSessions.map((session, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm line-clamp-1">{session.caseTitle}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {session.date.toLocaleDateString()}
                    </span>
                    <Badge variant={session.score >= 80 ? "default" : session.score >= 60 ? "secondary" : "destructive"} className="text-xs">
                      {session.score}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {session.duration}min
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Court Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-navy">Advocacy Skills</CardTitle>
              <CardDescription>Areas evaluated in mock court</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { skill: 'IRAC Structure', score: 85 },
                { skill: 'Legal Authorities', score: 78 },
                { skill: 'Oral Advocacy', score: 72 },
                { skill: 'Case Analysis', score: 88 },
                { skill: 'Court Etiquette', score: 92 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-muted-foreground">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy">
                <Book className="h-5 w-5" />
                Court Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                <h4 className="font-medium text-sm mb-1">Structure Arguments</h4>
                <p className="text-xs text-muted-foreground">
                  Use IRAC: Issue, Rule, Application, Conclusion for clear legal reasoning
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="font-medium text-sm mb-1">Cite Authorities</h4>
                <p className="text-xs text-muted-foreground">
                  Support arguments with relevant case laws and statutory provisions
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-medium text-sm mb-1">Be Respectful</h4>
                <p className="text-xs text-muted-foreground">
                  Address the court properly and maintain professional decorum
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockCourt;