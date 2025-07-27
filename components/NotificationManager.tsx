'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff, 
  Settings, 
  History, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { 
  pushNotificationService, 
  NotificationType, 
  NotificationPriority,
  NotificationUtils 
} from '@/lib/push-notifications';
import { toast } from '@/components/ui/use-toast';

interface NotificationSettings {
  enabled: boolean;
  types: {
    [key in NotificationType]: boolean;
  };
  priority: NotificationPriority;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export function NotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    types: {
      [NotificationType.COURSE_UPDATE]: true,
      [NotificationType.NEW_LESSON]: true,
      [NotificationType.QUIZ_REMINDER]: true,
      [NotificationType.ACHIEVEMENT]: true,
      [NotificationType.SYSTEM_UPDATE]: false,
      [NotificationType.PROMOTIONAL]: false
    },
    priority: NotificationPriority.NORMAL,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [notificationHistory, setNotificationHistory] = useState<any[]>([]);
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>([]);

  useEffect(() => {
    initializeNotifications();
    loadNotificationHistory();
    loadScheduledNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      const initialized = await pushNotificationService.initialize();
      if (initialized) {
        const subscribed = await pushNotificationService.isSubscribed();
        setIsSubscribed(subscribed);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to initialize notifications:');
    }
  };

  const loadNotificationHistory = async () => {
    try {
      const history = await pushNotificationService.getNotificationHistory();
      setNotificationHistory(history);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to load notification history:');
    }
  };

  const loadScheduledNotifications = async () => {
    try {
      const scheduled = await pushNotificationService.getScheduledNotifications();
      setScheduledNotifications(scheduled);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to load scheduled notifications:');
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await pushNotificationService.subscribe();
      setIsSubscribed(true);
      toast({
        title: "Notifications Enabled",
        description: "You will now receive push notifications.",
        variant: "default",
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to subscribe:');
      toast({
        title: "Subscription Failed",
        description: "Failed to enable notifications. Please check your browser settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      await pushNotificationService.unsubscribe();
      setIsSubscribed(false);
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive push notifications.",
        variant: "default",
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to unsubscribe:');
      toast({
        title: "Unsubscription Failed",
        description: "Failed to disable notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await NotificationUtils.sendSystemUpdate(
        'Test Notification',
        'This is a test notification to verify your settings are working correctly.'
      );
      toast({
        title: "Test Notification Sent",
        description: "Check your notifications to see the test message.",
        variant: "default",
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to send test notification:');
      toast({
        title: "Test Failed",
        description: "Failed to send test notification.",
        variant: "destructive",
      });
    }
  };

  const handleClearHistory = async () => {
    try {
      await pushNotificationService.clearHistory();
      setNotificationHistory([]);
      toast({
        title: "History Cleared",
        description: "Notification history has been cleared.",
        variant: "default",
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to clear history:');
      toast({
        title: "Clear Failed",
        description: "Failed to clear notification history.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await pushNotificationService.markAsRead(notificationId);
      setNotificationHistory(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to mark as read:');
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Save settings to localStorage or API
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('notification_settings', JSON.stringify({ ...settings, ...newSettings }));
    }
  };

  const updateNotificationType = (type: NotificationType, enabled: boolean) => {
    updateSettings({
      types: {
        ...settings.types,
        [type]: enabled
      }
    });
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COURSE_UPDATE:
        return '📚';
      case NotificationType.NEW_LESSON:
        return '📖';
      case NotificationType.QUIZ_REMINDER:
        return '📝';
      case NotificationType.ACHIEVEMENT:
        return '🏆';
      case NotificationType.SYSTEM_UPDATE:
        return '⚙️';
      case NotificationType.PROMOTIONAL:
        return '📢';
      default:
        return '🔔';
    }
  };

  const getNotificationTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COURSE_UPDATE:
        return 'Course Update';
      case NotificationType.NEW_LESSON:
        return 'New Lesson';
      case NotificationType.QUIZ_REMINDER:
        return 'Quiz Reminder';
      case NotificationType.ACHIEVEMENT:
        return 'Achievement';
      case NotificationType.SYSTEM_UPDATE:
        return 'System Update';
      case NotificationType.PROMOTIONAL:
        return 'Promotional';
      default:
        return 'Notification';
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isSubscribed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  {isSubscribed ? 'Notifications Enabled' : 'Notifications Disabled'}
                </span>
              </div>
              <Badge variant={isSubscribed ? "default" : "secondary"}>
                {isSubscribed ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex space-x-2">
              {!isSubscribed ? (
                <Button onClick={handleSubscribe} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                  Enable Notifications
                </Button>
              ) : (
                <Button variant="outline" onClick={handleUnsubscribe} disabled={isLoading}>
                  <BellOff className="w-4 h-4" />
                  Disable Notifications
                </Button>
              )}
              <Button variant="outline" onClick={handleTestNotification}>
                <MessageSquare className="w-4 h-4" />
                Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">General Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-gray-600">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(enabled) => updateSettings({ enabled })}
                  />
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4">
                <h3 className="font-semibold">Notification Types</h3>
                <div className="space-y-3">
                  {Object.entries(settings.types).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getNotificationIcon(type as NotificationType)}</span>
                        <div>
                          <p className="font-medium">{getNotificationTypeLabel(type as NotificationType)}</p>
                          <p className="text-sm text-gray-600">
                            {type === NotificationType.COURSE_UPDATE && 'Updates to your enrolled courses'}
                            {type === NotificationType.NEW_LESSON && 'New lessons available in your courses'}
                            {type === NotificationType.QUIZ_REMINDER && 'Reminders for pending quizzes'}
                            {type === NotificationType.ACHIEVEMENT && 'Achievements and milestones'}
                            {type === NotificationType.SYSTEM_UPDATE && 'System updates and maintenance'}
                            {type === NotificationType.PROMOTIONAL && 'Promotional content and offers'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => updateNotificationType(type as NotificationType, checked)}
                        disabled={!settings.enabled}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-4">
                <h3 className="font-semibold">Quiet Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Quiet Hours</p>
                      <p className="text-sm text-gray-600">Pause notifications during specific hours</p>
                    </div>
                    <Switch
                      checked={settings.quietHours.enabled}
                      onCheckedChange={(enabled) => 
                        updateSettings({ 
                          quietHours: { ...settings.quietHours, enabled } 
                        })
                      }
                    />
                  </div>
                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <input
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) => 
                            updateSettings({ 
                              quietHours: { ...settings.quietHours, start: e.target.value } 
                            })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <input
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) => 
                            updateSettings({ 
                              quietHours: { ...settings.quietHours, end: e.target.value } 
                            })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Notification History</span>
                </div>
                <Button variant="outline" onClick={handleClearHistory}>
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notificationHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notification history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notificationHistory.slice(0, 20).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimestamp(notification.timestamp)}</span>
                              </span>
                              <span>{getNotificationTypeLabel(notification.type)}</span>
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Scheduled Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No scheduled notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledNotifications.map((notification) => (
                    <div key={notification.id} className="p-4 rounded-lg border bg-yellow-50 border-yellow-200">
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">⏰</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.body}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Scheduled for: {formatTimestamp(notification.scheduledFor)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 