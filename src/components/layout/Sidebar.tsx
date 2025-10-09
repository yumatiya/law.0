import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  MessageSquare, 
  Target, 
  BookOpen, 
  User, 
  Scale, 
  FileText, 
  Gavel,
  BarChart3,
  Settings,
  GraduationCap
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