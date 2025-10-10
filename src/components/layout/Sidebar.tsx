import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  MessageSquare, 
  Target, 
  BookOpen,
  Library,
  User, 
  Scale, 
  FileText, 
  Gavel,
  BarChart3,
  Settings,
  GraduationCap,
  DollarSign,
  Rocket,
  Shield,
  Newspaper,
  Heart,
  Languages,
  FileSearch,
  Users
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useApp } from "@/contexts/AppContext";
import { ROUTES } from "@/lib/constants";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  profiles?: string[];
}

const navigationItems: NavigationItem[] = [
  { title: "Home", url: ROUTES.HOME, icon: Home },
  { title: "AI Chat", url: ROUTES.CHAT, icon: MessageSquare },
  { title: "Practice Hub", url: ROUTES.PRACTICE, icon: Target },
  { title: "Library", url: ROUTES.LIBRARY, icon: BookOpen },
  { title: "Subjects", url: ROUTES.SUBJECTS, icon: GraduationCap },
];

const lawNavigationItems: NavigationItem[] = [
  { title: "Mock Court", url: ROUTES.MOCK_COURT, icon: Gavel, profiles: ['lawyer'] },
  { title: "Draft Builder", url: ROUTES.DRAFT_BUILDER, icon: FileText, profiles: ['lawyer'] },
  { title: "Statute Navigator", url: ROUTES.STATUTE_NAVIGATOR, icon: Scale, profiles: ['lawyer'] },
  { title: "Finance + Law", url: "/finance-law", icon: DollarSign, profiles: ['lawyer'] },
  { title: "Courtroom VR", url: "/courtroom-vr", icon: Gavel, profiles: ['lawyer'] },
  { title: "Startup Builder", url: "/startup-builder", icon: Rocket, profiles: ['lawyer'] },
  { title: "Rights Guardian", url: "/rights-guardian", icon: Shield, profiles: ['lawyer'] },
  { title: "Legal News", url: "/legal-news", icon: Newspaper, profiles: ['lawyer'] },
  { title: "Evidence Analyzer", url: "/evidence-analyzer", icon: FileSearch, profiles: ['lawyer'] },
];

const studentNavigationItems: NavigationItem[] = [
  { title: "Law Teacher", url: "/law-teacher", icon: BookOpen, profiles: ['school', 'college'] },
  { title: "eBook Library", url: "/ebook-library", icon: Library },
  { title: "Emotional Support", url: "/emotional-support", icon: Heart },
  { title: "Voice Translator", url: "/voice-translator", icon: Languages },
  { title: "Collaboration Hub", url: "/collaboration-hub", icon: Users },
];

const generalItems: NavigationItem[] = [
  { title: "Analytics", url: ROUTES.ANALYTICS, icon: BarChart3 },
  { title: "Profile", url: ROUTES.PROFILE, icon: User },
  { title: "Settings", url: ROUTES.SETTINGS, icon: Settings },
];

export function AppSidebar() {
  const { state: sidebarState } = useSidebar();
  const { state } = useApp();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  const getNavCls = (active: boolean) =>
    active 
      ? "bg-navy text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const shouldShowItem = (item: NavigationItem) => {
    if (!item.profiles) return true;
    return item.profiles.includes(state.currentProfile || '');
  };

  const isCollapsed = sidebarState === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Law-Specific Navigation */}
        {state.currentProfile === 'lawyer' && (
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
              Legal Practice
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {lawNavigationItems
                  .filter(shouldShowItem)
                  .map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={({ isActive }) => getNavCls(isActive)}
                        >
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Student Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentNavigationItems
                .filter(shouldShowItem)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => getNavCls(isActive)}
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* General Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}