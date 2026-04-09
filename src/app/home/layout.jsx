"use client"; // Add this to use client components inside layout

import { LayoutDashboard, Bell, Search, ArrowLeft } from "lucide-react";
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
  const userList = useSelector((state) => state.user.usersList); // ✅ matches slice

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
    } finally {
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed top-4 left-4 z-50"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
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
          <header className="bg-white shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Search bar */}
                <div className="flex-1 flex items-center gap-4">
                  <Button
                    onClick={goBack}
                    variant="ghost"
                    className="rounded-md"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-black">Back</span>
                  </Button>

                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10 w-full rounded-full bg-gray-100 border-none focus-visible:ring-2"
                    />
                  </div>
                </div>
                {role === "admin" && userList?.length > 0 && (
                  <Select onValueChange={handleSelectUser}>
                    <SelectTrigger className="w-[180px] bg-white border-gray-300">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {userList.map((user) => (
                        <SelectItem key={user.email} value={user.email}>
                          {user.username || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {/* Right side */}
                <div className="flex items-center gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative rounded-full"
                      >
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>

                        {unreadMessages.length > 0 && (
                          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                            {unreadMessages.length}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <NotificationsPopover
                        setUnreadMessages={setUnreadMessages}
                      />
                    </PopoverContent>
                  </Popover>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/01.png" alt="icon" />
                          <AvatarFallback>
                            {username?.slice(0, 2).toUpperCase() || "UN"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {username}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Users</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto p-2 sm:p-2 lg:p-2 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
