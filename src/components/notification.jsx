"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";

export default function NotificationsPopover({ setUnreadMessages }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get(`/notifications`);
      const notifs = data.notifications || [];
      setNotifications(notifs);
      setUnreadMessages(notifs.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    setMarkingAsRead(notificationId);
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`);

      // Update notifications state and compute unread messages
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n,
        );
        setUnreadMessages(updated.filter((n) => !n.isRead));
        return updated;
      });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    for (const id of unreadIds) {
      await markAsRead(id);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage?.getItem("token")) {
        fetchNotifications();
      }
    }
  }, []);

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E6E8EA] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-[#FFC043]" />
          <h3 className="text-xs font-mono font-semibold text-[#11181C] uppercase tracking-wider">
            notifications()
          </h3>
          {hasUnread && (
            <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-mono font-medium text-white bg-[#FFC043] rounded-full">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          )}
        </div>
        {hasUnread && (
          <button
            onClick={markAllAsRead}
            className="text-[10px] font-mono text-[#687076] hover:text-[#FFC043] transition-colors"
          >
            mark_all_read()
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-[320px] overflow-y-auto bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-4 h-4 text-[#FFC043] animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-8 h-8 text-[#E6E8EA] mb-2" />
            <p className="text-[11px] font-mono text-[#687076] text-center">
              no_notifications_yet
            </p>
            <p className="text-[9px] font-mono text-[#687076] mt-1">
              // check back later
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F8F9FA]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 transition-colors duration-150 ${
                  n.isRead
                    ? "bg-white hover:bg-[#F8F9FA]"
                    : "bg-[#FFFDF5] hover:bg-[#FFF9E8]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-mono leading-relaxed ${
                        n.isRead
                          ? "text-[#687076]"
                          : "text-[#11181C] font-medium"
                      }`}
                    >
                      {n.message}
                    </p>
                    <p className="text-[9px] font-mono text-[#687076] mt-1.5">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      disabled={markingAsRead === n.id}
                      className="flex-shrink-0 text-[9px] font-mono text-[#FFC043] hover:text-[#11181C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {markingAsRead === n.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "mark_read"
                      )}
                    </button>
                  )}
                  {n.isRead && (
                    <CheckCircle2 className="flex-shrink-0 w-3 h-3 text-[#E6E8EA]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-[#E6E8EA] bg-[#F8F9FA]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-[#687076]">
              {notifications.filter((n) => n.isRead).length}/
              {notifications.length} read
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-[#687076]">
                $ autoflow --sync
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFC043] animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
