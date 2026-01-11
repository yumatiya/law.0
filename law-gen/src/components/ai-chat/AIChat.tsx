import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, MessageCircle, X, Bot, User } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: number;
}

interface QuickPrompt {
  id: string;
  label: string;
  prompt: string;
}

const QUICK_PROMPTS: QuickPrompt[] = [
  { id: '1', label: 'Explain this topic', prompt: 'Explain this topic in simple terms.' },
  { id: '2', label: 'Give examples', prompt: 'Can you provide examples related to this?' },
  { id: '3', label: 'Summarize', prompt: 'Please summarize the above content.' },
];

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognition = useRef<any>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.lang = 'en-US';
      recognition.current.interimResults = false;
      recognition.current.maxAlternatives = 1;

      recognition.current.onresult = (event: any) => {
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        }
        setListening(false);
      };

      recognition.current.onend = () => {
        setListening(false);
      };

      setVoiceSupported(true);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const addMessage = (sender: 'user' | 'ai', content: string) => {
    setMessages((msgs) => [
      ...msgs,
      {
        id: Date.now().toString(),
        sender,
        content,
        timestamp: Date.now(),
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const messageToSend = input.trim();
    addMessage('user', messageToSend);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageToSend }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const data = await response.json();
      if (data.response) {
        addMessage('ai', data.response);
      } else {
        addMessage('ai', 'Sorry, I did not get a response.');
      }
    } catch (error) {
      addMessage('ai', 'An error occurred while sending the message.');
    }
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startListening = () => {
    if (recognition.current && !listening) {
      recognition.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition.current && listening) {
      recognition.current.stop();
      setListening(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        aria-label="Toggle AI Chat"
        className="fixed bottom-8 right-8 z-50 bg-brand-navy hover:bg-brand-blue text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-blue/30 animate-pulse"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-8 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-brand-gray flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          <header className="bg-gradient-to-r from-brand-navy to-brand-blue text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Law.Gen AI Tutor</h2>
                <p className="text-xs text-white/80">Your AI Learning Companion</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              aria-label="Close AI Chat"
              className="text-white hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-brand-gray/30 to-white">
            {messages.length === 0 && !isTyping && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-brand-blue mx-auto mb-3 opacity-50" />
                <p className="text-gray-600 text-sm font-medium">Welcome to Law.Gen AI Tutor!</p>
                <p className="text-gray-500 text-xs mt-1">Ask me anything about your legal studies.</p>
              </div>
            )}
            {messages.map(({ id, sender, content }) => (
              <div
                key={id}
                className={`flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300 ${
                  sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {sender === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-navy to-brand-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                    sender === 'user'
                      ? 'bg-gradient-to-r from-brand-blue to-brand-navy text-white rounded-br-md'
                      : 'bg-white border border-brand-gray text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{content}</p>
                </div>
                {sender === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-success to-brand-success/80 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-navy to-brand-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-brand-gray px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </main>

          <footer className="p-3 border-t border-gray-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={2}
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-indigo-500"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex space-x-1">
                {QUICK_PROMPTS.map(({ id, label, prompt }) => (
                  <button
                    key={id}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    aria-label={`Quick prompt: ${label}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                {voiceSupported && (
                  <button
                    onClick={listening ? stopListening : startListening}
                    aria-label={listening ? 'Stop voice input' : 'Start voice input'}
                    className={`p-2 rounded ${
                      listening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
                    } hover:bg-opacity-90`}
                  >
                    {listening ? '🎙️' : '🎤'}
                  </button>
                )}
                <button
                  onClick={sendMessage}
                  className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default AIChat;
