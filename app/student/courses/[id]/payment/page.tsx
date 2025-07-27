'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '@/components/student/PaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set - Context: throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KE...`);
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    const fetchPaymentData = async () => {
      try {
        const response = await fetch(`/api/student/courses/${params.id}/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to create payment intent - Context: 'Content-Type': 'application/json',...`);
        }

        const data = await response.json();
        setPaymentData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [session, status, params.id, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">Loading payment form...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">Error: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentData) {
    return null;
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium">Course Details</h3>
            <p className="text-sm text-muted-foreground">
              {paymentData.courseTitle}
            </p>
            <p className="text-lg font-semibold mt-2">
              ${paymentData.amount.toFixed(2)}
            </p>
          </div>

          <Suspense fallback={<div>Loading payment form...</div>}>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: paymentData.clientSecret,
                appearance: {
                  theme: 'stripe',
                },
              }}
            >
              <PaymentForm
                clientSecret={paymentData.clientSecret}
                onSuccess={() => {
                  router.push(`/student/courses/${params.id}`);
                }}
                onCancel={() => {
                  router.push(`/student/courses/${params.id}`);
                }}
              />
            </Elements>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
} 