'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, Video, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TrialStatus {
  eligible: boolean;
  active: boolean;
  endDate?: string;
  remainingDays?: number;
  remainingSeats?: number;
}

export default function TrialPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [trial, setTrial] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/subscription/trial/status', { cache: 'no-store' });
      const data = await res.json();
      setTrial(data);
    } catch (e) {
      toast.error('Failed to load trial status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'loading') fetchStatus();
  }, [status]);

  const startTrial = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/subscription/trial/start', { method: 'POST' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Unable to start trial');
        return;
      }
      toast.success('Your free trial is active');
      await fetchStatus();
      router.push('/features/live-classes');
    } catch (e) {
      toast.error('Failed to start trial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Try a Live Class for Free</h1>
          <p className="text-gray-600">One session. No card required. Real instructor-led experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center space-y-2">
              <Video className="w-6 h-6 mx-auto text-blue-600" />
              <div className="font-semibold">1 Live Session</div>
              <div className="text-sm text-gray-500">Up to 45 minutes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-2">
              <Clock className="w-6 h-6 mx-auto text-amber-600" />
              <div className="font-semibold">7-day window</div>
              <div className="text-sm text-gray-500">Use anytime within 7 days</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-2">
              <ShieldCheck className="w-6 h-6 mx-auto text-green-600" />
              <div className="font-semibold">No recordings</div>
              <div className="text-sm text-gray-500">Privacy-first, no replay access</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Free Trial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              One session, limited seats, fair use applies
            </div>
            {trial?.active && (
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Trial Active</Badge>
                <div className="text-sm text-gray-600">
                  {trial.remainingSeats} seat left • {trial.remainingDays} days remaining
                </div>
              </div>
            )}
            <div className="flex gap-2">
              {session ? (
                trial?.active ? (
                  <Button onClick={() => router.push('/features/live-classes')} disabled={loading}>
                    Join a Live Class
                  </Button>
                ) : (
                  <Button onClick={startTrial} disabled={loading || trial?.eligible === false}>
                    Start Free Trial
                  </Button>
                )
              ) : (
                <Button onClick={() => router.push('/auth/signin')}>Sign in to Start</Button>
              )}
              <Button variant="outline" onClick={() => router.push('/pricing')}>View Plans</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


