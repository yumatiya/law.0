import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  FileText, 
  Target, 
  Users,
  BookOpen,
  Calculator,
  Zap,
  Download
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { ChatMessage, Source } from "@/types";

const Chat = () => {
  const { state, addChatMessage } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: `Welcome to Law.Gen ${state.currentProfile} mode! I'm your AI tutor ready to help with doubts, explanations, and practice. What would you like to learn today?`,
      isBot: true,
      timestamp: new Date(),
      messageType: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getProfilePrompts = () => {
    const prompts = {
      school: [
        "Solve this quadratic equation: x² + 5x + 6 = 0",
        "Explain photosynthesis with a diagram",
        "Help with English essay on climate change",
        "Create MCQ questions on the French Revolution"
      ],
      college: [
        "Explain database normalization with examples",
        "Help with calculus: integration by parts",
        "Analyze this financial statement",
        "Generate study notes for organic chemistry"
      ],
      lawyer: [
        "Draft a consumer complaint for defective goods",
        "Start mock court session on property dispute",
        "Explain Article 21 of Indian Constitution",
        "Find cases on anticipatory bail"
      ]
    };
    return prompts[state.currentProfile as keyof typeof prompts] || prompts.school;
  };

  const simulateAIResponse = (userMessage: string): ChatMessage => {
    const { generateAIResponse } = require('@/components/ai/AIAssistant');
    return generateAIResponse(userMessage, state.currentProfile || 'school');
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isBot: false,
      timestamp: new Date(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    addChatMessage(userMessage);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = simulateAIResponse(message);
      setMessages(prev => [...prev, botResponse]);
      addChatMessage(botResponse);
      setIsLoading(false);
    }, 1500);
  };

  const quickActions = [
    { icon: Sparkles, label: "Ask Doubt", color: "gold" },
    { icon: FileText, label: "Generate Notes", color: "blue" },
    { icon: Target, label: "Test Me", color: "green" },
    { icon: Calculator, label: "Solve Math", color: "purple" },
    ...(state.currentProfile === 'lawyer' ? [
      { icon: Users, label: "Mock Court", color: "red" },
      { icon: FileText, label: "Draft Document", color: "orange" }
    ] : []),
    { icon: BookOpen, label: "Explain Concept", color: "indigo" }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-navy">
            <Zap className="h-5 w-5 text-gold" />
            AI Study Assistant
            <Badge variant="outline" className="ml-auto border-gold text-gold">
              {state.currentProfile?.toUpperCase()} Mode
            </Badge>
          </CardTitle>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs border-gold/30 text-gold hover:bg-gold hover:text-navy"
                onClick={() => handleSendMessage(`Help me with ${action.label.toLowerCase()}`)}
              >
                <action.icon className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <Card className={`max-w-[85%] ${
                  message.isBot 
                    ? "bg-card shadow-sm" 
                    : "bg-navy text-primary-foreground"
                }`}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <pre className="whitespace-pre-wrap font-sans text-sm">
                        {message.content}
                      </pre>
                      
                      {message.sources && message.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-muted">
                          {message.sources.map((source, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              📚 {source.title}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.isBot && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold"></div>
                      <span className="text-sm text-muted-foreground">AI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {getProfilePrompts().map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => handleSendMessage(prompt)}
                className="text-xs text-left h-auto py-3 px-3 hover:bg-muted border border-muted"
              >
                <Sparkles className="h-3 w-3 mr-2 flex-shrink-0 text-gold" />
                <span className="truncate">{prompt}</span>
              </Button>
            ))}
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Ask any doubt, get clear answers with steps and citations..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  className="min-h-[60px] resize-none pr-20"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 bottom-2 h-8 w-8 p-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="bg-navy hover:bg-navy-light px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;