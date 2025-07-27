'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CreditCard, Wallet, Building2, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useCurrency } from '@/app/hooks/useCurrency';
import { toast } from 'sonner';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './StripePaymentForm';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface PayCourseButtonProps {
  courseId: string;
  amount: number;
  courseTitle: string;
  institutionName: string;
  enrollmentDetails?: {
    price: number;
    startDate: string;
    endDate: string;
    weeks?: number;
    months?: number;
  };
  onPaymentComplete?: () => void;
  initialPaymentStatus?: {
    status: 'idle' | 'pending' | 'success' | 'error';
    message?: string;
    details?: {
      enrollmentStatus?: string;
      paymentStatus?: string;
      [key: string]: any;
    };
  };
}

export default function PayCourseButton({
  courseId,
  amount,
  courseTitle,
  institutionName,
  enrollmentDetails,
  onPaymentComplete,
  initialPaymentStatus,
}: PayCourseButtonProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<{
    status: 'idle' | 'pending' | 'success' | 'error';
    message?: string;
    details?: {
      enrollmentStatus?: string;
      paymentStatus?: string;
      [key: string]: any;
    };
  }>(initialPaymentStatus || { status: 'idle' });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { formatCurrency } = useCurrency();

  // Check if payment is pending
  const isPaymentPending = paymentStatus.status === 'pending';

  const handlePayment = async () => {
    if (!session) {
      navigate.to('/auth/signin');
      return;
    }

    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPaymentStatus({ status: 'pending', message: 'Processing payment...' });

    try {
      const response = await fetch(`/api/student/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          amount: enrollmentDetails?.price || amount,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to process payment');
      }

      if (selectedPaymentMethod === 'CREDIT_CARD' && data.clientSecret) {
        // For credit card payments, show the Stripe payment form
        setClientSecret(data.clientSecret);
        setShowPaymentForm(true);
        setPaymentStatus({ status: 'pending', message: 'Please complete your payment details' });
      } else {
        // For other payment methods, show success immediately
        setPaymentStatus({
          status: 'success',
          message: 'Payment successful!',
          details: data,
        });

        // Close the dialog after a short delay
        setTimeout(() => {
          setIsOpen(false);
          // Force a hard refresh of the page to update all components
          navigate.reload();
        }, 2000);
      }

    } catch (err) {
      toast.error('Payment error:');
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      setPaymentStatus({ status: 'error', message: 'Payment failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusContent = () => {
    switch (paymentStatus.status) {
      case 'pending':
        return (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">{paymentStatus.message}</span>
          </div>
        );
      case 'success':
        return (
          <Alert>
            <AlertDescription>{paymentStatus.message}</AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertDescription>{paymentStatus.message}</AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="w-full"
            onClick={() => {
              setError(null);
              setSelectedPaymentMethod('');
              setPaymentStatus({ status: 'idle' });
            }}
            disabled={isPaymentPending}
          >
            {isPaymentPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Payment processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Course Enrollment</DialogTitle>
            <DialogDescription>
              Please review your course details and select a payment method to complete your enrollment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!session && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please sign in to make a payment. You will be redirected to the login page.
                </AlertDescription>
              </Alert>
            )}

            {!showPaymentForm ? (
              <>
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Course Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Course:</span> {courseTitle}</p>
                    <p><span className="font-medium">Institution:</span> {institutionName}</p>
                    <p><span className="font-medium">Amount:</span> {formatCurrency(enrollmentDetails?.price || amount)}</p>
                    {enrollmentDetails?.weeks && (
                      <p><span className="font-medium">Duration:</span> {enrollmentDetails.weeks} weeks</p>
                    )}
                    {enrollmentDetails?.months && (
                      <p><span className="font-medium">Duration:</span> {enrollmentDetails.months} months</p>
                    )}
                    {enrollmentDetails?.startDate && (
                      <p><span className="font-medium">Start Date:</span> {formatDate(enrollmentDetails.startDate)}</p>
                    )}
                    {enrollmentDetails?.endDate && (
                      <p><span className="font-medium">End Date:</span> {formatDate(enrollmentDetails.endDate)}</p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-4">Choose Your Payment Method</h3>
                  <p className="text-sm text-gray-600 mb-4">Select your preferred payment method to proceed with the enrollment.</p>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="CREDIT_CARD"
                        checked={selectedPaymentMethod === 'CREDIT_CARD'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span>Credit / Debit Card</span>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="BANK_TRANSFER"
                        checked={selectedPaymentMethod === 'BANK_TRANSFER'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2" />
                        <span>Bank Transfer</span>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="payment_method"
                        value="OFFLINE"
                        checked={selectedPaymentMethod === 'OFFLINE'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <Wallet className="h-5 w-5 mr-2" />
                        <span>Offline Payment</span>
                      </div>
                    </label>
                  </div>

                  {(selectedPaymentMethod === 'BANK_TRANSFER' || selectedPaymentMethod === 'OFFLINE') && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Payment Instructions</h4>
                      <p className="text-sm text-gray-600">
                        After selecting this payment method, you will receive detailed instructions on how to complete your payment.
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {paymentStatus.status !== 'idle' && (
                  <div className="space-y-2">
                    {renderStatusContent()}
                    {paymentStatus.details?.enrollmentStatus && (
                      <p className="text-sm bg-gray-50 p-2 rounded-md border">
                        Enrollment Status: {paymentStatus.details.enrollmentStatus}
                      </p>
                    )}
                    {paymentStatus.details?.paymentStatus && (
                      <p className="text-sm bg-gray-50 p-2 rounded-md border">
                        Payment Status: {paymentStatus.details.paymentStatus}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              // Show Stripe payment form
              clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    onSuccess={() => {
                      setIsOpen(false);
                      navigate.reload();
                    }}
                    onCancel={() => {
                      setShowPaymentForm(false);
                      setClientSecret(null);
                      setPaymentStatus({ status: 'idle' });
                    }}
                    amount={enrollmentDetails?.price || amount}
                    courseTitle={courseTitle}
                  />
                </Elements>
              )
            )}
          </div>

          {!showPaymentForm && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isLoading || paymentStatus.status === 'success' || !selectedPaymentMethod || !session}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Payment'
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 