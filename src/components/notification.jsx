"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

export default function NotificationsPopover({ setUnreadMessages }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage?.getItem("token")) {
        fetchNotifications();
      }
    }
  }, []);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Notifications</h4>

      <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-xs text-muted-foreground">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`text-sm p-2 rounded-lg ${
                n.isRead ? "bg-gray-100" : "bg-purple-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <p>{n.message}</p>
                {!n.isRead && (
                  <Button
                    onClick={() => markAsRead(n.id)}
                    variant="link"
                    className="text-xs text-purple-600"
                  >
                    Mark as read
                  </Button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                {formatDistanceToNow(new Date(n.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
