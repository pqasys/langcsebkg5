// Push notification utilities and VAPID key management
// import { offlineStorage } from './offline-storage';
import { logger } from './logger';

// VAPID configuration
export const VAPID_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
  subject: process.env.VAPID_SUBJECT || 'mailto:admin@fluentish.com',
  audience: process.env.NEXT_PUBLIC_SITE_URL || 'https://fluentish.com'
};

// Convert VAPID public key to Uint8Array for subscription
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Notification types
export enum NotificationType {
  COURSE_UPDATE = 'course_update',
  NEW_LESSON = 'new_lesson',
  QUIZ_REMINDER = 'quiz_reminder',
  ACHIEVEMENT = 'achievement',
  SYSTEM_UPDATE = 'system_update',
  PROMOTIONAL = 'promotional'
}

// Notification priority levels
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Notification interface
export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
  priority: NotificationPriority;
  timestamp: Date;
  expiresAt?: Date;
  userId?: string;
  read: boolean;
}

// Notification action interface
export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Push notification service class
export class PushNotificationService {
  private static instance: PushNotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  // Initialize the service
  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      // // // console.warn('Push notifications not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      return true;
    } catch (error) {
      logger.error('Failed to initialize push notification service:');
      return false;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Subscribe to push notifications
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      throw new Error(`Service worker not registered - Context: Service worker not registered - Context: return localStorage.getItem('userId') || null;);
    }

    const permission = await this.requestPermission();
    if (!permission) {
      throw new Error(Notification permission denied - Context: const permission = await this.requestPermission();...`);
    }

    try {
      const applicationServerKey = urlBase64ToUint8Array(VAPID_CONFIG.publicKey);
      
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      // Store subscription locally
      await this.storeSubscription(this.subscription);

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      return this.subscription;
    } catch (error) {
      logger.error('Failed to subscribe to push notifications:');
      throw error;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      await this.subscription.unsubscribe();
      
      // Remove from local storage
      await this.removeSubscription();

      // Notify server about unsubscription
      await this.removeSubscriptionFromServer(this.subscription.endpoint);

      this.subscription = null;
      return true;
    } catch (error) {
      logger.error('Failed to unsubscribe from push notifications:');
      return false;
    }
  }

  // Get current subscription
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      return null;
    }

    try {
      this.subscription = await this.registration.pushManager.getSubscription();
      return this.subscription;
    } catch (error) {
      logger.error('Failed to get subscription:');
      return null;
    }
  }

  // Check if subscribed
  async isSubscribed(): Promise<boolean> {
    const subscription = await this.getSubscription();
    return subscription !== null;
  }

  // Store subscription locally
  private async storeSubscription(subscription: PushSubscription): Promise<void> {
    try {
      await offlineStorage.storeOfflineData('push_subscription', {
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys,
        timestamp: new Date().toISOString()
      }, 'subscription');
    } catch (error) {
      logger.error('Failed to store subscription locally:');
    }
  }

  // Remove subscription from local storage
  private async removeSubscription(): Promise<void> {
    try {
      // This would remove from IndexedDB - implement based on your storage structure
      localStorage.removeItem('push_subscription');
    } catch (error) {
      logger.error('Failed to remove subscription locally:');
    }
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: subscription.toJSON().keys,
          userId: await this.getCurrentUserId()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send subscription to server - Context: keys: subscription.toJSON().keys,...);
      }
    } catch (error) {
      logger.error('Failed to send subscription to server:');
      throw error;
    }
  }

  // Remove subscription from server
  private async removeSubscriptionFromServer(endpoint: string): Promise<void> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint })
      });

      if (!response.ok) {
        throw new Error(Failed to remove subscription from server - Context: method: 'POST',...`);
      }
    } catch (error) {
      logger.error('Failed to remove subscription from server:');
    }
  }

  // Get current user ID (implement based on your auth system)
  private async getCurrentUserId(): Promise<string | null> {
    // This should be implemented based on your authentication system
    // For now, return null or get from localStorage/session
    return localStorage.getItem('userId') || null;
  }

  // Show local notification
  async showNotification(notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker not registered');
    }

    const notificationOptions: NotificationOptions = {
      body: notification.body,
          icon: notification.icon || '/icon.svg',
    badge: notification.badge || '/icon.svg',
      image: notification.image,
      data: notification.data,
      tag: notification.id,
      requireInteraction: notification.priority === NotificationPriority.URGENT,
      silent: notification.priority === NotificationPriority.LOW,
      actions: notification.actions?.map(action => ({
        action: action.action,
        title: action.title,
        icon: action.icon
      }))
    };

    await this.registration.showNotification(notification.title, notificationOptions);
  }

  // Schedule notification
  async scheduleNotification(notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>, delay: number): Promise<string> {
    const id = `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const scheduledNotification: PushNotification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false
    };

    // Store scheduled notification
    await this.storeScheduledNotification(scheduledNotification);

    // Schedule the notification
    setTimeout(async () => {
      await this.showNotification(notification);
      await this.removeScheduledNotification(id);
    }, delay);

    return id;
  }

  // Store scheduled notification
  private async storeScheduledNotification(notification: PushNotification): Promise<void> {
    try {
      const scheduledNotifications = await this.getScheduledNotifications();
      scheduledNotifications.push(notification);
      await offlineStorage.storeOfflineData('scheduled_notifications', scheduledNotifications, 'notifications');
    } catch (error) {
      logger.error('Failed to store scheduled notification:');
    }
  }

  // Remove scheduled notification
  private async removeScheduledNotification(id: string): Promise<void> {
    try {
      const scheduledNotifications = await this.getScheduledNotifications();
      const filtered = scheduledNotifications.filter(n => n.id !== id);
      await offlineStorage.storeOfflineData('scheduled_notifications', filtered, 'notifications');
    } catch (error) {
      logger.error('Failed to remove scheduled notification:');
    }
  }

  // Get scheduled notifications
  async getScheduledNotifications(): Promise<PushNotification[]> {
    try {
      const notifications = await offlineStorage.getOfflineData('scheduled_notifications');
      return notifications || [];
    } catch (error) {
      logger.error('Failed to get scheduled notifications:');
      return [];
    }
  }

  // Get notification history
  async getNotificationHistory(): Promise<PushNotification[]> {
    try {
      const history = await offlineStorage.getOfflineData('notification_history');
      return history || [];
    } catch (error) {
      logger.error('Failed to get notification history:');
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const history = await this.getNotificationHistory();
      const updated = history.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      await offlineStorage.storeOfflineData('notification_history', updated, 'notifications');
    } catch (error) {
      logger.error('Failed to mark notification as read:');
    }
  }

  // Clear notification history
  async clearHistory(): Promise<void> {
    try {
      await offlineStorage.storeOfflineData('notification_history', [], 'notifications');
    } catch (error) {
      logger.error('Failed to clear notification history:');
    }
  }
}

// Export singleton instance
export const pushNotificationService = PushNotificationService.getInstance();

// Utility functions for common notification types
export const NotificationUtils = {
  // Course update notification
  async sendCourseUpdate(courseId: string, courseName: string, updateType: string): Promise<void> {
    await pushNotificationService.showNotification({
      type: NotificationType.COURSE_UPDATE,
      title: 'Course Updated',
      body: `${courseName} has been updated with new ${updateType}`,
      data: { courseId, updateType },
      priority: NotificationPriority.NORMAL,
      actions: [
        {
          action: 'view_course',
          title: 'View Course',
          icon: '/icons/course.svg'
        }
      ]
    });
  },

  // New lesson notification
  async sendNewLesson(courseId: string, courseName: string, lessonName: string): Promise<void> {
    await pushNotificationService.showNotification({
      type: NotificationType.NEW_LESSON,
      title: 'New Lesson Available',
      body: `New lesson "${lessonName}" is now available in ${courseName}`,
      data: { courseId, lessonName },
      priority: NotificationPriority.HIGH,
      actions: [
        {
          action: 'start_lesson',
          title: 'Start Lesson',
          icon: '/icons/play.svg'
        }
      ]
    });
  },

  // Quiz reminder notification
  async sendQuizReminder(courseId: string, courseName: string): Promise<string> {
    return await pushNotificationService.scheduleNotification({
      type: NotificationType.QUIZ_REMINDER,
      title: 'Quiz Reminder',
      body: `Don't forget to complete your quiz for ${courseName}`,
      data: { courseId },
      priority: NotificationPriority.NORMAL,
      actions: [
        {
          action: 'take_quiz',
          title: 'Take Quiz',
          icon: '/icons/quiz.svg'
        }
      ]
    }, 24 * 60 * 60 * 1000); // 24 hours
  },

  // Achievement notification
  async sendAchievement(achievementName: string, description: string): Promise<void> {
    await pushNotificationService.showNotification({
      type: NotificationType.ACHIEVEMENT,
      title: 'Achievement Unlocked!',
      body: `Congratulations! You've earned "${achievementName}"`,
      data: { achievementName, description },
      priority: NotificationPriority.HIGH,
      icon: '/icons/achievement.svg',
      actions: [
        {
          action: 'view_achievement',
          title: 'View Achievement',
          icon: '/icons/trophy.svg'
        }
      ]
    });
  },

  // System update notification
  async sendSystemUpdate(updateTitle: string, updateDescription: string): Promise<void> {
    await pushNotificationService.showNotification({
      type: NotificationType.SYSTEM_UPDATE,
      title: updateTitle,
      body: updateDescription,
      priority: NotificationPriority.LOW,
      actions: [
        {
          action: 'learn_more',
          title: 'Learn More',
          icon: '/icons/info.svg'
        }
      ]
    });
  }
}; 