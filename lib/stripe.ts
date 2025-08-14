import Stripe from 'stripe';

// Initialize Stripe only if secret key is available
let stripeInstance: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
} else {
  console.warn('STRIPE_SECRET_KEY is not set. Payment processing will be simulated.');
}

export const stripe = stripeInstance;

// Export a function to check if Stripe is available
export const isStripeAvailable = (): boolean => {
  return stripeInstance !== null;
};

// Export a function to get Stripe instance with error handling
export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
  }
  return stripeInstance;
};
