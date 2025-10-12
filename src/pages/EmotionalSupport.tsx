import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Phone, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EmotionalSupport = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Missing Message",
        description: "Please share what's on your mind.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const userMessage = message;
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('emotional-support', {
        body: { message: userMessage }
      });

      if (error) throw error;

      const aiResponse = data.response;
      setChatHistory([
        ...chatHistory,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);
      setResponse(aiResponse);
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

  const supportTopics = [
    {
      title: "Exam Stress",
      description: "Managing anxiety before important tests",
      icon: TrendingUp
    },
    {
      title: "Study-Life Balance",
      description: "Finding time for yourself",
      icon: Heart
    },
    {
      title: "Imposter Syndrome",
      description: "Building confidence in your abilities",
      icon: MessageCircle
    },
    {
      title: "Career Pressure",
      description: "Dealing with expectations",
      icon: Phone
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Emotional Support</h1>
        </div>
        <p className="text-muted-foreground">
          Your caring AI companion for stress, anxiety, and mental wellness
        </p>
      </div>

      <Alert className="mb-6">
        <Heart className="h-4 w-4" />
        <AlertDescription>
          This is a supportive tool, not a replacement for professional mental health care. 
          If you're in crisis, please contact a mental health professional or helpline immediately.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Share Your Feelings</CardTitle>
            <CardDescription>
              I'm here to listen and support you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {chatHistory.length > 0 && (
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {chatHistory.map((chat, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg ${
                      chat.role === 'user' 
                        ? 'bg-primary/10 ml-8' 
                        : 'bg-muted mr-8'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                  </div>
                ))}
              </div>
            )}

            <Textarea
              placeholder="Share what's on your mind... I'm here to listen."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading}
              className="w-full"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {isLoading ? 'Listening...' : 'Send Message'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mental Health Resources</CardTitle>
            <CardDescription>24/7 Professional help</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded bg-muted">
              <p className="font-semibold">NIMHANS Helpline</p>
              <p className="text-sm text-muted-foreground">080-46110007</p>
            </div>
            <div className="p-3 rounded bg-muted">
              <p className="font-semibold">Vandrevala Foundation</p>
              <p className="text-sm text-muted-foreground">1860-2662-345</p>
            </div>
            <div className="p-3 rounded bg-muted">
              <p className="font-semibold">iCall (TISS)</p>
              <p className="text-sm text-muted-foreground">9152987821</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Common Topics</CardTitle>
          <CardDescription>What we can talk about</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {supportTopics.map((topic, index) => {
              const IconComponent = topic.icon;
              return (
                <div key={index} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <IconComponent className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionalSupport;
