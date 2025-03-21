import { useNavigate } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import { LayoutDashboard, Briefcase, Users, Bell, Blocks, Files } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/clerk-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  link: string;
  visible?: boolean;
  notifications?: number;
}

const Sidebar = ({
  isMobile,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) => {
  const topItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      link: "/",
      visible: true,
    },
    {
      icon: Briefcase,
      label: "Projects",
      link: "/projects",
      visible: true,
    },
    {
      icon: Files,
      label: "Complaints",
      link: "/complaints",
      visible: true,
    },
  ];

  const bottomItems: NavItem[] = [
    {
      icon: Bell,
      label: "Notifications",
      link: "/notifications",
      visible: true,
      notifications: 3,
    },
  ];

  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const subNavbarRoutes = ["jobs", "settings"];

  useEffect(() => {
    setActive(window.location.pathname.split("/")[1]);
  }, []);

  const handleNavigation = (link: string, label: string) => {
    navigate("/citizen" + link);
    setActive(label.toLowerCase());
    if (isMobile) onClose?.();
  };

  const renderNavItem = (item: NavItem, index: number) => {
    if (item.visible === false) return null;

    return (
      <TooltipProvider key={index}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={() => handleNavigation(item.link, item.label)}
              className="w-full"
            >
              <div
                className={`flex items-center p-2 py-3 rounded-lg cursor-pointer transition-colors duration-200  
                  ${
                    active?.toLowerCase() === item.label.toLowerCase()
                      ? "bg-zinc-800 text-white"
                      : "text-default hover:bg-accent/40"
                  }`}
              >
                <div className="min-w-[24px] flex items-center justify-center relative">
                  {item.notifications ? (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                      {item.notifications}
                    </Badge>
                  ) : null}
                  <item.icon className="w-5 h-5" />
                </div>
                {(!collapsed || isMobile) && (
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                )}
              </div>
            </div>
          </TooltipTrigger>
          {collapsed && !isMobile && (
            <TooltipContent side="right">{item.label}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <aside
      className={`h-screen min-w-[250px] max-w-[250px] bg-foreground text-background ${
        subNavbarRoutes.includes(window.location.pathname.split("/")[1])
          ? "border-r-background/10"
          : "rounded-r-2xl"
      } border-r flex flex-col overflow-hidden transition-all duration-300 
        ${isMobile ? "w-64" : collapsed ? "w-16" : "w-64"}
        ${isMobile ? "fixed left-0 top-0 z-50" : "relative"}`}
    >
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-background"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
      )}

      <nav className="flex flex-col gap-2 p-3">
        {(!isMobile || !collapsed) && (
          <div className={`${isMobile ? "mt-12" : "mt-4"} mb-6`}>
            <img
              src="/logo.png"
              alt="logo"
              className="cursor-pointer h-10 invert"
              onClick={() => {
                window.location.href = "/";
              }}
            />
          </div>
        )}

        {topItems.map((item, index) => renderNavItem(item, index))}
      </nav>

      <nav className="mt-auto flex flex-col gap-2 p-3">
        <div className="ml-[6px] mb-4">
          <UserButton />
        </div>

        {bottomItems.map((item, index) => renderNavItem(item, index + 100))}

        {!isMobile && (
          <div className="flex w-full mt-4 px-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-xl transition-colors duration-200 w-full"
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform duration-200 text-background
                  ${!collapsed ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
