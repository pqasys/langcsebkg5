import { PaymentMethod, PaymentStatus } from '@prisma/client';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: PaymentIntent;
  error?: string;
}

export interface PaymentWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      status: string;
      payment_method: string;
      amount: number;
      currency: string;
      client_secret?: string;
    };
  };
}

export interface PaymentGatewayConfig {
  apiKey: string;
  webhookSecret: string;
  testMode: boolean;
}

export interface PaymentGatewayResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface PaymentDetails {
  transactionId?: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PaymentServiceConfig {
  defaultCurrency: string;
  supportedCurrencies: string[];
  testMode: boolean;
  paymentGateways: {
    [key: string]: PaymentGatewayConfig;
  };
}

export interface PaymentValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PaymentNotification {
  type: 'success' | 'error' | 'pending';
  message: string;
  paymentId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PaymentRefundRequest {
  paymentId: string;
  amount?: number;
  reason?: string;
}

export interface PaymentRefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

export interface PaymentAnalytics {
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  averageAmount: number;
  currency: string;
  period: {
    start: string;
    end: string;
  };
}

export interface PaymentReceipt {
  receiptId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  timestamp: string;
  customerDetails: {
    name: string;
    email: string;
  };
  items: Array<{
    description: string;
    amount: number;
  }>;
  metadata?: Record<string, any>;
} 