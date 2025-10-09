import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Newspaper, TrendingUp } from 'lucide-react';

interface NewsItem {
  title: string;
  summary: string;
  date: string;
  category: string;
}

const LegalNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('legal-news-analyzer', {
        body: { action: 'latest' }
      });

      if (error) throw error;
      setNews(data.news || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch legal news",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">AI Legal News & Case Analyzer</CardTitle>
          <CardDescription>
            Stay updated with Supreme Court judgments and criminal law changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent legal updates available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item, idx) => (
                <Card key={idx} className="bg-secondary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <CardDescription>{item.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{item.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalNews;
