import React, { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Filter, ArrowDown, ArrowUp, Settings, RefreshCcw, Search, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    <div className="w-full mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
            <p className="text-slate-500 mt-1">Stay updated with your latest activities and alerts</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotifications(dummyNotifications)}
              className="text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" size={18} />
            <Input
              placeholder="Search..."
              className="pl-8 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                    <Filter className="h-4 w-4 mr-2" />
                    {typeFilter ? `Filter: ${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}s` : "All Types"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 border-slate-200">
                  <DropdownMenuLabel className="text-slate-700">Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setTypeFilter(null)} className="text-slate-700">
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("message")} className="text-slate-700">
                      <div className="h-2 w-2 rounded-full bg-slate-400 mr-2"></div>
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("alert")} className="text-slate-700">
                      <div className="h-2 w-2 rounded-full bg-slate-400 mr-2"></div>
                      Alerts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("update")} className="text-slate-700">
                      <div className="h-2 w-2 rounded-full bg-slate-400 mr-2"></div>
                      Updates
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("system")} className="text-slate-700">
                      <div className="h-2 w-2 rounded-full bg-slate-400 mr-2"></div>
                      System Notices
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
                className="text-slate-600 border-slate-200 hover:bg-slate-50"
              >
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
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:bg-slate-50">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-slate-200">
                  <DropdownMenuLabel className="text-slate-700">Notification Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="show-notifications" className="text-sm text-slate-600">Receive Notifications</Label>
                      <Switch
                        id="show-notifications"
                        checked={showNotifications}
                        onCheckedChange={setShowNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-sound" className="text-sm text-slate-600">Play Sound Alerts</Label>
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
        </div>
      </div>

      {/* Tabs OUTSIDE the card */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "unread" | "read")}
        className="w-full"
      >
        <TabsList className="bg-white border border-slate-200 mb-6 w-auto">
          <TabsTrigger value="all">
            <span className="font-medium">All Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="unread">
            <span className="font-medium">Unread</span>
            {unreadCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-slate-100 text-slate-800 border-slate-200">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">
            <span className="font-medium">Previously Read</span>
          </TabsTrigger>
        </TabsList>

        {/* Content for each tab inside its own card */}

        <TabsContent value="all" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
            <NotificationList
              notifications={filteredNotifications}
              markAsRead={markAsRead}
              formatDate={formatDate}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
            />
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
            <NotificationList
              notifications={filteredNotifications.filter(n => !n.isRead)}
              markAsRead={markAsRead}
              formatDate={formatDate}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
            />
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
              Showing {filteredNotifications.filter(n => !n.isRead).length} of {notifications.filter(n => !n.isRead).length} notifications
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="read" className="mt-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden py-0">
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
            <NotificationList
              notifications={filteredNotifications.filter(n => n.isRead)}
              markAsRead={markAsRead}
              formatDate={formatDate}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
            />
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
              Showing {filteredNotifications.filter(n => n.isRead).length} of {notifications.filter(n => n.isRead).length} notifications
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  formatDate: (dateString: string) => string;
  typeFilter: string | null;
  setTypeFilter: (filter: string | null) => void;
}

// This component pulls out the notification list to be reused across tabs
const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  markAsRead,
  formatDate,
  typeFilter,
  setTypeFilter
}) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Bell className="h-12 w-12 text-slate-300 mb-4" />
        <p className="text-slate-500 mb-1">No notifications to display</p>
        <p className="text-sm text-slate-400">
          {typeFilter
            ? "Try changing your filter settings"
            : "You're all caught up"}
        </p>
        {typeFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTypeFilter(null)}
            className="mt-3 text-slate-600 border-slate-200 hover:bg-slate-50"
          >
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="p-4 grid gap-4">
        {notifications.map((notification) => (
          <Card
            key={notification._id}
            className={`border-slate-200 shadow-sm overflow-hidden ${!notification.isRead ? "bg-slate-50" : "bg-white"
              }`}
          >
            <CardContent className="p-4">
              <div className="flex">
                <div className="mr-4">
                  <Avatar className="h-10 w-10 bg-slate-200 text-slate-700">
                    <AvatarFallback className="text-sm font-medium">
                      {notification.avatar}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-slate-900">{notification.title}</h3>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-100 rounded-full"
                        onClick={() => markAsRead(notification._id)}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{formatDate(notification.createdAt)}</p>
                  <p className="mt-1 text-sm text-slate-700">{notification.message}</p>
                </div>
              </div>
              {!notification.isRead && (
                <div className="h-1 w-1 bg-slate-400 absolute top-4 right-4 rounded-full"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NotificationComponent;