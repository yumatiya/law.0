import { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  Highlighter,
  Volume2,
  MessageSquare,
  Brain,
  X,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

interface BookViewerProps {
  ebookId: string;
  title: string;
  onClose: () => void;
}

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
  content: string;
}

export const BookViewer = ({ ebookId, title, onClose }: BookViewerProps) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiMode, setAIMode] = useState<'explain' | 'quiz' | 'summary'>('explain');
  const [selectedText, setSelectedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bookRef = useRef<any>();
  const { toast } = useToast();

  useEffect(() => {
    loadChapters();
    loadBookmarks();
    loadProgress();
  }, [ebookId]);

  const loadChapters = async () => {
    const { data, error } = await supabase
      .from('ebook_chapters')
      .select('*')
      .eq('ebook_id', ebookId)
      .order('chapter_number');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load book chapters",
        variant: "destructive"
      });
      return;
    }

    setChapters(data || []);
    setTotalPages((data?.length || 0) * 2); // Assuming 2 pages per chapter for demo
  };

  const loadBookmarks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_bookmarks')
      .select('page_number')
      .eq('ebook_id', ebookId)
      .eq('user_id', user.id);

    if (data) {
      setBookmarks(new Set(data.map(b => b.page_number)));
    }
  };

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('reading_progress')
      .select('current_page')
      .eq('ebook_id', ebookId)
      .eq('user_id', user.id)
      .single();

    if (data) {
      setCurrentPage(data.current_page || 0);
    }
  };

  const saveProgress = async (page: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('reading_progress')
      .upsert({
        user_id: user.id,
        ebook_id: ebookId,
        current_page: page,
        total_pages: totalPages,
        progress_percentage: Math.round((page / totalPages) * 100)
      });
  };

  const toggleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark pages",
        variant: "destructive"
      });
      return;
    }

    const isBookmarked = bookmarks.has(currentPage);

    if (isBookmarked) {
      await supabase
        .from('user_bookmarks')
        .delete()
        .eq('ebook_id', ebookId)
        .eq('user_id', user.id)
        .eq('page_number', currentPage);
      
      const newBookmarks = new Set(bookmarks);
      newBookmarks.delete(currentPage);
      setBookmarks(newBookmarks);
      
      toast({ title: "Bookmark removed" });
    } else {
      await supabase
        .from('user_bookmarks')
        .insert({
          user_id: user.id,
          ebook_id: ebookId,
          page_number: currentPage,
          note: userNote
        });
      
      setBookmarks(new Set(bookmarks).add(currentPage));
      toast({ title: "Page bookmarked" });
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 0) {
      setSelectedText(text);
      setShowAIPanel(true);
    }
  };

  const getAIExplanation = async () => {
    if (!selectedText) return;

    setIsLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke('ebook-ai-assistant', {
        body: { 
          text: selectedText, 
          mode: aiMode,
          bookTitle: title 
        }
      });

      if (error) throw error;
      setAiResponse(data.response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI assistance",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(selectedText || chapters[Math.floor(currentPage / 2)]?.content || '');
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const onFlip = (e: any) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    saveProgress(newPage);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-card">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={bookmarks.has(currentPage) ? "default" : "outline"}
              size="icon"
              onClick={toggleBookmark}
            >
              {bookmarks.has(currentPage) ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant={isSpeaking ? "default" : "outline"}
              size="icon"
              onClick={speakText}
            >
              <Volume2 className="h-5 w-5" />
            </Button>
            <Button
              variant={showAIPanel ? "default" : "outline"}
              size="icon"
              onClick={() => setShowAIPanel(!showAIPanel)}
            >
              <Brain className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Book Viewer */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-8">
            <div className="relative" onMouseUp={handleTextSelection}>
              <HTMLFlipBook
                width={400}
                height={600}
                size="stretch"
                minWidth={315}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onFlip}
                className="shadow-2xl"
                style={{}}
                startPage={currentPage}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={true}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                ref={bookRef}
              >
                {/* Cover Page */}
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-8 flex flex-col items-center justify-center border-r">
                  <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>
                  <div className="text-center text-muted-foreground">
                    LAW.GEN Digital Library
                  </div>
                </div>

                {/* Chapter Pages */}
                {chapters.map((chapter, idx) => (
                  <div key={`chapter-${idx}`} className="bg-background p-8 border-r overflow-auto">
                    <h3 className="text-xl font-bold mb-4">{chapter.title}</h3>
                    <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                      {chapter.content || 'Chapter content will be loaded here...'}
                    </div>
                  </div>
                ))}

                {/* Back Cover */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 p-8 flex items-center justify-center">
                  <p className="text-center text-muted-foreground">End of Book</p>
                </div>
              </HTMLFlipBook>

              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16"
                onClick={() => bookRef.current?.pageFlip().flipPrev()}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16"
                onClick={() => bookRef.current?.pageFlip().flipNext()}
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* AI Assistant Panel */}
          {showAIPanel && (
            <Card className="w-96 border-l flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Assistant
                </h3>
              </div>

              <Tabs value={aiMode} onValueChange={(v) => setAIMode(v as any)} className="flex-1 flex flex-col">
                <TabsList className="m-4">
                  <TabsTrigger value="explain" className="flex-1">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Explain
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="quiz" className="flex-1">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Quiz
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto p-4">
                  {selectedText && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Selected Text:</p>
                      <p className="text-sm text-muted-foreground">{selectedText}</p>
                    </div>
                  )}

                  <TabsContent value="explain" className="mt-0">
                    <Button 
                      onClick={getAIExplanation} 
                      disabled={!selectedText || isLoadingAI}
                      className="w-full mb-4"
                    >
                      {isLoadingAI ? 'Explaining...' : 'Explain This'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="summary" className="mt-0">
                    <Button 
                      onClick={getAIExplanation} 
                      disabled={!selectedText || isLoadingAI}
                      className="w-full mb-4"
                    >
                      {isLoadingAI ? 'Summarizing...' : 'Get Summary'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="quiz" className="mt-0">
                    <Button 
                      onClick={getAIExplanation} 
                      disabled={!selectedText || isLoadingAI}
                      className="w-full mb-4"
                    >
                      {isLoadingAI ? 'Generating...' : 'Generate Quiz'}
                    </Button>
                  </TabsContent>

                  {aiResponse && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <Textarea
                    placeholder="Add your notes here..."
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </Tabs>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
