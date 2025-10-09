import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, FileSearch, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AnalysisResult {
  strengths: string[];
  weaknesses: string[];
  missingEvidence: string[];
  relatedSections: string[];
}

const EvidenceAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeEvidence = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a case file or document",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('evidence-analyzer', {
          body: { content, fileName: file.name }
        });

        if (error) throw error;
        setAnalysis(data.analysis);
        toast({
          title: "Analysis Complete",
          description: "Evidence has been analyzed successfully"
        });
      };
      reader.readAsText(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze evidence",
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
            <FileSearch className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">AI Evidence Analyzer</CardTitle>
          <CardDescription>
            Upload case files for AI analysis - highlights strengths, weaknesses, and missing evidence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <label className="cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
              />
              <Button variant="outline" asChild>
                <span>
                  {file ? file.name : 'Choose File'}
                </span>
              </Button>
            </label>
            <p className="text-sm text-muted-foreground mt-2">
              Support for PDF, DOC, DOCX, TXT files
            </p>
          </div>

          <Button onClick={analyzeEvidence} disabled={isLoading || !file} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Evidence...
              </>
            ) : (
              <>
                <FileSearch className="mr-2 h-4 w-4" />
                Analyze Evidence
              </>
            )}
          </Button>

          {analysis && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">Strengths</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((item, idx) => (
                      <li key={idx} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-lg">Weaknesses</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((item, idx) => (
                      <li key={idx} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="text-lg">Missing Evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.missingEvidence.map((item, idx) => (
                      <li key={idx} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-lg">Related IPC Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.relatedSections.map((item, idx) => (
                      <li key={idx} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidenceAnalyzer;
