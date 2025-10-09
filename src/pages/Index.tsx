import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Target, Users, FileText, BarChart, Scale, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { state } = useApp();

  const getQuickActionsByProfile = () => {
    const baseActions = [
      { icon: Sparkles, label: "AI Assistant", description: "Get instant help and explanations", href: "/chat" },
      { icon: Target, label: "Practice Hub", description: "Take tests and track progress", href: "/practice" },
      { icon: BookOpen, label: "Library", description: "Access study materials", href: "/library" }
    ];

    if (state.currentProfile === 'lawyer') {
      return [
        ...baseActions,
        { icon: Users, label: "Mock Court", description: "Practice with AI judge & counsel", href: "/mock-court" },
        { icon: FileText, label: "Draft Builder", description: "Create legal documents", href: "/draft-builder" },
        { icon: Scale, label: "Statute Navigator", description: "Navigate and analyze laws", href: "/statute-navigation" }
      ];
    }

    return [
      ...baseActions,
      { icon: BarChart, label: "Analytics", description: "View your progress stats", href: "/analytics" }
    ];
  };

  const quickActions = getQuickActionsByProfile();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-navy mb-4">
            Welcome back to Law.Gen
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered learning companion for {state.currentProfile === 'school' ? 'school studies' : state.currentProfile === 'college' ? 'university education' : 'legal practice'}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link key={index} to={action.href}>
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-navy mb-1">{action.label}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Profile & Settings Access */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile Settings
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              App Settings
            </Button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-navy text-center">
            Your Complete Learning Ecosystem
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-gold mx-auto mb-4" />
                <CardTitle className="text-navy">AI-Powered Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get personalized explanations, step-by-step solutions, and instant doubt resolution with citations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-gold mx-auto mb-4" />
                <CardTitle className="text-navy">Smart Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Adaptive tests, progress tracking, and performance analytics to maximize your growth
                </p>
              </CardContent>
            </Card>

            {state.currentProfile === 'lawyer' ? (
              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 text-gold mx-auto mb-4" />
                  <CardTitle className="text-navy">Professional Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Real legal practice with mock courts, document drafting, and case analysis
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center">
                <CardHeader>
                  <BookOpen className="h-12 w-12 text-gold mx-auto mb-4" />
                  <CardTitle className="text-navy">Comprehensive Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Curriculum-aligned content with interactive flashcards and concept maps
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Daily Goals & Stats */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Today's Progress</CardTitle>
                <CardDescription>Keep up the great work!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Daily Study Goal</span>
                  <span className="text-sm text-muted-foreground">45 min / 60 min</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gold h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-navy">12</p>
                    <p className="text-xs text-muted-foreground">Questions Solved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">5</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Recent Activity</CardTitle>
                <CardDescription>Your latest learning sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Math Problem Solved</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Practice Test: 85%</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>

                {state.currentProfile === 'lawyer' && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mock Court Session</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
