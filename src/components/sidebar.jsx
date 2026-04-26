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
  Zap,
  HelpCircle,
  Bell,
  Shield,
  ChevronLeft,
  Menu,
  Sparkles,
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
import { Badge } from "@/components/ui/badge";

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
    : "U";

  const mainNavItems = [
    {
      href: "/home/data-source",
      icon: Database,
      label: "Data Sources",
      badge: null,
    },
    {
      href: "/home/contacts-source",
      icon: Contact,
      label: "Enrichment",
      badge: null
    },
    {
      href: "/home/campaign",
      icon: LucideTarget,
      label: "Campaigns",
      badge: null,
    },
    {
      href: "/home/email-editor",
      icon: LayoutTemplate,
      label: "Templates",
      badge: null,
    },
    { href: "/home/stats", icon: ChartBar, label: "Analytics", badge: null },
    { href: "/home/workflow", icon: Workflow, label: "Workflows", badge: null },
  ];

  const bottomNavItems = [
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => window.open("/help", "_blank"),
    },
    {
      icon: Shield,
      label: "Security",
      onClick: () => router.push("/security"),
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={`relative flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-purple-50/30 border-r border-purple-100/50 shadow-2xl transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 z-50 bg-white border border-purple-200 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-purple-600 group-hover:text-purple-700" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-purple-600 group-hover:text-purple-700" />
          )}
        </button>

        {/* Header Section */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-purple-100/50">
          {!isCollapsed ? (
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 group transition-all duration-200 hover:scale-105"
            >
              <div className="relative">
                <Zap className="w-7 h-7 text-purple-600 group-hover:text-purple-700 transition-colors" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                AutoFlow
              </span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="w-full flex justify-center group"
            >
              <div className="relative">
                <Zap className="w-7 h-7 text-purple-600 group-hover:text-purple-700 transition-colors" />
                <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </button>
          )}

          {/* {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-purple-100 rounded-full"
              onClick={() => router.push("/notifications")}
            >
              <Bell className="w-5 h-5 text-purple-600" />
            </Button>
          )} */}
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-b border-purple-100/50">
            <div className="flex items-center space-x-3 p-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
              <Avatar className="w-10 h-10 border-2 border-purple-300">
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-xs text-purple-600 truncate">
                  {user?.email || "Welcome!"}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                Pro
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                badge={item.badge}
              />
            ))}
          </div>

          <Separator className="my-4 bg-purple-100/50" />

          {/* Settings Collapsible */}
          <Collapsible
            open={openItems.settings}
            onOpenChange={() => toggleItem("settings")}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-between rounded-xl px-3 py-2 transition-all duration-200 text-sm font-medium group ${
                  openItems.settings
                    ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 shadow-sm"
                    : "text-purple-700 hover:bg-purple-50 hover:text-purple-900"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    className={`h-5 w-5 transition-colors ${
                      openItems.settings
                        ? "text-purple-900"
                        : "text-purple-500 group-hover:text-purple-700"
                    }`}
                  />
                  {!isCollapsed && <span>Settings</span>}
                </div>
                {!isCollapsed &&
                  (openItems.settings ? (
                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                  ))}
              </Button>
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="pl-6 mt-1 space-y-1">
                <SidebarSubLink
                  href="/home/senders"
                  label="Senders"
                  isCollapsed={isCollapsed}
                />
                <SidebarSubLink
                  href="/home/smtp-settings"
                  label="SMTP Settings"
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
                    className={`w-full justify-start gap-3 rounded-xl px-3 py-2 transition-all duration-200 text-sm font-medium text-purple-700 hover:bg-purple-50 hover:text-purple-900 ${
                      isCollapsed ? "justify-center px-2" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5 text-purple-500" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent
                    side="right"
                    className="bg-gray-900 text-white"
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </nav>

        <Separator className="bg-purple-100/50" />

        {/* Footer Section */}
        <div className="p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={logout}
                className={`w-full justify-start gap-3 rounded-xl px-3 py-2 transition-all duration-200 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 ${
                  isCollapsed ? "justify-center px-2" : ""
                }`}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-gray-900 text-white">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Version Badge */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <p className="text-xs text-center text-purple-400">
              Version 2.0.0 • © 2024 AutoFlow
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function SidebarLink({ href, icon: Icon, label, isCollapsed, badge = null }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  const LinkContent = (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 rounded-xl px-3 py-2 transition-all duration-200 text-sm font-medium group relative ${
        isActive
          ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 shadow-sm"
          : "text-purple-700 hover:bg-purple-50 hover:text-purple-900"
      } ${isCollapsed ? "justify-center px-2" : ""}`}
    >
      <Icon
        className={`h-5 w-5 transition-all duration-200 ${
          isActive
            ? "text-purple-900 scale-110"
            : "text-purple-500 group-hover:text-purple-700 group-hover:scale-110"
        }`}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left">{label}</span>
          {badge && (
            <Badge
              variant="secondary"
              className={`text-xs ${
                isActive
                  ? "bg-purple-200 text-purple-800"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              {badge}
            </Badge>
          )}
        </>
      )}
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-r-full" />
      )}
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
        <TooltipContent side="right" className="bg-gray-900 text-white">
          <div className="flex flex-col gap-1">
            <p>{label}</p>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
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
        className={`w-full justify-start rounded-lg px-3 py-1.5 transition-all duration-200 text-sm font-medium ${
          isActive
            ? "bg-purple-100 text-purple-900 border-l-2 border-purple-600"
            : "text-purple-600 hover:bg-purple-50 hover:text-purple-800"
        }`}
      >
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
}
