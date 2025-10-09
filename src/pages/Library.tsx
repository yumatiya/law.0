import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  FileText, 
  Download,
  Search,
  Filter,
  Star,
  Clock,
  Tag,
  Share,
  Heart,
  BookmarkPlus
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface LibraryItem {
  id: string;
  title: string;
  type: 'note' | 'flashcard' | 'document' | 'answer';
  subject: string;
  content: string;
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
  source?: string;
  language?: string;
}

const Library = () => {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Generate library items based on profile
  const getLibraryItemsByProfile = () => {
    if (state.currentProfile === 'school') {
      return [
        {
          id: "1",
          title: "NCERT Mathematics Class 10 - Hindi",
          type: "document" as const,
          subject: "Mathematics",
          content: "Complete NCERT textbook for Class 10 Mathematics in Hindi with solutions...",
          tags: ["ncert", "class10", "mathematics", "hindi"],
          createdAt: "2024-01-15",
          isFavorite: true,
          language: "Hindi"
        },
        {
          id: "2", 
          title: "NCERT Science Class 9 - English",
          type: "document" as const,
          subject: "Science",
          content: "Complete NCERT Science textbook for Class 9 in English with experiments...",
          tags: ["ncert", "class9", "science", "english"],
          createdAt: "2024-01-14",
          isFavorite: false,
          language: "English"
        },
        {
          id: "3",
          title: "Hindi Grammar Guide - Class 8",
          type: "note" as const,
          subject: "Hindi",
          content: "व्याकरण के नियम और उदाहरण कक्षा 8 के लिए...",
          tags: ["hindi", "grammar", "class8"],
          createdAt: "2024-01-13",
          isFavorite: true,
          language: "Hindi"
        },
        {
          id: "4",
          title: "NCERT Social Science - Gujarati",
          type: "document" as const,
          subject: "Social Science", 
          content: "સામાજિક વિજ્ઞાન કક્ષા 7 માટે NCERT પુસ્તક ગુજરાતીમાં...",
          tags: ["ncert", "social science", "gujarati", "class7"],
          createdAt: "2024-01-12",
          isFavorite: false,
          language: "Gujarati"
        },
        {
          id: "5",
          title: "English Literature Notes - Class 12",
          type: "note" as const,
          subject: "English",
          content: "Comprehensive notes on English literature for Class 12 board exams...",
          tags: ["english", "literature", "class12", "board"],
          createdAt: "2024-01-11",
          isFavorite: true,
          language: "English"
        },
        {
          id: "6",
          title: "NCERT History - Tamil",
          type: "document" as const,
          subject: "History",
          content: "வரலாறு புத்தகம் வகுப்பு 6 தமிழில்...",
          tags: ["ncert", "history", "tamil", "class6"],
          createdAt: "2024-01-10",
          isFavorite: false,
          language: "Tamil"
        }
      ];
    } else if (state.currentProfile === 'college') {
      return [
        {
          id: "1",
          title: "Engineering Mathematics - Advanced Calculus",
          type: "document" as const,
          subject: "Mathematics",
          content: "Advanced mathematics for engineering students - Calculus, Linear Algebra, Differential Equations...",
          tags: ["engineering", "mathematics", "calculus", "btech"],
          createdAt: "2024-01-15",
          isFavorite: true
        },
        {
          id: "2", 
          title: "Computer Networks - CSE Notes",
          type: "note" as const,
          subject: "Computer Science",
          content: "Detailed notes on networking protocols, OSI model, TCP/IP stack...",
          tags: ["networking", "protocols", "computer science", "cse"],
          createdAt: "2024-01-14",
          isFavorite: false
        },
        {
          id: "3",
          title: "MBA Case Studies Collection",
          type: "document" as const,
          subject: "Management",
          content: "Collection of business case studies for MBA students with analysis...",
          tags: ["mba", "case studies", "business", "management"],
          createdAt: "2024-01-13",
          isFavorite: true
        },
        {
          id: "4",
          title: "Pharmaceutical Chemistry Notes",
          type: "note" as const,
          subject: "Pharmacy", 
          content: "Essential pharmaceutical chemistry notes with drug interactions...",
          tags: ["pharmacy", "chemistry", "drugs", "bpharm"],
          createdAt: "2024-01-12",
          isFavorite: false
        },
        {
          id: "5",
          title: "Human Anatomy Reference - MBBS",
          type: "document" as const,
          subject: "Medical",
          content: "Comprehensive human anatomy guide with detailed diagrams for MBBS...",
          tags: ["medical", "anatomy", "mbbs", "diagrams"],
          createdAt: "2024-01-11",
          isFavorite: true
        },
        {
          id: "6",
          title: "Constitutional Law for LLB",
          type: "note" as const,
          subject: "Law",
          content: "Constitutional law notes covering fundamental rights, DPSP, and parliamentary system...",
          tags: ["law", "constitution", "llb", "rights"],
          createdAt: "2024-01-10",
          isFavorite: false
        }
      ];
    } else {
      return [
        {
          id: "1",
          title: "Ratanlal & Dhirajlal - IPC Commentary",
          type: "document" as const,
          subject: "Criminal Law",
          content: "Comprehensive commentary on Indian Penal Code with latest amendments and case laws...",
          tags: ["ipc", "criminal law", "commentary", "ratanlal"],
          createdAt: "2024-01-15",
          isFavorite: true
        },
        {
          id: "2", 
          title: "Supreme Court Landmark Judgments",
          type: "document" as const,
          subject: "Constitutional Law",
          content: "Collection of landmark Supreme Court judgments on constitutional matters...",
          tags: ["constitution", "judgments", "supreme court", "landmark"],
          createdAt: "2024-01-14",
          isFavorite: false
        },
        {
          id: "3",
          title: "Pollock & Mulla - Contract Law",
          type: "document" as const,
          subject: "Contract Law",
          content: "Authoritative text on Indian Contract Act with case laws and precedents...",
          tags: ["contracts", "pollock", "mulla", "precedents"],
          createdAt: "2024-01-13",
          isFavorite: true
        },
        {
          id: "4",
          title: "Sarkar on Evidence Act",
          type: "document" as const,
          subject: "Evidence Law", 
          content: "Comprehensive commentary on Indian Evidence Act with recent amendments...",
          tags: ["evidence", "sarkar", "commentary", "provisions"],
          createdAt: "2024-01-12",
          isFavorite: false
        },
        {
          id: "5",
          title: "Mulla's Code of Civil Procedure",
          type: "document" as const,
          subject: "Civil Law",
          content: "Complete commentary on Civil Procedure Code with practical applications...",
          tags: ["cpc", "civil procedure", "mulla", "commentary"],
          createdAt: "2024-01-11",
          isFavorite: true
        },
        {
          id: "6",
          title: "Law Commission Reports",
          type: "document" as const,
          subject: "Legal Research",
          content: "Collection of important Law Commission of India reports and recommendations...",
          tags: ["law commission", "reports", "recommendations", "research"],
          createdAt: "2024-01-10",
          isFavorite: false
        }
      ];
    }
  };

  const libraryItems: LibraryItem[] = getLibraryItemsByProfile();

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'note': return FileText;
      case 'flashcard': return BookmarkPlus;
      case 'document': return BookOpen;
      case 'answer': return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note': return 'bg-blue-100 text-blue-800';
      case 'flashcard': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-purple-100 text-purple-800';
      case 'answer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">
            {state.currentProfile === 'school' ? 'NCERT Library' : 
             state.currentProfile === 'college' ? 'Academic Library' : 
             'Legal Library'}
          </h1>
          <p className="text-muted-foreground">
            {state.currentProfile === 'school' ? 'Complete NCERT books for all grades in multiple Indian languages' : 
             state.currentProfile === 'college' ? 'Comprehensive study materials for all academic streams' : 
             'Complete collection of legal texts, cases, and commentaries'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${state.currentProfile === 'school' ? 'NCERT books' : state.currentProfile === 'college' ? 'academic materials' : 'legal resources'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'document', 'note', 'flashcard', 'answer'].map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-gold mr-3" />
                <div>
                  <p className="text-2xl font-bold text-navy">{libraryItems.length}</p>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-gold mr-3" />
                <div>
                  <p className="text-2xl font-bold text-navy">{libraryItems.filter(item => item.isFavorite).length}</p>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-gold mr-3" />
                <div>
                  <p className="text-2xl font-bold text-navy">4</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Tag className="h-8 w-8 text-gold mr-3" />
                <div>
                  <p className="text-2xl font-bold text-navy">
                    {state.currentProfile === 'school' ? '12' : 
                     state.currentProfile === 'college' ? '15' : '8'}
                  </p>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="grid" className="space-y-6">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const IconComponent = getTypeIcon(item.type);
                return (
                  <Card key={item.id} className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <IconComponent className="h-8 w-8 text-gold" />
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                          {item.language && (
                            <Badge variant="outline">
                              {item.language}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-navy">{item.title}</CardTitle>
                      <CardDescription>{item.subject}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {item.createdAt}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Open
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {filteredItems.map((item) => {
              const IconComponent = getTypeIcon(item.type);
              return (
                <Card key={item.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <IconComponent className="h-8 w-8 text-gold" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-navy">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.subject} • {item.createdAt}</p>
                          <div className="flex gap-1 mt-1">
                            <Badge className={getTypeColor(item.type)}>
                              {item.type}
                            </Badge>
                            {item.language && (
                              <Badge variant="outline">
                                {item.language}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Open
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Library;