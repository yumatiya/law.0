import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Scale, FileText, Star, Clock, Bookmark } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

interface Statute {
  id: string;
  title: string;
  shortTitle: string;
  year: number;
  category: string;
  sections: number;
  chapters: number;
  lastUpdated: string;
  description: string;
  keyProvisions: string[];
}

interface Section {
  number: string;
  title: string;
  content: string;
  amendments: string[];
  relatedSections: string[];
  caseReferences: string[];
}

const StatuteNavigation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatute, setSelectedStatute] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  const statutes: Statute[] = [
    {
      id: "ipc",
      title: "Indian Penal Code",
      shortTitle: "IPC",
      year: 1860,
      category: "Criminal Law",
      sections: 511,
      chapters: 23,
      lastUpdated: "2023",
      description: "The main criminal code of India",
      keyProvisions: ["Theft", "Murder", "Rape", "Fraud", "Assault"]
    },
    {
      id: "crpc",
      title: "Code of Criminal Procedure",
      shortTitle: "CrPC",
      year: 1973,
      category: "Criminal Procedure",
      sections: 484,
      chapters: 37,
      lastUpdated: "2023",
      description: "Criminal procedure law in India",
      keyProvisions: ["Arrest", "Investigation", "Trial", "Appeal", "Bail"]
    },
    {
      id: "cpc",
      title: "Code of Civil Procedure",
      shortTitle: "CPC",
      year: 1908,
      category: "Civil Procedure",
      sections: 158,
      chapters: 21,
      lastUpdated: "2023",
      description: "Civil procedure law in India",
      keyProvisions: ["Suits", "Pleadings", "Trial", "Decree", "Execution"]
    },
    {
      id: "constitution",
      title: "Constitution of India",
      shortTitle: "Constitution",
      year: 1950,
      category: "Constitutional Law",
      sections: 448,
      chapters: 25,
      lastUpdated: "2023",
      description: "Supreme law of India",
      keyProvisions: ["Fundamental Rights", "DPSP", "Emergency", "Parliament", "Judiciary"]
    },
    {
      id: "evidence-act",
      title: "Indian Evidence Act",
      shortTitle: "Evidence Act",
      year: 1872,
      category: "Evidence Law",
      sections: 167,
      chapters: 11,
      lastUpdated: "2023",
      description: "Law of evidence in India",
      keyProvisions: ["Relevancy", "Admission", "Confession", "Expert Opinion", "Burden of Proof"]
    },
    {
      id: "contract-act",
      title: "Indian Contract Act",
      shortTitle: "Contract Act",
      year: 1872,
      category: "Contract Law",
      sections: 266,
      chapters: 11,
      lastUpdated: "2023",
      description: "Law relating to contracts in India",
      keyProvisions: ["Agreement", "Consideration", "Breach", "Remedies", "Specific Performance"]
    }
  ];

  const sampleSections: Section[] = [
    {
      number: "302",
      title: "Punishment for murder",
      content: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
      amendments: ["Amendment in 2013", "Supreme Court guidelines"],
      relatedSections: ["300", "301", "303", "304"],
      caseReferences: ["Bachan Singh v. State of Punjab", "Machhi Singh v. State of Punjab"]
    },
    {
      number: "420",
      title: "Cheating and dishonestly inducing delivery of property",
      content: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
      amendments: ["Amendment in 2013"],
      relatedSections: ["415", "417", "418", "419"],
      caseReferences: ["State of Maharashtra v. Dr. Praful B. Desai", "V.Y. Jose v. State of Gujarat"]
    }
  ];

  const recentlyViewed = [
    { section: "IPC 302", title: "Punishment for murder", time: "2 hours ago" },
    { section: "CrPC 41", title: "When police may arrest without warrant", time: "1 day ago" },
    { section: "Constitution Art 21", title: "Right to life and personal liberty", time: "2 days ago" }
  ];

  const bookmarked = [
    { section: "IPC 420", title: "Cheating and dishonestly inducing delivery of property" },
    { section: "CPC Order 6", title: "Pleadings generally" },
    { section: "Evidence Act 101", title: "Burden of proof" }
  ];

  const filteredStatutes = statutes.filter(statute =>
    statute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    statute.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    statute.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Statute Navigation & Analysis</h1>
          <p className="text-muted-foreground">Navigate through Indian statutes with AI-powered analysis</p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Statutes</TabsTrigger>
            <TabsTrigger value="search">Search Sections</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search statutes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStatutes.map((statute) => (
                <Card key={statute.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <BookOpen className="h-8 w-8 text-gold" />
                      <Badge variant="secondary">{statute.category}</Badge>
                    </div>
                    <CardTitle className="text-navy">{statute.shortTitle}</CardTitle>
                    <CardDescription>{statute.title} ({statute.year})</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{statute.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Sections:</span> {statute.sections}
                        </div>
                        <div>
                          <span className="font-medium">Chapters:</span> {statute.chapters}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Key Provisions:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {statute.keyProvisions.slice(0, 3).map((provision, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{provision}</Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" onClick={() => setSelectedStatute(statute.id)}>
                        Explore Sections
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-navy">Quick Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Recently Viewed</h4>
                      <div className="space-y-2">
                        {recentlyViewed.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.section}</p>
                              <p className="text-xs text-muted-foreground">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-navy">Section Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {sampleSections.map((section) => (
                        <div key={section.number} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-navy">
                              Section {section.number}: {section.title}
                            </h3>
                            <Button variant="outline" size="sm">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="prose prose-sm max-w-none mb-4">
                            <p>{section.content}</p>
                          </div>

                          <Accordion type="single" collapsible>
                            <AccordionItem value="related">
                              <AccordionTrigger>Related Sections</AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-wrap gap-2">
                                  {section.relatedSections.map((rel, index) => (
                                    <Badge key={index} variant="outline">{rel}</Badge>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="cases">
                              <AccordionTrigger>Case References</AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-1">
                                  {section.caseReferences.map((case_ref, index) => (
                                    <li key={index} className="text-sm text-muted-foreground">
                                      • {case_ref}
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">AI-Powered Legal Analysis</CardTitle>
                <CardDescription>Get detailed explanations and interpretations of legal provisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input placeholder="Enter section number (e.g., IPC 302, CrPC 41)" className="flex-1" />
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-muted/10">
                    <h4 className="font-medium mb-2">Sample Analysis: IPC Section 302</h4>
                    <div className="space-y-3 text-sm">
                      <p><strong>Plain Language Explanation:</strong> This section deals with the punishment for murder, which is defined under Section 300 of the IPC.</p>
                      <p><strong>Key Elements:</strong> The prosecution must prove intention to cause death, knowledge that the act is likely to cause death, and that death actually occurred.</p>
                      <p><strong>Punishment:</strong> Either death penalty or life imprisonment, plus fine.</p>
                      <p><strong>Recent Developments:</strong> Supreme Court has established guidelines for death penalty in rarest of rare cases.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Bookmarked Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookmarked.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{item.section}</p>
                          <p className="text-sm text-muted-foreground">{item.title}</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Study Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-gold" />
                        <span className="font-medium">IPC 302 - Key Points</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Remember the four categories of culpable homicide amounting to murder...</p>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gold" />
                        <span className="font-medium">Evidence Act 101 - Burden of Proof</span>
                      </div>
                      <p className="text-sm text-muted-foreground">The burden of proving a fact lies on the person who asserts it...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StatuteNavigation;