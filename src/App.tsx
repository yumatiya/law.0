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
import DraftBuilder from "./pages/DraftBuilder";
import StatuteNavigation from "./pages/StatuteNavigation";
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
