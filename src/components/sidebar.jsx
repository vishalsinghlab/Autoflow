"use client";

import { Separator } from "@/components/ui/separator";
import { useState } from "react";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); // Initialize the router
  const dispatch = useDispatch();
  const [openItems, setOpenItems] = useState({
    settings:
      pathname.startsWith("/home/senders") ||
      pathname.startsWith("/home/templates"),
  });

  const toggleItem = (item) => {
    setOpenItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const logout = () => {
    localStorage?.clear();
    dispatch(clearUser());
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white via-purple-50 to-pink-50 border-r border-purple-100 shadow-xl rounded-r-3xl">
      <div className="flex h-16 items-center px-6">
        <button
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-purple-700 tracking-tight bg-transparent border-none p-0 m-0 cursor-pointer"
        >
          AutoFlow
        </button>
      </div>

      <Separator />
      <nav className="flex-1 px-4 py-6 space-y-1">
        <SidebarLink href="/home/data-source" icon={Database} label="Data" />
        <SidebarLink
          href="/home/contacts-source"
          icon={Contact}
          label="Enrichment"
        />
        <SidebarLink
          href="/home/campaign"
          icon={LucideTarget}
          label="Campaign"
        />
        <SidebarLink
          href="/home/email-editor"
          icon={LayoutTemplate}
          label="Template"
        />
        <SidebarLink
          href="/home/stats"
          icon={ChartBar}
          label="Stats & Performance"
        />
        <SidebarLink href="/home/workflow" icon={Workflow} label="Workflow" />
        {/* <SidebarLink href="/home/logs" icon={Users} label="Logs" /> */}

        <Collapsible
          open={openItems.settings}
          onOpenChange={() => toggleItem("settings")}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-between rounded-2xl px-4 py-2 transition-all text-sm font-medium ${
                openItems.settings
                  ? "bg-purple-100 text-purple-900 shadow-inner"
                  : "text-purple-800 hover:bg-purple-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings
                  className={`h-5 w-5 ${
                    openItems.settings ? "text-purple-900" : "text-purple-600"
                  }`}
                />
                Settings
              </div>
              {openItems.settings ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 mt-1 space-y-1">
            <SidebarSubLink href="/home/senders" label="Senders" />
            <SidebarSubLink href="/home/smtp-settings" label="SMTP" />

            {/* <SidebarSubLink href="/home/templates" label="Templates" /> */}
          </CollapsibleContent>
        </Collapsible>

        {/* <SidebarLink
          href="/home/unsubscribe"
          icon={MailX}
          label="Unsubscribed"
        /> */}
      </nav>

      <Separator />
      {/* <div className="px-4 py-4">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:bg-red-100 rounded-xl px-4 py-2 font-medium transition"
        >
          <HelpCircle className="h-4 w-4" />
          Logout
        </Button>
      </div> */}
    </div>
  );
}

function SidebarLink({ href, icon: Icon, label }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link href={href} className="block">
      <Button
        variant="ghost"
        className={`w-full justify-start gap-3 rounded-2xl px-4 py-2 transition-all text-sm font-medium ${
          isActive
            ? "bg-purple-100 text-purple-900 shadow-inner"
            : "text-purple-800 hover:bg-purple-100"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            isActive ? "text-purple-900" : "text-purple-600"
          }`}
        />
        {label}
      </Button>
    </Link>
  );
}

function SidebarSubLink({ href, label }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link href={href} className="block">
      <Button
        variant="ghost"
        className={`w-full justify-start rounded-xl px-3 py-1 transition-all text-sm font-medium ${
          isActive
            ? "bg-purple-100 text-purple-900"
            : "text-purple-700 hover:bg-purple-50"
        }`}
      >
        {label}
      </Button>
    </Link>
  );
}
