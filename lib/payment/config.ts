import { PaymentMethod } from '@prisma/client';

export const PAYMENT_CONFIG = {
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  paypal: {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  isTestMode: process.env.NODE_ENV === 'development',
};

export const getAvailablePaymentMethods = (): PaymentMethod[] => {
  const methods: PaymentMethod[] = [
    PaymentMethod.CREDIT_CARD,
    PaymentMethod.PAYPAL,
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.OFFLINE,
  ];

  // Add test mode and bypass in development
  if (PAYMENT_CONFIG.isTestMode) {
    methods.push(PaymentMethod.TEST_MODE);
    methods.push(PaymentMethod.BYPASS);
  }

  return methods;
};

export const getPaymentGatewayConfig = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CREDIT_CARD:
      return {
        gateway: 'stripe',
        config: PAYMENT_CONFIG.stripe,
      };
    case PaymentMethod.PAYPAL:
      return {
        gateway: 'paypal',
        config: PAYMENT_CONFIG.paypal,
      };
    case PaymentMethod.TEST_MODE:
    case PaymentMethod.BYPASS:
      return {
        gateway: 'test',
        config: {},
      };
    default:
      return null;
  }
}; 