import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Rocket, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StartupBuilder = () => {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateDocuments = async () => {
    if (!businessName || !businessType) {
      toast({
        title: "Missing Information",
        description: "Please provide business name and type",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('startup-builder', {
        body: { businessName, businessType }
      });

      if (error) throw error;
      setDocuments(data.documents);
      toast({
        title: "Success",
        description: "Legal documents generated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate documents",
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
            <Rocket className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">AI Legal Startup Builder</CardTitle>
          <CardDescription>
            Create your legal startup from registration to compliance with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <Input
              placeholder="Business Type (e.g., LLP, Pvt Ltd)"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
            />
          </div>

          <Button onClick={generateDocuments} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Documents...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Legal Documents
              </>
            )}
          </Button>

          {Object.keys(documents).length > 0 && (
            <Tabs defaultValue="moa" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="moa">MoA</TabsTrigger>
                <TabsTrigger value="partnership">Partnership Deed</TabsTrigger>
                <TabsTrigger value="nda">NDA</TabsTrigger>
              </TabsList>
              {Object.entries(documents).map(([key, content]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <pre className="whitespace-pre-wrap text-sm">{content}</pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupBuilder;
