"use client";

import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  ChevronRight,
  ChevronDown,
  Database,
  Contact,
  LayoutTemplate,
  LucideTarget,
  Workflow,
  ChartBar,
  LogOut,
  HelpCircle,
  Shield,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/userSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openItems, setOpenItems] = useState({
    settings:
      pathname.startsWith("/home/senders") ||
      pathname.startsWith("/home/smtp-settings"),
  });

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleItem = (item) => {
    setOpenItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const logout = () => {
    localStorage?.clear();
    dispatch(clearUser());
    router.push("/");
  };

  const user = useSelector((state) => state.user);
  const userInitials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const mainNavItems = [
    { href: "/home/data-source", icon: Database, label: "data_sources" },
    { href: "/home/contacts-source", icon: Contact, label: "enrichment" },
    { href: "/home/campaign", icon: LucideTarget, label: "campaigns" },
    { href: "/home/email-editor", icon: LayoutTemplate, label: "templates" },
    { href: "/home/stats", icon: ChartBar, label: "analytics" },
    { href: "/home/workflow", icon: Workflow, label: "workflows" },
  ];

  const bottomNavItems = [
    {
      icon: HelpCircle,
      label: "help",
      onClick: () => window.open("/help", "_blank"),
    },
    {
      icon: Shield,
      label: "security",
      onClick: () => router.push("/security"),
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={`relative flex flex-col h-full bg-white border-r border-[#E6E8EA] transition-all duration-200 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 z-50 bg-white border border-[#E6E8EA] rounded-full p-1.5 shadow-sm hover:border-[#1E2A3A] hover:shadow-md transition-all duration-150 group"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-[#687076] group-hover:text-[#11181C]" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-[#687076] group-hover:text-[#11181C]" />
          )}
        </button>

        {/* Header Section */}
        <div className="flex items-center h-16 px-4 border-b border-[#E6E8EA]">
          {!isCollapsed ? (
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 group"
            >
              <span className="text-lg font-mono font-semibold tracking-tighter text-[#11181C]">
                autoflow<span className="text-[#FFC043]">/</span>
              </span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="w-full flex justify-center"
            >
              <span className="text-lg font-mono font-semibold text-[#11181C]">
                a<span className="text-[#FFC043]">/</span>
              </span>
            </button>
          )}
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-b border-[#E6E8EA]">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 border border-[#E6E8EA]">
                <AvatarFallback className="bg-[#F8F9FA] text-[#1E2A3A] font-mono text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-[#11181C] truncate">
                  {user?.username || "guest_user"}
                </p>
                <p className="text-xs font-mono text-[#687076] truncate">
                  {user?.email || "not signed in"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          <Separator className="my-4 bg-[#E6E8EA]" />

          {/* Settings Collapsible */}
          <Collapsible
            open={openItems.settings}
            onOpenChange={() => toggleItem("settings")}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-between rounded-none px-3 py-2 transition-all duration-150 text-sm font-mono group ${
                  openItems.settings
                    ? "bg-[#F8F9FA] text-[#11181C] border-l-2 border-[#FFC043]"
                    : "text-[#687076] hover:bg-[#F8F9FA] hover:text-[#11181C]"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    className={`h-4 w-4 transition-colors ${
                      openItems.settings
                        ? "text-[#11181C]"
                        : "text-[#687076] group-hover:text-[#11181C]"
                    }`}
                  />
                  {!isCollapsed && <span>settings</span>}
                </div>
                {!isCollapsed &&
                  (openItems.settings ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  ))}
              </Button>
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="pl-9 mt-1 space-y-1">
                <SidebarSubLink
                  href="/home/senders"
                  label="senders"
                  isCollapsed={isCollapsed}
                />
                <SidebarSubLink
                  href="/home/smtp-settings"
                  label="smtp_settings"
                  isCollapsed={isCollapsed}
                />
              </CollapsibleContent>
            )}
          </Collapsible>

          {/* Bottom Navigation Items */}
          <div className="mt-6 space-y-1">
            {bottomNavItems.map((item, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={item.onClick}
                    className={`w-full justify-start gap-3 rounded-none px-3 py-2 transition-all duration-150 text-sm font-mono text-[#687076] hover:bg-[#F8F9FA] hover:text-[#11181C] ${
                      isCollapsed ? "justify-center px-2" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-[#11181C] text-white border-none rounded-none font-mono text-xs"
                  >
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </nav>

        <Separator className="bg-[#E6E8EA]" />

        {/* Footer Section - Logout */}
        <div className="p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={logout}
                className={`w-full justify-start gap-3 rounded-none px-3 py-2 transition-all duration-150 text-sm font-mono text-[#687076] hover:bg-[#F8F9FA] hover:text-[#11181C] ${
                  isCollapsed ? "justify-center px-2" : ""
                }`}
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && <span>logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent
                side="right"
                className="bg-[#11181C] text-white border-none rounded-none font-mono text-xs"
              >
                logout
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Version Badge */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <p className="text-xs font-mono text-[#687076] text-center">
              v2.0.0 / ready
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function SidebarLink({ href, icon: Icon, label, isCollapsed }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  const LinkContent = (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 rounded-none px-3 py-2 transition-all duration-150 text-sm font-mono group ${
        isActive
          ? "bg-[#F8F9FA] text-[#11181C] border-l-2 border-[#FFC043]"
          : "text-[#687076] hover:bg-[#F8F9FA] hover:text-[#11181C]"
      } ${isCollapsed ? "justify-center px-2" : ""}`}
    >
      <Icon
        className={`h-4 w-4 transition-colors ${
          isActive
            ? "text-[#11181C]"
            : "text-[#687076] group-hover:text-[#11181C]"
        }`}
      />
      {!isCollapsed && <span className="flex-1 text-left">{label}</span>}
    </Button>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} className="block">
            {LinkContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-[#11181C] text-white border-none rounded-none font-mono text-xs"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return <Link href={href}>{LinkContent}</Link>;
}

function SidebarSubLink({ href, label, isCollapsed }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  if (isCollapsed) return null;

  return (
    <Link href={href} className="block">
      <Button
        variant="ghost"
        className={`w-full justify-start rounded-none px-3 py-1.5 transition-all duration-150 text-xs font-mono ${
          isActive
            ? "text-[#11181C] border-l-2 border-[#FFC043] bg-[#F8F9FA]"
            : "text-[#687076] hover:bg-[#F8F9FA] hover:text-[#11181C]"
        }`}
      >
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
}
