import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Shield, AlertCircle, FileText, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RightsGuardian = () => {
  const [situation, setSituation] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeSituation = async () => {
    if (!situation.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your situation.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('rights-guardian', {
        body: { situation }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your rights analysis is ready."
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze situation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const commonRights = [
    {
      title: "Right to Equality (Article 14-18)",
      description: "Equality before law and equal protection of laws"
    },
    {
      title: "Right to Freedom (Article 19-22)",
      description: "Freedom of speech, movement, association, profession"
    },
    {
      title: "Right against Exploitation (Article 23-24)",
      description: "Prohibition of human trafficking and child labor"
    },
    {
      title: "Right to Freedom of Religion (Article 25-28)",
      description: "Freedom of conscience and free profession of religion"
    },
    {
      title: "Cultural and Educational Rights (Article 29-30)",
      description: "Protection of interests of minorities"
    },
    {
      title: "Right to Constitutional Remedies (Article 32)",
      description: "Right to move Supreme Court for enforcement of rights"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Rights Guardian</h1>
        </div>
        <p className="text-muted-foreground">
          Understand your fundamental rights and get guidance on legal remedies
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This is for educational purposes only. For legal action, please consult a qualified lawyer or legal aid service.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Describe Your Situation</CardTitle>
            <CardDescription>
              Tell us about your rights concern or violation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: I was denied employment based on my caste/religion..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              rows={6}
            />
            <Button 
              onClick={analyzeSituation} 
              disabled={isAnalyzing}
              className="w-full"
            >
              <Shield className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze My Rights'}
            </Button>

            {analysis && (
              <div className="mt-6 p-6 rounded-lg bg-muted">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Rights Analysis
                </h3>
                <div className="whitespace-pre-wrap text-sm">{analysis}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>Important helpline numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded bg-muted">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Police</p>
                <p className="text-sm text-muted-foreground">100</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded bg-muted">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Women Helpline</p>
                <p className="text-sm text-muted-foreground">1091</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded bg-muted">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Child Helpline</p>
                <p className="text-sm text-muted-foreground">1098</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded bg-muted">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Legal Aid</p>
                <p className="text-sm text-muted-foreground">15100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fundamental Rights of India</CardTitle>
          <CardDescription>Your constitutional protections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {commonRights.map((right, index) => (
              <div key={index} className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">{right.title}</h3>
                <p className="text-sm text-muted-foreground">{right.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightsGuardian;
