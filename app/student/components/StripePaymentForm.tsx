'use client';

import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
  amount: number;
  courseTitle: string;
}

export default function StripePaymentForm({
  clientSecret,
  onSuccess,
  onCancel,
  amount,
  courseTitle,
}: StripePaymentFormProps) {
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
        return;
      }

      // Confirm the payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/student/courses/payment/success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        toast.error('Payment failed: ' + (confirmError.message || 'Unknown error'));
      } else {
        setSuccess(true);
        toast.success('Payment successful! Redirecting...');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Payment error: ' + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-muted-foreground">Redirecting you to your course...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 text-gray-500">💳</div>
          <span className="font-medium">Payment Information</span>
        </div>
        <PaymentElement />
      </div>

      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Your payment is secured by Stripe. We never store your payment information.</p>
        <p>Course: {courseTitle}</p>
      </div>
    </form>
  );
} 