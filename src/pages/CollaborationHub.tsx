import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, MessageSquare, Send, Shield } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

// Toggle to enable or disable contributor restriction for debugging
const ENABLE_CONTRIBUTOR_RESTRICTION = true;

// Replace this with your actual unique user id or email
const COLLABORATOR_IDENTIFIER = 'your-email@example.com'; // Replace with your actual email or user id

interface Message {
  id: string;
  user: string;
  content: string;
  factCheck?: string;
  timestamp: Date;
}

const CollaborationHub = () => {
  const { state } = useApp();
  const currentUser = state.user;


  const [roomId, setRoomId] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
const channel = supabase
      .channel('room:' + roomId)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineUsers(Object.keys(state).length);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const isContributorAllowed = () => {
    if (!ENABLE_CONTRIBUTOR_RESTRICTION) return true;
    return currentUser?.email === COLLABORATOR_IDENTIFIER;
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!isContributorAllowed()) {
      toast({
        title: "Access Denied",
        description: "You are not authorized to contribute in this room.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('collaboration-hub', {
        body: {
          action: 'send_message',
          roomId,
          message: newMessage
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: isContributorAllowed() ? 'You' : currentUser?.email || 'Unknown',
        content: newMessage,
        factCheck: data.factCheck,
        timestamp: new Date()
      }]);

      setNewMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">AI Collaboration Hub</CardTitle>
                <CardDescription>
                  Real-time discussions with AI moderation and fact-checking
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">{onlineUsers} online</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={roomId === 'general' ? 'default' : 'outline'}
              onClick={() => setRoomId('general')}
            >
              General
            </Button>
            <Button
              variant={roomId === 'students' ? 'default' : 'outline'}
              onClick={() => setRoomId('students')}
            >
              Students
            </Button>
            <Button
              variant={roomId === 'lawyers' ? 'default' : 'outline'}
              onClick={() => setRoomId('lawyers')}
            >
              Lawyers
            </Button>
          </div>

          <Card className="bg-secondary/30 h-96 overflow-y-auto">
            <CardContent className="pt-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{msg.user}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                    {msg.factCheck && (
                      <div className="ml-6 flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg">
                        <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <Badge variant="outline" className="mb-1">AI Fact-Check</Badge>
                          <p className="text-xs">{msg.factCheck}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Input
              placeholder={isContributorAllowed() ? "Type your message..." : "You are not authorized to contribute."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && isContributorAllowed()) {
                  sendMessage();
                }
              }}
              disabled={!isContributorAllowed()}
            />
            <Button
              onClick={sendMessage}
              disabled={!isContributorAllowed()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborationHub;
