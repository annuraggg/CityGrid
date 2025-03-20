import React, { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Filter, ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Notification {
  _id: string;
  recipient: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  type?: "message" | "alert" | "update" | "system";
  title?: string;
  avatar?: string;
}

const NotificationComponent: React.FC = () => {
  const dummyNotifications: Notification[] = [
    {
      _id: "1",
      recipient: "user123",
      message: "Your project 'Dashboard Redesign' has been approved by the team lead.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      type: "update",
      title: "Project Update",
      avatar: "JD"
    },
    {
      _id: "2",
      recipient: "user123",
      message: "Sarah mentioned you in a comment: 'Thanks @user for your help with the API integration!'",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: "message",
      title: "New Mention",
      avatar: "SM"
    },
    {
      _id: "3",
      recipient: "user123",
      message: "Your weekly report has been generated and is ready for review.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      type: "system",
      title: "Report Generated",
      avatar: "RP"
    },
    {
      _id: "4",
      recipient: "user123",
      message: "Security alert: Your account was accessed from a new device in San Francisco, CA.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      type: "alert",
      title: "Security Alert",
      avatar: "SA"
    },
    {
      _id: "5",
      recipient: "user123",
      message: "System maintenance scheduled for tomorrow at 2:00 AM UTC. Expect brief downtime.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      type: "system",
      title: "Maintenance Notice",
      avatar: "SY"
    },
    {
      _id: "6",
      recipient: "user123",
      message: "Your subscription will renew in 3 days. Update payment details if needed.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      type: "alert",
      title: "Subscription Renewal",
      avatar: "BL"
    },
    {
      _id: "7",
      recipient: "user123",
      message: "Alex shared a document with you: 'Q1 Marketing Strategy'",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      type: "message",
      title: "Document Shared",
      avatar: "AX"
    }
  ];

  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(true);
  const [notificationSound, setNotificationSound] = useState<boolean>(true);

  useEffect(() => {
    let filtered = [...notifications];
    
    if (typeFilter) {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }
    
    switch (activeTab) {
      case "unread":
        filtered = filtered.filter((notification) => !notification.isRead);
        break;
      case "read":
        filtered = filtered.filter((notification) => notification.isRead);
        break;
      default:
        break;
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredNotifications(filtered);
  }, [notifications, activeTab, sortOrder, typeFilter]);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification._id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderAvatar = (notification: Notification) => {
    return (
      <div className="flex-shrink-0 rounded-full w-12 h-12 flex items-center justify-center text-white font-medium text-sm bg-gray-600">
        {notification.avatar}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <Bell className="mr-2 h-5 w-5 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <div className="ml-2 bg-gray-900 text-white text-xs font-medium rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Button
            onClick={markAllAsRead}
            variant="ghost"
            size="sm"
            className="mr-2"
          >
            <CheckCheck className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("message")}>
                  <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                  Messages
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("alert")}>
                  <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                  Alerts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("update")}>
                  <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                  Updates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter("system")}>
                  <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                  System
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleSortOrder}>
                {sortOrder === "newest" ? (
                  <>
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Newest First
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Oldest First
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="show-notifications" className="text-sm">Show Notifications</Label>
                  <Switch
                    id="show-notifications"
                    checked={showNotifications}
                    onCheckedChange={setShowNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notification-sound" className="text-sm">Sound</Label>
                  <Switch
                    id="notification-sound"
                    checked={notificationSound}
                    onCheckedChange={setNotificationSound}
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "all"
                ? "bg-white text-gray-900 border-b-2 border-gray-900"
                : "bg-gray-50 text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-6 py-3 text-sm font-medium flex items-center ${
              activeTab === "unread"
                ? "bg-white text-gray-900 border-b-2 border-gray-900"
                : "bg-gray-50 text-gray-500 hover:text-gray-700"
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 bg-gray-900 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("read")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "read"
                ? "bg-white text-gray-900 border-b-2 border-gray-900"
                : "bg-gray-50 text-gray-500 hover:text-gray-700"
            }`}
          >
            Read
          </button>
        </div>
      </div>

      <CardContent className="p-0">
        {filteredNotifications.length > 0 ? (
          <ScrollArea className="h-96">
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <li 
                  key={notification._id}
                  className={`${
                    !notification.isRead 
                      ? "bg-gray-50 border-l-4 border-l-gray-600" 
                      : "bg-white"
                  }`}
                >
                  <div className="flex p-4 relative">
                    <div className="mr-4">
                      {renderAvatar(notification)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium text-gray-900">{notification.title}</h3>
                        {!notification.isRead && (
                          <button
                            className="p-1 rounded-full hover:bg-gray-200"
                            onClick={() => markAsRead(notification._id)}
                          >
                            <Check className="h-4 w-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(notification.createdAt)}</p>
                      <p className="mt-1 text-sm text-gray-700">{notification.message}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No notifications to display</p>
            {typeFilter && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTypeFilter(null)}
                className="mt-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setNotifications(dummyNotifications)}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default NotificationComponent;