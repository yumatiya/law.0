import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import '../../../src/types/speech';

interface VoiceAssistantProps {
  onVoiceInput?: (text: string) => void;
}

const INDIAN_LANGUAGES = [
  { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'en-IN', name: 'English', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

export const VoiceAssistant = ({ onVoiceInput }: VoiceAssistantProps) => {
  const { state } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('hi-IN');
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const hasRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      const hasSynthesis = 'speechSynthesis' in window;
      setIsSupported(hasRecognition && hasSynthesis);
    }
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionConstructor();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = currentLanguage;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript && onVoiceInput) {
          onVoiceInput(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, isSupported, onVoiceInput]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getWelcomeMessage = () => {
    const messages = {
      'hi-IN': `नमस्ते! मैं आपका AI सहायक हूँ। ${state.currentProfile} मोड में आपकी मदद करने के लिए तैयार हूँ।`,
      'en-IN': `Hello! I'm your AI assistant ready to help you in ${state.currentProfile} mode.`,
      'gu-IN': `નમસ્તે! હું તમારો AI સહાયક છું અને ${state.currentProfile} મોડમાં મદદ કરવા તૈયાર છું।`,
      'ta-IN': `வணக்கம்! நான் உங்கள் AI உதவியாளர், ${state.currentProfile} பயன்முறையில் உதவ தயார்.`,
      'te-IN': `నమస్కారం! నేను మీ AI సహాయకుడిని, ${state.currentProfile} మోడ్‌లో సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.`
    };
    return messages[currentLanguage as keyof typeof messages] || messages['en-IN'];
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Voice features are not supported in this browser.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4 space-y-4">
        {/* Language Selector */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            Voice Assistant
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="h-8 w-8 p-0"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </div>

        {showLanguageSelector && (
          <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
            {INDIAN_LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setCurrentLanguage(lang.code);
                  setShowLanguageSelector(false);
                }}
                className="justify-start text-xs"
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </div>
        )}

        {/* Voice Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            className="rounded-full h-16 w-16"
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            variant={isSpeaking ? "destructive" : "outline"}
            size="lg"
            onClick={isSpeaking ? stopSpeaking : () => speak(getWelcomeMessage())}
            className="rounded-full h-16 w-16"
          >
            {isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
        </div>

        {/* Status */}
        <div className="text-center space-y-2">
          {isListening && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-pulse h-2 w-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-600">Listening...</span>
            </div>
          )}

          {isSpeaking && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-pulse h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-600">Speaking...</span>
            </div>
          )}

          {transcript && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{transcript}</p>
            </div>
          )}
        </div>

        {/* Current Language */}
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            {INDIAN_LANGUAGES.find(lang => lang.code === currentLanguage)?.name || 'English'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};