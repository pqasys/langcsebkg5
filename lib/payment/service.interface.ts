import { PaymentMethod, PaymentStatus } from '@prisma/client';
import {
  PaymentIntent,
  PaymentResult,
  PaymentWebhookEvent,
  PaymentDetails,
  PaymentRefundRequest,
  PaymentRefundResult,
  PaymentAnalytics,
  PaymentReceipt,
} from './types';

export interface IPaymentService {
  // Core payment methods
  createPaymentIntent(
    amount: number,
    currency: string,
    paymentMethod: PaymentMethod,
    metadata?: Record<string, any>
  ): Promise<PaymentResult>;

  confirmPayment(
    paymentIntentId: string,
    paymentMethod: PaymentMethod
  ): Promise<PaymentResult>;

  cancelPayment(paymentIntentId: string): Promise<PaymentResult>;

  // Webhook handling
  handleWebhook(event: PaymentWebhookEvent): Promise<void>;

  // Payment status and details
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  getPaymentDetails(paymentId: string): Promise<PaymentDetails>;

  // Refund handling
  processRefund(request: PaymentRefundRequest): Promise<PaymentRefundResult>;

  // Analytics and reporting
  getPaymentAnalytics(
    startDate: Date,
    endDate: Date,
    currency?: string
  ): Promise<PaymentAnalytics>;

  // Receipt generation
  generateReceipt(paymentId: string): Promise<PaymentReceipt>;

  // Validation
  validatePayment(
    amount: number,
    currency: string,
    paymentMethod: PaymentMethod
  ): Promise<boolean>;

  // Test mode methods
  simulatePayment(
    amount: number,
    currency: string,
    paymentMethod: PaymentMethod,
    success: boolean
  ): Promise<PaymentResult>;

  // Bypass payment for testing
  handleBypassPayment(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult>;
} 