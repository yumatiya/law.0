import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Settings, User } from "lucide-react";

interface HeaderProps {
  currentProfile: string | null;
  onProfileChange: () => void;
}

const getProfileLabel = (profile: string) => {
  const labels = {
    school: "School Mode",
    college: "College Mode", 
    lawyer: "Lawyer Mode"
  };
  return labels[profile as keyof typeof labels] || "Select Profile";
};

export const Header = ({ currentProfile, onProfileChange }: HeaderProps) => {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-gradient-gold">
                <Scale className="h-5 w-5 text-navy" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy">Law.Gen</h1>
                <p className="text-xs text-muted-foreground">Learn. Practice. Advocate.</p>
              </div>
            </div>
            
            {currentProfile && (
              <Badge 
                variant="outline" 
                className="border-gold text-gold hover:bg-gold hover:text-navy cursor-pointer"
                onClick={onProfileChange}
              >
                {getProfileLabel(currentProfile)}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};