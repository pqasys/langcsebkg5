import { PaymentMethod } from '@prisma/client';
import {
  PaymentIntent,
  PaymentResult,
  PaymentGatewayConfig,
  PaymentGatewayResponse,
} from './types';

export interface IPaymentGateway {
  // Configuration
  initialize(config: PaymentGatewayConfig): Promise<void>;
  isTestMode(): boolean;

  // Core payment methods
  createPaymentIntent(
    amount: number,
    currency: string,
    paymentMethod: PaymentMethod,
    metadata?: Record<string, any>
  ): Promise<PaymentGatewayResponse>;

  confirmPayment(
    paymentIntentId: string,
    paymentMethod: PaymentMethod
  ): Promise<PaymentGatewayResponse>;

  cancelPayment(paymentIntentId: string): Promise<PaymentGatewayResponse>;

  // Payment status
  getPaymentStatus(paymentIntentId: string): Promise<PaymentGatewayResponse>;

  // Refund handling
  processRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<PaymentGatewayResponse>;

  // Webhook handling
  constructEvent(
    payload: string,
    signature: string,
    secret: string
  ): Promise<any>;

  // Validation
  validatePaymentMethod(paymentMethod: PaymentMethod): boolean;
  validateAmount(amount: number, currency: string): boolean;

  // Error handling
  handleError(error: unknown): PaymentGatewayResponse;
} 