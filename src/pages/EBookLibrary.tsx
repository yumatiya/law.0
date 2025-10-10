import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Book, Download, Search, BookOpen, GraduationCap, Scale } from 'lucide-react';

interface EBook {
  id: string;
  title: string;
  mode: string;
  subject: string;
  grade_level?: string;
  stream?: string;
  language: string;
  author?: string;
  description?: string;
  cover_image_url?: string;
}

const EBookLibrary = () => {
  const [ebooks, setEbooks] = useState<EBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMode, setCurrentMode] = useState<'school' | 'college' | 'lawyer'>('school');
  const { toast } = useToast();

  useEffect(() => {
    loadEBooks();
  }, [currentMode]);

  const loadEBooks = async () => {
    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .eq('mode', currentMode)
      .order('title');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load eBooks",
        variant: "destructive"
      });
      return;
    }

    setEbooks(data || []);
  };

  const filteredBooks = ebooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'school': return <BookOpen className="h-5 w-5" />;
      case 'college': return <GraduationCap className="h-5 w-5" />;
      case 'lawyer': return <Scale className="h-5 w-5" />;
      default: return <Book className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Law.Gen eBook Library</h1>
        <p className="text-muted-foreground">Access comprehensive legal and academic resources in multiple languages</p>
      </div>

      <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="school" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            School Mode
          </TabsTrigger>
          <TabsTrigger value="college" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            College Mode
          </TabsTrigger>
          <TabsTrigger value="lawyer" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Lawyer Mode
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="school" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{book.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {book.subject} {book.grade_level && `• Class ${book.grade_level}`}
                          </CardDescription>
                        </div>
                        {getModeIcon(book.mode)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {book.author && (
                          <p className="text-sm text-muted-foreground">By {book.author}</p>
                        )}
                        {book.description && (
                          <p className="text-sm line-clamp-2">{book.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{book.language}</Badge>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No books found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search terms' : 'eBooks will be added soon'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="college" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{book.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {book.subject} {book.stream && `• ${book.stream}`}
                          </CardDescription>
                        </div>
                        {getModeIcon(book.mode)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {book.author && (
                          <p className="text-sm text-muted-foreground">By {book.author}</p>
                        )}
                        {book.description && (
                          <p className="text-sm line-clamp-2">{book.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{book.language}</Badge>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No books found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search terms' : 'eBooks will be added soon'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="lawyer" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <Card key={book.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{book.title}</CardTitle>
                          <CardDescription className="mt-1">{book.subject}</CardDescription>
                        </div>
                        {getModeIcon(book.mode)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {book.author && (
                          <p className="text-sm text-muted-foreground">By {book.author}</p>
                        )}
                        {book.description && (
                          <p className="text-sm line-clamp-2">{book.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{book.language}</Badge>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No books found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search terms' : 'Legal eBooks including Constitution, IPC, CrPC, CPC, and all bare acts will be added soon'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EBookLibrary;
