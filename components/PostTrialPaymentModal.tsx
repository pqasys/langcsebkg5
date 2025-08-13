'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PostTrialPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: {
    id: string;
    planType: string;
    amount: number;
    currency: string;
    billingCycle: string;
  };
  userType: 'STUDENT' | 'INSTITUTION';
}

function PaymentForm({ subscription, userType, onSuccess, onError }: {
  subscription: any;
  userType: 'STUDENT' | 'INSTITUTION';
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        onError(submitError.message || 'Payment failed');
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?payment=success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        onError(confirmError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ${subscription.amount} to Continue
          </>
        )}
      </Button>
    </form>
  );
}

export default function PostTrialPaymentModal({
  isOpen,
  onClose,
  subscription,
  userType,
}: PostTrialPaymentModalProps) {
  const { data: session } = useSession();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && subscription && !clientSecret) {
      createPaymentIntent();
    }
  }, [isOpen, subscription]);

  const createPaymentIntent = async () => {
    if (!session?.user?.id || !subscription) return;

    setIsLoading(true);
    try {
      const endpoint = userType === 'STUDENT' 
        ? '/api/student/subscription/post-trial-payment'
        : '/api/institution/subscription/post-trial-payment';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment intent');
      }

      const { clientSecret: secret } = await response.json();
      setClientSecret(secret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    toast.success('Payment successful! Your subscription has been activated.');
    setTimeout(() => {
      onClose();
      window.location.reload(); // Refresh to update subscription status
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentSuccess ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">Payment Successful!</h3>
              <p className="text-gray-600">
                Your subscription has been activated. Welcome back!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <Badge variant="secondary">{subscription.planType}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Billing Cycle:</span>
                  <span className="text-sm font-medium">
                    {subscription.billingCycle}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-lg font-bold">
                    ${subscription.amount} {subscription.currency}
                  </span>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your trial has expired. Please complete payment to continue your subscription.
                </AlertDescription>
              </Alert>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <PaymentForm
                    subscription={subscription}
                    userType={userType}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              ) : (
                <Button
                  onClick={createPaymentIntent}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Initializing Payment...
                    </>
                  ) : (
                    'Initialize Payment'
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
