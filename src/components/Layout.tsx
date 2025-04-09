
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle, ListTodo, BarChart, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, to, isActive }) => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className={cn(
        "w-full justify-start gap-2 mb-1", 
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/80 text-sidebar-foreground"
      )}
      onClick={() => navigate(to)}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="pb-2">
        <h2 className="text-xl font-bold px-4 py-2">TaskAce</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1 p-2">
            <SidebarItem 
              icon={<ListTodo size={18} />} 
              label="Tasks" 
              to="/"
              isActive={currentPath === "/"}
            />
            <SidebarItem 
              icon={<CalendarClock size={18} />} 
              label="Calendar" 
              to="/calendar"
              isActive={currentPath === "/calendar"}
            />
            <SidebarItem 
              icon={<BarChart size={18} />} 
              label="Analytics" 
              to="/analytics"
              isActive={currentPath === "/analytics"}
            />
            <SidebarItem 
              icon={<CheckCircle size={18} />} 
              label="Focus Mode" 
              to="/focus"
              isActive={currentPath === "/focus"}
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1 p-2">
            <SidebarItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              to="/settings"
              isActive={currentPath === "/settings"}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs opacity-70">TaskAce v1.0</div>
      </SidebarFooter>
    </Sidebar>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white border-b px-4 py-2 flex items-center">
            <SidebarTrigger />
            <div className="flex-1"></div>
          </header>
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
