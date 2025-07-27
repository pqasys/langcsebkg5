import { PaymentNotification } from './types';

export interface IPaymentNotifier {
  // Notification methods
  sendPaymentSuccess(notification: PaymentNotification): Promise<void>;
  sendPaymentFailure(notification: PaymentNotification): Promise<void>;
  sendPaymentPending(notification: PaymentNotification): Promise<void>;
  sendRefundNotification(notification: PaymentNotification): Promise<void>;

  // Notification preferences
  setNotificationPreferences(preferences: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  }): Promise<void>;

  // Notification templates
  getNotificationTemplate(type: string): Promise<string>;
  setNotificationTemplate(type: string, template: string): Promise<void>;

  // Notification history
  getNotificationHistory(
    paymentId: string,
    limit?: number
  ): Promise<PaymentNotification[]>;

  // Error handling
  handleNotificationError(error: unknown): Promise<void>;
} 