'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Crown, Star, Zap } from 'lucide-react';
import StudentSubscriptionCard from '@/components/student/StudentSubscriptionCard';

export default function StudentSubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
    setLoading(false);
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 text-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Subscription Management</h1>
            <p className="text-muted-foreground">
              Manage your learning subscription and billing
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Student Account
          </Badge>
        </div>
      </div>

      {/* Subscription Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <Zap className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-lg">Basic Plan</CardTitle>
            <div className="text-2xl font-bold text-green-600">$12.99<span className="text-sm font-normal text-gray-600">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Up to 5 courses</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>10 practice tests</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Progress tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Email support</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-600 text-white">Most Popular</Badge>
          </div>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <Star className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Premium Plan</CardTitle>
            <div className="text-2xl font-bold text-blue-600">$24.99<span className="text-sm font-normal text-gray-600">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Up to 20 courses</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>50 practice tests</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Progress tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Offline access</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Certificate download</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <Crown className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-lg">Pro Plan</CardTitle>
            <div className="text-2xl font-bold text-yellow-600">$49.99<span className="text-sm font-normal text-gray-600">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <span>Unlimited courses</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <span>Unlimited practice tests</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <span>Progress tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <span>Offline access</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <span>Certificate download</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <span>Personalized learning</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <span>One-on-one tutoring</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      <StudentSubscriptionCard />
    </div>
  );
}

// Helper component for checkmarks
function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
} 