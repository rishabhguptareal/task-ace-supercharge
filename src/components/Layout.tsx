
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CalendarClock, CheckCircle, ListTodo, BarChart, Settings, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleProfile = () => {
    navigate('/settings');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = state.user?.name 
    ? state.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white border-b px-4 py-2 flex items-center">
            <SidebarTrigger />
            <div className="flex-1"></div>
            {state.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={state.user.photoURL || ''} alt={state.user.name || ''} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5 leading-none">
                      <p className="font-medium text-sm">{state.user.name}</p>
                      <p className="text-xs text-muted-foreground">{state.user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfile}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
