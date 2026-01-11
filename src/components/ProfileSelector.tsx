import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Scale } from "lucide-react";

interface ProfileOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

interface ProfileSelectorProps {
  onProfileSelect: (profileId: string) => void;
}

const profiles: ProfileOption[] = [ 
  {
    id: "school",
    title: "School Mode",
    description: "Grades 1-12 • NCERT/CBSE Support",
    icon: GraduationCap,
    features: ["Step-by-step solutions", "Concept cards", "NCERT aligned", "Quick doubt solving"]
  },
  {
    id: "college",
    title: "College Mode", 
    description: "BA • BSc • BCom • BBA • BTech • Medical",
    icon: BookOpen,
    features: ["Subject packs by stream", "Past paper prep", "Lab & project help", "Viva preparation"]
  },
  {
    id: "lawyer",
    title: "Lawyer Mode",
    description: "LLB • LLM • New Advocates",
    icon: Scale,
    features: ["Legal drafting", "Mock court practice", "Case analysis", "Client simulation"]
  }
];

export const ProfileSelector = ({ onProfileSelect }: ProfileSelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">
            Law.Gen
          </h1>
          <p className="text-xl text-gold mb-2">Learn. Practice. Advocate.</p>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            One super-app for learning & practice: AI tutor for subjects + specialized law modules for real advocacy practice.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {profiles.map((profile) => {
            const IconComponent = profile.icon;
            return (
              <Card key={profile.id} className="border-primary-foreground/20 bg-card/95 backdrop-blur hover:bg-card transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-gold w-16 h-16 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-navy" />
                  </div>
                  <CardTitle className="text-xl text-navy">{profile.title}</CardTitle>
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