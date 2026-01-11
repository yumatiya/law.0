import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Scale, Briefcase, Star, Users } from "lucide-react";
import { useState } from "react";

interface ProfileOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  level: 'basic' | 'advanced' | 'expert';
  popular?: boolean;
}

interface EnhancedProfileSelectorProps {
  onProfileSelect: (profileId: string) => void;
}

const profiles: ProfileOption[] = [
  {
    id: "school",
    title: "School Mode",
    description: "Grades 1-12 • NCERT/CBSE Support",
    icon: GraduationCap,
    features: ["Step-by-step solutions", "Concept cards", "NCERT aligned", "Quick doubt solving"],
    level: 'basic'
  },
  {
    id: "college",
    title: "College Mode",
    description: "BA • BSc • BCom • BBA • BTech • Medical",
    icon: BookOpen,
    features: ["Subject packs by stream", "Past paper prep", "Lab & project help", "Viva preparation"],
    level: 'advanced'
  },
  {
    id: "lawyer",
    title: "Lawyer Mode",
    description: "LLB • LLM • New Advocates",
    icon: Scale,
    features: ["Legal drafting", "Mock court practice", "Case analysis", "Client simulation"],
    level: 'advanced',
    popular: true
  },
  {
    id: "professional",
    title: "Professional Mode",
    description: "Working Professionals • Career Advancement",
    icon: Briefcase,
    features: ["Skill development", "Industry insights", "Certification prep", "Networking tools"],
    level: 'expert'
  },
  {
    id: "expert",
    title: "Expert Mode",
    description: "Advanced Learning • Research & Innovation",
    icon: Star,
    features: ["Advanced analytics", "Research tools", "Innovation labs", "Expert mentorship"],
    level: 'expert'
  },
  {
    id: "community",
    title: "Community Mode",
    description: "Collaborative Learning • Group Studies",
    icon: Users,
    features: ["Group discussions", "Peer learning", "Collaborative projects", "Community events"],
    level: 'basic'
  }
];

export const EnhancedProfileSelector = ({ onProfileSelect }: EnhancedProfileSelectorProps) => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'basic' | 'advanced' | 'expert'>('all');

  const filteredProfiles = selectedLevel === 'all'
    ? profiles
    : profiles.filter(profile => profile.level === selectedLevel);

  const levelColors = {
    basic: 'bg-green-100 text-green-800',
    advanced: 'bg-blue-100 text-blue-800',
    expert: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">
            Law.Gen
          </h1>
          <p className="text-xl text-gold mb-2">Learn. Practice. Advocate.</p>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            One super-app for learning & practice: AI tutor for subjects + specialized law modules for real advocacy practice.
          </p>
        </div>

        {/* Level Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-card/50 p-1 rounded-lg">
            {(['all', 'basic', 'advanced', 'expert'] as const).map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "ghost"}
                onClick={() => setSelectedLevel(level)}
                className="capitalize"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => {
            const IconComponent = profile.icon;
            return (
              <Card key={profile.id} className="border-primary-foreground/20 bg-card/95 backdrop-blur hover:bg-card transition-all duration-300 hover:scale-105 relative">
                {profile.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-gold text-navy">
                    Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-gold w-16 h-16 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-navy" />
                  </div>
                  <CardTitle className="text-xl text-navy flex items-center justify-center gap-2">
                    {profile.title}
                    <Badge variant="secondary" className={levelColors[profile.level]}>
                      {profile.level}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {profile.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {profile.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-gold mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => onProfileSelect(profile.id)}
                    className="w-full bg-navy hover:bg-navy-light text-primary-foreground"
                  >
                    Select {profile.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-primary-foreground/70 text-sm">
            You can switch profiles anytime from your settings
          </p>
        </div>
      </div>
    </div>
  );
};
