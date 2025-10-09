import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Header } from "../Header";
import { useApp } from "@/contexts/AppContext";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { state, setProfile } = useApp();

  const handleProfileChange = () => {
    setProfile(null as any);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {state.currentProfile && <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
            {state.currentProfile && <SidebarTrigger className="ml-4" />}
            <div className="flex-1">
              <Header currentProfile={state.currentProfile} onProfileChange={handleProfileChange} />
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}