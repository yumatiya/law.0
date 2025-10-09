import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

const RightsGuardian = () => {
  const [situation, setSituation] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzeRights = async () => {
    if (!situation.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rights-guardian', {
        body: { situation }
      });

      if (error) throw error;
      setAnalysis(data.analysis);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze rights",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">AI Rights Guardian</CardTitle>
          <CardDescription>
            Understand your constitutional rights and how to protect them under Indian law
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">Protecting Citizens' Rights</p>
                <p>Describe any situation where you believe your rights may have been violated, and get guidance on legal steps to take.</p>
              </div>
            </div>
          </div>

          <Textarea
            placeholder="Describe the situation where you believe your rights were violated..."
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={6}
            className="resize-none"
          />

          <Button onClick={analyzeRights} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Rights...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Analyze My Rights
              </>
            )}
          </Button>

          {analysis && (
            <Card className="bg-secondary/30">
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                  {analysis}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RightsGuardian;
