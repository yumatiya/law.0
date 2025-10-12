import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, TrendingUp, FileText, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FinanceLaw = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const askQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Missing Question",
        description: "Please enter your question.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('finance-law-advisor', {
        body: { question }
      });

      if (error) throw error;

      setResponse(data.response);
      toast({
        title: "Response Received",
        description: "Your finance and law guidance is ready."
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const topics = [
    {
      title: "Starting a Business",
      description: "Registration, licenses, and compliance",
      icon: TrendingUp
    },
    {
      title: "Taxation",
      description: "GST, Income Tax, and TDS",
      icon: DollarSign
    },
    {
      title: "Investment Laws",
      description: "Securities, FDI, and regulations",
      icon: FileText
    },
    {
      title: "Intellectual Property",
      description: "Patents, trademarks, and copyrights",
      icon: HelpCircle
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <DollarSign className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Finance + Law Advisor</h1>
        </div>
        <p className="text-muted-foreground">
          Understanding money and legal rights for businesses and startups
        </p>
      </div>

      <Tabs defaultValue="advisor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="advisor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ask Your Question</CardTitle>
              <CardDescription>
                Get guidance on business law, taxation, and financial regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: How do I register my startup in India? What are the tax implications?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
              />
              <Button 
                onClick={askQuestion} 
                disabled={isLoading}
                className="w-full"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                {isLoading ? 'Getting Answer...' : 'Get Answer'}
              </Button>

              {response && (
                <div className="mt-6 p-6 rounded-lg bg-muted">
                  <h3 className="font-semibold mb-3">Response:</h3>
                  <div className="whitespace-pre-wrap text-sm">{response}</div>
                  <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                    This is for educational purposes only — not professional advice. Consult a qualified professional.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic, index) => {
              const IconComponent = topic.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <IconComponent className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceLaw;
