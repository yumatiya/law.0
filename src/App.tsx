import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileSelector } from "@/components/ProfileSelector";
import { useApp } from "@/contexts/AppContext";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Practice from "./pages/Practice";
import Library from "./pages/Library";
import MockCourt from "./pages/MockCourt";
import EBookLibrary from "./pages/EBookLibrary";
import DraftBuilder from "./pages/DraftBuilder";
import StatuteNavigation from "./pages/StatuteNavigation";
import FinanceLaw from "./pages/FinanceLaw";
import CourtroomVR from "./pages/CourtroomVR";
import StartupBuilder from "./pages/StartupBuilder";
import RightsGuardian from "./pages/RightsGuardian";
import LegalNews from "./pages/LegalNews";
import EmotionalSupport from "./pages/EmotionalSupport";
import VoiceTranslator from "./pages/VoiceTranslator";
import EvidenceAnalyzer from "./pages/EvidenceAnalyzer";
import LawTeacher from "./pages/LawTeacher";
import CollaborationHub from "./pages/CollaborationHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { state, setProfile } = useApp();

  if (!state.currentProfile) {
    return <ProfileSelector onProfileSelect={setProfile} />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/library" element={<Library />} />
        <Route path="/mock-court" element={<MockCourt />} />
        <Route path="/draft-builder" element={<DraftBuilder />} />
        <Route path="/statute-navigation" element={<StatuteNavigation />} />
        <Route path="/finance-law" element={<FinanceLaw />} />
        <Route path="/courtroom-vr" element={<CourtroomVR />} />
        <Route path="/startup-builder" element={<StartupBuilder />} />
        <Route path="/rights-guardian" element={<RightsGuardian />} />
        <Route path="/legal-news" element={<LegalNews />} />
        <Route path="/emotional-support" element={<EmotionalSupport />} />
        <Route path="/voice-translator" element={<VoiceTranslator />} />
        <Route path="/evidence-analyzer" element={<EvidenceAnalyzer />} />
        <Route path="/law-teacher" element={<LawTeacher />} />
        <Route path="/ebook-library" element={<EBookLibrary />} />
        <Route path="/collaboration-hub" element={<CollaborationHub />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
