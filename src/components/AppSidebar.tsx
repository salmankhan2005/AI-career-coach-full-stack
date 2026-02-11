import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layers, Bot, CalendarDays, CreditCard, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Workspace", url: "/dashboard", icon: Layers },
  { title: "AI Tools", url: "/dashboard/ai-tools", icon: Bot },
  { title: "My History", url: "/dashboard/history", icon: CalendarDays },
  { title: "Billing", url: "/dashboard/billing", icon: CreditCard },
  { title: "Profile", url: "/dashboard/profile", icon: UserCircle },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <div className="flex flex-col items-center gap-1 px-4 py-6">
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-brand" />
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight">AI CAREER</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Coach Agent</p>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Build Awesome Skills</p>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-4 py-2.5">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto px-4 py-4 space-y-3">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
        <p className="text-xs text-muted-foreground">Copyright @AiCareer</p>
      </div>
    </Sidebar>
  );
}
