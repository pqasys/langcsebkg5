'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Star, Users, BookOpen, Globe, Zap, Shield, Headphones } from 'lucide-react';
import Link from 'next/link';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function PricingPageClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for individual learners getting started',
      price: {
        monthly: 9.99,
        yearly: 99.99
      },
      features: [
        'Access to 100+ basic courses',
        'Mobile app access',
        'Basic progress tracking',
        'Email support',
        'Certificate of completion'
      ],
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Best value for serious language learners',
      price: {
        monthly: 19.99,
        yearly: 199.99
      },
      features: [
        'Everything in Basic',
        'Access to 500+ premium courses',
        'Live tutoring sessions (2/month)',
        'Advanced progress analytics',
        'Priority email support',
        'Offline course downloads',
        'Personalized learning path'
      ],
      popular: true,
      icon: <Star className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'For institutions and advanced learners',
      price: {
        monthly: 49.99,
        yearly: 499.99
      },
      features: [
        'Everything in Premium',
        'Unlimited course access',
        'Unlimited live tutoring',
        'Custom learning plans',
        'API access for integrations',
        'Dedicated account manager',
        'White-label solutions',
        'Advanced reporting'
      ],
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ];

  const features = [
    {
      title: 'Comprehensive Course Library',
      description: 'Access thousands of courses across multiple languages and skill levels',
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: 'Expert Instructors',
      description: 'Learn from certified language teachers and native speakers',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Interactive Learning',
      description: 'Engage with interactive exercises, quizzes, and real-world scenarios',
      icon: <Globe className="h-5 w-5" />
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your learning progress with detailed analytics and insights',
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: 'Mobile Learning',
      description: 'Learn on the go with our mobile-optimized platform',
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: '24/7 Support',
      description: 'Get help whenever you need it with our comprehensive support system',
      icon: <Headphones className="h-5 w-5" />
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setIsLoading(true);
    
    try {
      // Store the selected plan and billing preference
      const planData = {
        planId,
        isYearly,
        price: isYearly ? plans.find(p => p.id === planId)?.price.yearly : plans.find(p => p.id === planId)?.price.monthly
      };
      
      if (typeof window !== 'undefined') {
        // Store in sessionStorage for persistence across navigation
        sessionStorage.setItem('selectedPlan', JSON.stringify(planData));
      }
      
      if (status === 'loading') {
        // Wait for session to load
        return;
      }
      
      if (session) {
        // User is authenticated - redirect to checkout
        router.push(`/checkout?plan=${planId}&billing=${isYearly ? 'yearly' : 'monthly'}`);
      } else {
        // User is not authenticated - redirect to enhanced registration
        router.push(`/auth/register/enhanced?plan=${planId}&billing=${isYearly ? 'yearly' : 'monthly'}`);
      }
    } catch (error) {
      console.error('Error handling plan selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPrice = (plan: PricingPlan) => {
    return isYearly ? plan.price.yearly : plan.price.monthly;
  };

  const getSavings = (plan: PricingPlan) => {
    if (isYearly) {
      const monthlyTotal = plan.price.monthly * 12;
      const yearlyPrice = plan.price.yearly;
      return monthlyTotal - yearlyPrice;
    }
    return 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Learning Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Start your language learning journey with flexible plans designed to fit your needs and budget.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm ${!isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={`text-sm ${isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save up to 17%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-2 border-purple-500 shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className={`${plan.color} text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600">
                {plan.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ${getCurrentPrice(plan)}
                  </span>
                  <span className="text-gray-500">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                </div>
                {getSavings(plan) > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Save ${getSavings(plan)} per year
                  </p>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${plan.popular ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handlePlanSelect(plan.id)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Choose Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the best in language learning with our comprehensive features and expert support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I cancel my subscription anytime?
            </h3>
            <p className="text-gray-600">
              Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Do you offer a free trial?
            </h3>
            <p className="text-gray-600">
              Yes, we offer a 7-day free trial for all plans. No credit card required to start your trial.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Can I switch between plans?
            </h3>
            <p className="text-gray-600">
              Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Is there a money-back guarantee?
            </h3>
            <p className="text-gray-600">
              Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of learners who have already transformed their language skills with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/register">
                Start Free Trial
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 