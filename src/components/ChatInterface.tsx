import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Sparkles, FileText, Target, Users } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  profile: string;
}

const getProfilePrompts = (profile: string) => {
  const prompts = {
    school: [
      "Solve this math problem step-by-step",
      "Explain this science concept",
      "Help with English grammar",
      "Create practice questions"
    ],
    college: [
      "Help with my assignment", 
      "Explain this theory",
      "Generate study notes",
      "Practice viva questions"
    ],
    lawyer: [
      "Draft a legal document",
      "Start mock court session",
      "Analyze this case",
      "Find relevant statutes"
    ]
  };
  return prompts[profile as keyof typeof prompts] || prompts.school;
};

export const ChatInterface = ({ profile }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: `Welcome to Law.Gen ${profile} mode! I'm your AI tutor ready to help with doubts, explanations, and practice. What would you like to learn today?`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const prompts = getProfilePrompts(profile);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${message}". Let me provide a detailed explanation with steps and references. This is a simulated response - in the full app, I would provide comprehensive answers with citations and follow-up questions.`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="outline" size="sm" className="text-xs border-gold text-gold hover:bg-gold hover:text-navy">
          <Sparkles className="h-3 w-3 mr-1" />
          Ask Doubt
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-gold text-gold hover:bg-gold hover:text-navy">
          <FileText className="h-3 w-3 mr-1" />
          Generate Notes
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-gold text-gold hover:bg-gold hover:text-navy">
          <Target className="h-3 w-3 mr-1" />
          Test Me
        </Button>
        {profile === 'lawyer' && (
          <Button variant="outline" size="sm" className="text-xs border-gold text-gold hover:bg-gold hover:text-navy">
            <Users className="h-3 w-3 mr-1" />
            Mock Court
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 border rounded-lg p-4 bg-muted/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
          >
            <Card className={`max-w-[80%] ${message.isBot ? "bg-card" : "bg-navy text-primary-foreground"}`}>
              <CardContent className="p-3">
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => handlePromptClick(prompt)}
            className="text-xs text-left h-auto py-2 px-3 hover:bg-muted"
          >
            {prompt}
          </Button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask any doubt, get clear answers with steps..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
          className="flex-1"
        />
        <Button 
          onClick={() => handleSendMessage(inputValue)}
          className="bg-navy hover:bg-navy-light"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};