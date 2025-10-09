import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Gavel, Users } from 'lucide-react';

const CourtroomVR = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTranscript, setSessionTranscript] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const startSession = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('courtroom-session', {
        body: { action: 'start' }
      });

      if (error) throw error;
      setIsSessionActive(true);
      setSessionTranscript([data.intro]);
      toast({
        title: "Court in Session",
        description: "Interactive courtroom simulation has started"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive"
      });
    }
  };

  const toggleVoice = () => {
    setIsSpeaking(!isSpeaking);
    toast({
      title: isSpeaking ? "Microphone Off" : "Microphone On",
      description: isSpeaking ? "Voice input disabled" : "You can now speak"
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gavel className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">AI Courtroom Simulation 2.0</CardTitle>
                <CardDescription>
                  Voice-interactive courtroom with AI Judge, Lawyers, and real-time feedback
                </CardDescription>
              </div>
            </div>
            {isSessionActive && (
              <Badge variant="default" className="animate-pulse">Live</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isSessionActive ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Ready to enter the courtroom?</h3>
              <p className="text-muted-foreground mb-6">
                Practice your arguments with AI judges and lawyers
              </p>
              <Button onClick={startSession} size="lg">
                Start Court Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Session Active</h3>
                <Button onClick={toggleVoice} variant="outline">
                  {isSpeaking ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Mute
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Speak
                    </>
                  )}
                </Button>
              </div>

              <Card className="bg-secondary/30">
                <CardContent className="pt-6 space-y-3 max-h-96 overflow-y-auto">
                  {sessionTranscript.map((text, idx) => (
                    <p key={idx} className="text-sm">{text}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourtroomVR;
