"use client";

import {
  LayoutDashboard,
  Bell,
  Search,
  ArrowLeft,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import NotificationsPopover from "@/components/notification";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, setUsersList } from "@/store/userSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { clearUser } from "../../store/userSlice";

export default function RootLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [role, setRole] = useState("user");
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const userList = useSelector((state) => state.user.usersList);

  useEffect(() => {
    if (typeof window != undefined) {
      const role = localStorage?.getItem("role");
      if (role === "admin") {
        axiosInstance
          .get("/auth/all-users")
          .then((res) => {
            dispatch(setUsersList(res.data.users));
          })
          .catch(console.log);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage?.getItem("token")) {
        fetchNotifications();
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage?.getItem("role") || "user";
      setRole(role);
    }
  }, []);

  useEffect(() => {
    const username = localStorage?.getItem("username");
    const email = localStorage?.getItem("email");

    if (username && email) {
      setUsername(username);
      setEmail(email);
    }
  }, []);

  const handleSelectUser = (value) => {
    const selected = userList.find((u) => u.email === value);
    dispatch(setSelectedUser(selected));
    localStorage?.setItem("email", selected?.email);
  };

  const logout = () => {
    localStorage?.clear();
    dispatch(clearUser());
    router.push("/");
  };

  const goBack = () => {
    router.back();
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get(`/notifications`);
      const notifs = data.notifications || [];
      setUnreadMessages(notifs.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 border border-[#E6E8EA] bg-white rounded-none hover:border-[#1E2A3A] hover:bg-[#F8F9FA]"
            >
              <LayoutDashboard className="h-4 w-4 text-[#687076]" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] p-0 border-r border-[#E6E8EA]"
          >
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-[#E6E8EA]">
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Back button & Search */}
              <div className="flex-1 flex items-center gap-4">
                <Button
                  onClick={goBack}
                  variant="ghost"
                  className="rounded-none px-3 py-2 text-[#687076] font-mono text-sm hover:bg-[#F8F9FA] hover:text-[#11181C] transition-all duration-150"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  <span>back()</span>
                </Button>

                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#687076]" />
                  <Input
                    type="search"
                    placeholder="search..."
                    className="pl-9 w-full h-9 bg-white border border-[#E6E8EA] rounded-none font-mono text-sm placeholder:text-[#687076] focus:border-[#FFC043] focus:ring-1 focus:ring-[#FFC043]/20 transition-all duration-150"
                  />
                </div>
              </div>

              {/* Admin User Selector */}
              {role === "admin" && userList?.length > 0 && (
                <div className="mx-4">
                  <label className="sr-only">select_user</label>
                  <Select onValueChange={handleSelectUser}>
                    <SelectTrigger className="w-[180px] h-9 px-3 bg-white border border-[#E6E8EA] rounded-none font-mono text-sm hover:border-[#1E2A3A] focus:border-[#FFC043] transition-all duration-150">
                      <SelectValue placeholder="select_user()" />
                    </SelectTrigger>
                    <SelectContent className="border border-[#E6E8EA] rounded-none">
                      {userList.map((user) => (
                        <SelectItem
                          key={user.email}
                          value={user.email}
                          className="font-mono text-sm focus:bg-[#F8F9FA] focus:text-[#11181C]"
                        >
                          {user.username || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Right side - Notifications & Profile */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-none w-9 h-9 text-[#687076] hover:bg-[#F8F9FA] hover:text-[#11181C] transition-all duration-150"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadMessages.length > 0 && (
                        <span className="absolute top-1 right-1 inline-flex items-center justify-center w-3.5 h-3.5 text-[10px] font-mono font-medium text-white bg-[#FFC043] rounded-full">
                          {unreadMessages.length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0 border border-[#E6E8EA] rounded-none shadow-none">
                    <NotificationsPopover
                      setUnreadMessages={setUnreadMessages}
                    />
                  </PopoverContent>
                </Popover>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-none p-0 hover:bg-[#F8F9FA] transition-all duration-150"
                    >
                      <Avatar className="h-8 w-8 rounded-none border border-[#E6E8EA]">
                        <AvatarImage src="/avatars/01.png" alt="avatar" />
                        <AvatarFallback className="bg-[#F8F9FA] text-[#1E2A3A] font-mono text-xs rounded-none">
                          {username?.slice(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 border border-[#E6E8EA] rounded-none shadow-none p-0"
                    align="end"
                  >
                    <DropdownMenuLabel className="px-4 py-3 border-b border-[#E6E8EA]">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-mono text-[#11181C]">
                          {username}
                        </p>
                        <p className="text-xs font-mono text-[#687076]">
                          {email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="px-4 py-2 text-sm font-mono text-[#687076] hover:bg-[#F8F9FA] hover:text-[#11181C] cursor-pointer rounded-none">
                      <User className="mr-2 h-3.5 w-3.5" />
                      profile()
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-4 py-2 text-sm font-mono text-[#687076] hover:bg-[#F8F9FA] hover:text-[#11181C] cursor-pointer rounded-none">
                      <Users className="mr-2 h-3.5 w-3.5" />
                      users()
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#E6E8EA]" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="px-4 py-2 text-sm font-mono text-[#687076] hover:bg-[#F8F9FA] hover:text-[#FF5F56] cursor-pointer rounded-none"
                    >
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      logout()
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-[#F8F9FA] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
