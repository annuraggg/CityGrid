import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { 
  Bell, 
  CheckCheck, 
  Filter, 
  ArrowDown, 
  ArrowUp, 
  Check, 
  Trash2,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Clock,
  Settings,
  Info
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
  const { getToken } = useAuth();
  const axios = ax(getToken);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(true);
  const [notificationSound, setNotificationSound] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Add development mode flag
  const [devMode, setDevMode] = useState<boolean>(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // In dev mode, always use dummy data
      if (devMode) {
        console.log("Using dummy notifications in dev mode");
        setNotifications(dummyNotifications);
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get('/notifications');
      console.log("API response:", response.data);
      if (response.data && response.data.data && response.data.data.length > 0) {
        setNotifications(response.data.data);
      } else {
        console.log("No notifications in API response, using dummy data");
        setNotifications(dummyNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error("Failed to load notifications");
      console.log("Loading dummy notifications after error");
      setNotifications(dummyNotifications);
    } finally {
      setIsLoading(false);
    }
  };

  // Dummy data for development and testing
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

  useEffect(() => {
    console.log("Current notifications:", notifications);
    console.log("Active tab:", activeTab);
    console.log("Type filter:", typeFilter);
    
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
    
    console.log("Filtered notifications:", filtered);
    setFilteredNotifications(filtered);
  }, [notifications, activeTab, sortOrder, typeFilter]);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      // In dev mode, skip API call and update state directly
      if (devMode) {
        setNotifications(prev =>
          prev.map(notification =>
            notification._id === id ? { ...notification, isRead: true } : notification
          )
        );
        toast.success("Notification marked as read");
        return;
      }
      
      await axios.patch(`/notifications/${id}`, { isRead: true });
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
      toast.success("Notification marked as read");
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      // In dev mode, skip API call and update state directly
      if (devMode) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        toast.success("All notifications marked as read");
        return;
      }
      
      await axios.patch('/notifications/mark-all-read');
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error("Failed to update notifications");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // In dev mode, skip API call and update state directly
      if (devMode) {
        setNotifications(prev => prev.filter(notification => notification._id !== id));
        toast.success("Notification deleted");
        return;
      }
      
      await axios.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(notification => notification._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error("Failed to delete notification");
    }
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

  const getAvatarBgColor = (id: string): string => {
    const colors = [
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-amber-600",
      "bg-rose-600",
      "bg-cyan-600",
      "bg-violet-600",
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-indigo-600" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "update":
        return <RefreshCw className="h-4 w-4 text-emerald-600" />;
      case "system":
        return <Settings className="h-4 w-4 text-slate-600" />;
      default:
        return <Info className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "message":
        return (
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
            <MessageSquare className="h-3 w-3 mr-1" /> Message
          </Badge>
        );
      case "alert":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
            <AlertTriangle className="h-3 w-3 mr-1" /> Alert
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            <RefreshCw className="h-3 w-3 mr-1" /> Update
          </Badge>
        );
      case "system":
        return (
          <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100">
            <Settings className="h-3 w-3 mr-1" /> System
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100">
            <Info className="h-3 w-3 mr-1" /> Info
          </Badge>
        );
    }
  };

  const renderAvatar = (notification: Notification) => {
    return (
      <div className={`flex-shrink-0 rounded-full w-12 h-12 flex items-center justify-center text-white font-medium text-sm ${getAvatarBgColor(notification._id)}`}>
        {notification.avatar}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto px-6 py-8 space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Notifications</h1>
          <p className="text-slate-500">Stay updated with the latest activities and alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4 mr-2 text-slate-500" />
            Mark All Read
          </Button>
          <Button
            onClick={fetchNotifications}
            variant="outline"
            size="sm"
            className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-3 text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-2 text-slate-500" />
            Refresh
          </Button>
          {/* Add dev mode toggle */}
          <Button
            onClick={() => setDevMode(!devMode)}
            variant={devMode ? "default" : "outline"}
            size="sm"
            className="h-9 px-3 text-sm font-medium"
          >
            {devMode ? "Dev Mode On" : "Dev Mode Off"}
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden p-0">
        <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-medium text-slate-900">Notification Center</h2>
            {unreadCount > 0 && (
              <div className="ml-2 bg-indigo-600 text-white text-xs font-medium rounded-full h-6 w-6 flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  <Filter className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-slate-200">
                <DropdownMenuLabel className="text-slate-900">Filter Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => setTypeFilter(null)}
                    className={`${!typeFilter ? 'bg-slate-50 text-slate-900' : 'text-slate-700'} cursor-pointer`}
                  >
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTypeFilter("message")}
                    className={`${typeFilter === 'message' ? 'bg-slate-50 text-slate-900' : 'text-slate-700'} cursor-pointer`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTypeFilter("alert")}
                    className={`${typeFilter === 'alert' ? 'bg-slate-50 text-slate-900' : 'text-slate-700'} cursor-pointer`}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                    Alerts
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTypeFilter("update")}
                    className={`${typeFilter === 'update' ? 'bg-slate-50 text-slate-900' : 'text-slate-700'} cursor-pointer`}
                  >
                    <RefreshCw className="h-4 w-4 mr-2 text-emerald-600" />
                    Updates
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTypeFilter("system")}
                    className={`${typeFilter === 'system' ? 'bg-slate-50 text-slate-900' : 'text-slate-700'} cursor-pointer`}
                  >
                    <Settings className="h-4 w-4 mr-2 text-slate-600" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem 
                  onClick={toggleSortOrder}
                  className="text-slate-700 cursor-pointer"
                >
                  {sortOrder === "newest" ? (
                    <>
                      <ArrowDown className="h-4 w-4 mr-2 text-slate-500" />
                      Newest First
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-4 w-4 mr-2 text-slate-500" />
                      Oldest First
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuLabel className="text-slate-900">Settings</DropdownMenuLabel>
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="show-notifications" className="text-sm text-slate-700">Show Notifications</Label>
                    <Switch
                      id="show-notifications"
                      checked={showNotifications}
                      onCheckedChange={setShowNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notification-sound" className="text-sm text-slate-700">Sound</Label>
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

        <div className="border-b border-slate-200">
          <div className="flex bg-slate-50">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "all"
                  ? "bg-white text-slate-900 border-b-2 border-indigo-600"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-6 py-3 text-sm font-medium flex items-center ${
                activeTab === "unread"
                  ? "bg-white text-slate-900 border-b-2 border-indigo-600"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1 bg-indigo-600 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("read")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "read"
                  ? "bg-white text-slate-900 border-b-2 border-indigo-600"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900"
              }`}
            >
              Read
            </button>
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 border-r-2 border-slate-300 mb-4"></div>
              <p className="text-slate-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <ScrollArea className="h-96">
              <ul className="divide-y divide-slate-200">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification._id}
                    className={`${
                      !notification.isRead 
                        ? "bg-slate-50 border-l-4 border-l-indigo-600" 
                        : "bg-white"
                    } transition-colors`}
                  >
                    <div className="flex p-4 relative">
                      <div className="mr-4">
                        {renderAvatar(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-base font-medium text-slate-900">{notification.title}</h3>
                          <div className="flex items-center">
                            {getTypeBadge(notification.type || 'system')}
                            <div className="flex ml-2">
                              {!notification.isRead && (
                                <button
                                  className="p-1 rounded-full hover:bg-slate-100 text-slate-700"
                                  onClick={() => markAsRead(notification._id)}
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                className="p-1 rounded-full hover:bg-rose-100 text-slate-700 hover:text-rose-600 ml-1"
                                onClick={() => deleteNotification(notification._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <Clock className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                          <p className="text-xs text-slate-500">{formatDate(notification.createdAt)}</p>
                        </div>
                        <p className="text-sm text-slate-700">{notification.message}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-700 font-medium mb-1">No notifications to display</p>
              <p className="text-slate-500 mb-4 max-w-md mx-auto text-center">
                {typeFilter ? 
                  `No ${typeFilter} notifications found.` : 
                  activeTab === "unread" ? 
                    "You've read all your notifications." : 
                    "You don't have any notifications yet."
                }
              </p>
              {typeFilter && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTypeFilter(null)}
                  className="text-slate-700 border-slate-200 hover:bg-slate-50 h-9 px-4 text-sm font-medium"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotificationComponent;