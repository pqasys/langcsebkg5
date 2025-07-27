'use client';

import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  planName: string;
  isTrial?: boolean;
  trialDays?: number;
  onSuccess: (paymentIntent: unknown) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export function SubscriptionPaymentForm({
  clientSecret,
  amount,
  currency,
  planName,
  isTrial = false,
  trialDays = 14,
  onSuccess,
  onError,
  isLoading = false
}: SubscriptionPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Submit the payment element
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'An error occurred while submitting payment');
        onError(submitError.message || 'Payment submission failed');
        return;
      }

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/subscription-signup/success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        onError(confirmError.message || 'Payment failed');
      } else if (paymentIntent) {
        setSuccess(true);
        onSuccess(paymentIntent);
        toast.success(`Successfully subscribed to ${planName}! ${isTrial ? `Starting ${trialDays}-day free trial.` : ''}`);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground">
          {isTrial 
            ? `Your ${trialDays}-day free trial has started. You'll be charged ${currency} ${amount} after the trial ends.`
            : `Your subscription to ${planName} is now active.`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Plan:</span>
          <span className="font-semibold">{planName}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Amount:</span>
          <span className="font-semibold text-lg">
            {currency} {amount.toFixed(2)}
          </span>
        </div>
        {isTrial && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Trial Period:</span>
            <span className="font-semibold text-green-600">{trialDays} days free</span>
          </div>
        )}
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Payment Information</span>
          </div>
          <PaymentElement />
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => { if (typeof window !== 'undefined') window.history.back(); }}
            disabled={isProcessing || isLoading}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!stripe || isProcessing || isLoading}
            className="flex-1"
          >
            {isProcessing || isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isTrial ? 'Start Free Trial' : 'Subscribe Now'}
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>Your payment is secured by Stripe. We never store your payment information.</p>
          {isTrial && (
            <p className="text-blue-600">
              Your card will be authorized but not charged until after your {trialDays}-day free trial ends.
            </p>
          )}
        </div>
      </form>
    </div>
  );
} 