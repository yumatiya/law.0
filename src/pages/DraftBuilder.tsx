import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Save, Download, Sparkles, History, Files } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DraftTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  sections: string[];
}

const DraftBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [draftContent, setDraftContent] = useState<string>("");
  const [clientDetails, setClientDetails] = useState({
    name: "",
    address: "",
    contact: ""
  });

  const draftTemplates: DraftTemplate[] = [
    {
      id: "lease-deed",
      name: "Lease Deed",
      type: "Property",
      description: "Standard residential/commercial lease agreement",
      sections: ["Parties", "Property Details", "Terms", "Rent", "Conditions", "Signatures"]
    },
    {
      id: "sale-deed",
      name: "Sale Deed",
      type: "Property", 
      description: "Property sale and transfer document",
      sections: ["Vendor Details", "Purchaser Details", "Property Description", "Consideration", "Terms"]
    },
    {
      id: "power-attorney",
      name: "Power of Attorney",
      type: "Authorization",
      description: "General/Special power of attorney document",
      sections: ["Principal", "Agent", "Powers Granted", "Duration", "Revocation"]
    },
    {
      id: "legal-notice",
      name: "Legal Notice",
      type: "Notice",
      description: "Formal legal notice under various acts",
      sections: ["Addressee", "Facts", "Legal Basis", "Demand", "Consequences"]
    },
    {
      id: "contract-agreement",
      name: "Contract Agreement",
      type: "Commercial",
      description: "Business contract and service agreements",
      sections: ["Parties", "Scope of Work", "Payment Terms", "Timeline", "Termination"]
    },
    {
      id: "will-testament",
      name: "Will & Testament",
      type: "Estate",
      description: "Last will and testament document",
      sections: ["Testator", "Beneficiaries", "Assets", "Executors", "Conditions"]
    }
  ];

  const recentDrafts = [
    { id: 1, name: "Property Sale Agreement - Sharma vs Kumar", type: "Sale Deed", lastModified: "2 hours ago", status: "Draft" },
    { id: 2, name: "Legal Notice - Breach of Contract", type: "Legal Notice", lastModified: "1 day ago", status: "Completed" },
    { id: 3, name: "Power of Attorney - Financial Matters", type: "Power of Attorney", lastModified: "3 days ago", status: "Review" }
  ];

  const generateDraftWithAI = () => {
    const template = draftTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const sampleContent = `DRAFT ${template.name.toUpperCase()}

This ${template.name} is executed on this _____ day of _______, 2024.

BETWEEN:

${clientDetails.name || "[CLIENT NAME]"}, son/daughter of _________, aged about _____ years, 
residing at ${clientDetails.address || "[CLIENT ADDRESS]"}, 
(hereinafter referred to as "the First Party")

AND

[SECOND PARTY NAME], son/daughter of _________, aged about _____ years,
residing at [SECOND PARTY ADDRESS],
(hereinafter referred to as "the Second Party")

WHEREAS, ${template.description}...

[This draft has been generated using AI assistance. Please review all clauses carefully and customize as per your specific requirements.]

NOW THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. [Section content will be generated based on selected template]
2. [Additional clauses as per legal requirements]
3. [Terms and conditions specific to this agreement]

IN WITNESS WHEREOF, the parties have executed this ${template.name} on the date first written above.

FIRST PARTY: _________________
${clientDetails.name || "[CLIENT NAME]"}

SECOND PARTY: _________________
[SECOND PARTY NAME]

WITNESSES:
1. _________________
2. _________________`;

    setDraftContent(sampleContent);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Legal Draft Builder</h1>
          <p className="text-muted-foreground">Create professional legal documents with AI assistance</p>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="builder">Draft Builder</TabsTrigger>
            <TabsTrigger value="history">Recent Drafts</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftTemplates.map((template) => (
                <Card key={template.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Files className="h-8 w-8 text-gold" />
                      <Badge variant="secondary">{template.type}</Badge>
                    </div>
                    <CardTitle className="text-navy">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Sections Included:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.sections.map((section, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{section}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setSelectedTemplate(template.id);
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-navy">Client Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={clientDetails.name}
                        onChange={(e) => setClientDetails({...clientDetails, name: e.target.value})}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientAddress">Address</Label>
                      <Textarea
                        id="clientAddress"
                        value={clientDetails.address}
                        onChange={(e) => setClientDetails({...clientDetails, address: e.target.value})}
                        placeholder="Enter client address"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientContact">Contact</Label>
                      <Input
                        id="clientContact"
                        value={clientDetails.contact}
                        onChange={(e) => setClientDetails({...clientDetails, contact: e.target.value})}
                        placeholder="Phone/Email"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-navy">Template Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Document Type</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          {draftTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={generateDraftWithAI} 
                      disabled={!selectedTemplate}
                      className="w-full"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate with AI
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-navy">Draft Editor</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      placeholder="Your legal draft will appear here. Select a template and click 'Generate with AI' to get started."
                      className="min-h-96 font-mono text-sm"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {recentDrafts.map((draft) => (
                <Card key={draft.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-gold/10">
                          <FileText className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy">{draft.name}</h3>
                          <p className="text-sm text-muted-foreground">{draft.type} • {draft.lastModified}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={draft.status === 'Completed' ? 'default' : 'secondary'}>
                          {draft.status}
                        </Badge>
                        <Button variant="outline" size="sm">Open</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DraftBuilder;