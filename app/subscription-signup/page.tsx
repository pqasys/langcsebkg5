'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  FaCheck, 
  FaTimes, 
  FaStar, 
  FaUsers, 
  FaGraduationCap,
  FaShieldAlt,
  FaHeadphones,
  FaVideo,
  FaCertificate,
  FaMobile,
  FaBrain,
  FaChartLine,
  FaClock,
  FaDownload,
  FaArrowRight,
  FaCreditCard,
  FaLock,
  FaSpinner
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SubscriptionPaymentForm } from '@/components/SubscriptionPaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface Plan {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  period: string;
  description: string;
  features: string[];
  notIncluded: string[];
  popular: boolean;
  commissionRate?: number;
  trialDays: number;
}

const studentPlans: Plan[] = [
  {
    id: 'BASIC',
    name: 'Basic',
    price: 12.99,
    annualPrice: 129.99,
    period: 'month',
    description: 'Perfect for beginners starting their language journey',
    features: [
      'Access to 5 languages',
      'Basic video lessons',
      'Progress tracking',
      'Mobile app access',
      'Email support',
      'Basic certificates'
    ],
    notIncluded: [
      'Live conversation practice',
      'AI-powered recommendations',
      'Advanced analytics',
      'Priority support',
      'Offline downloads',
      'Premium content'
    ],
    popular: false,
    trialDays: 7
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: 24.99,
    annualPrice: 249.99,
    period: 'month',
    description: 'Most popular choice for serious language learners',
    features: [
      'Access to all 15+ languages',
      'HD video lessons',
      'Live conversation practice',
      'AI-powered adaptive learning',
      'Advanced progress analytics',
      'Priority support',
      'Offline downloads',
      'Premium certificates',
      'Cultural content',
      'Study reminders'
    ],
    notIncluded: [
      'One-on-one tutoring',
      'Custom learning paths',
      'Group study sessions'
    ],
    popular: true,
    trialDays: 7
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 49.99,
    annualPrice: 499.99,
    period: 'month',
    description: 'Complete language learning experience with personal tutoring',
    features: [
      'Everything in Premium',
      'One-on-one tutoring sessions',
      'Custom learning paths',
      'Group study sessions',
      'Personal learning coach',
      'Advanced assessment tools',
      'Portfolio building',
      'Career guidance',
      '24/7 support',
      'Exclusive content'
    ],
    notIncluded: [],
    popular: false,
    trialDays: 7
  }
];

const institutionPlans: Plan[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 99,
    annualPrice: 990,
    period: 'month',
    description: 'Perfect for small language schools getting started online',
    features: [
      'Up to 100 students',
      'Basic course management',
      'Student progress tracking',
      'Payment processing',
      'Email support',
      'Basic analytics',
      'Mobile app access',
      'Certificate generation'
    ],
    notIncluded: [
      'Advanced analytics',
      'Marketing tools',
      'Priority support',
      'Custom branding',
      'API access',
      'White-label options'
    ],
    popular: false,
    commissionRate: 25,
    trialDays: 14
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: 299,
    annualPrice: 2990,
    period: 'month',
    description: 'Ideal for growing institutions with multiple courses',
    features: [
      'Up to 500 students',
      'Advanced course management',
      'Comprehensive analytics',
      'Marketing tools',
      'Priority support',
      'Custom branding',
      'Multi-language support',
      'Advanced certificates',
      'Student management tools',
      'Revenue tracking'
    ],
    notIncluded: [
      'Unlimited students',
      'API access',
      'White-label platform',
      'Dedicated account manager'
    ],
    popular: true,
    commissionRate: 15,
    trialDays: 14
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 999,
    annualPrice: 9990,
    period: 'month',
    description: 'For large institutions with unlimited growth potential',
    features: [
      'Unlimited students',
      'Full platform customization',
      'API access',
      'White-label platform',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced security',
      'Multi-location support',
      'Custom reporting',
      '24/7 priority support'
    ],
    notIncluded: [],
    popular: false,
    commissionRate: 10,
    trialDays: 14
  }
];

  // Initialize Stripe
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscriptionSignupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isInstitution, setIsInstitution] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Handle URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      const plan = urlParams.get('plan');
      const billing = urlParams.get('billing');

      if (type === 'institution') {
        setIsInstitution(true);
      }
      if (billing === 'annual') {
        setIsAnnual(true);
      }
      if (plan) {
        setSelectedPlan(plan);
        setShowPaymentForm(true);
      }
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/subscription-signup');
    }
  }, [status]);

  const currentPlans = isInstitution ? institutionPlans : studentPlans;

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentForm(true);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !session?.user?.id) {
      toast.error('Please select a plan and ensure you are logged in');
      return;
    }

    setIsProcessing(true);
    try {
      const plan = currentPlans.find(p => p.id === selectedPlan);
      if (!plan) {
        throw new Error(`Selected plan not found - Context: Selected plan not found - Context: const plan = currentPlans.find(p => p.id === selec`);
      }

      const billingCycle = isAnnual ? 'ANNUAL' : 'MONTHLY';
      const amount = isAnnual ? plan.annualPrice : plan.price;

      // Create payment intent
      const response = await fetch(`/api/${isInstitution ? 'institution' : 'student'}/subscription/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: selectedPlan,
          billingCycle,
          startTrial: true
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setShowPaymentModal(true);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Payment intent error:');
      toast.error(error instanceof Error ? error.message : 'Failed to create payment intent');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: unknown) => {
    try {
      const plan = currentPlans.find(p => p.id === selectedPlan);
      if (!plan) {
        throw new Error('Selected plan not found');
      }

      setShowPaymentModal(false);
      
      // Redirect to appropriate dashboard
      if (isInstitution) {
        router.push('/institution/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Payment success error:');
      toast.error(error instanceof Error ? error.message : 'Failed to process payment success');
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    setShowPaymentModal(false);
  };

  const getSelectedPlan = () => currentPlans.find(p => p.id === selectedPlan);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Start your language learning journey or grow your institution with our flexible subscription plans.
          </p>
          
          {/* Toggle for Student/Institution */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex">
              <button
                onClick={() => {
                  setIsInstitution(false);
                  setSelectedPlan('');
                  setShowPaymentForm(false);
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isInstitution 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <FaUsers className="w-4 h-4 inline mr-2" />
                For Students
              </button>
              <button
                onClick={() => {
                  setIsInstitution(true);
                  setSelectedPlan('');
                  setShowPaymentForm(false);
                }}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isInstitution 
                    ? 'bg-white text-blue-600' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <FaGraduationCap className="w-4 h-4 inline mr-2" />
                For Institutions
              </button>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className="text-blue-100">Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-blue-500"
            />
            <span className="text-blue-100">Annual</span>
            {isAnnual && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 transition-all duration-300 cursor-pointer ${
                  selectedPlan === plan.id 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : plan.popular 
                      ? 'border-purple-300 shadow-lg hover:shadow-xl' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => handlePlanSelection(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      <FaStar className="w-4 h-4 inline mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                {plan.commissionRate && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {plan.commissionRate}% Commission
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isAnnual ? plan.annualPrice : plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {isAnnual && (
                      <span className="text-green-600 font-medium">
                        ${(plan.annualPrice / 12).toFixed(0)}/month equivalent
                      </span>
                    )}
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium">
                      <FaClock className="w-4 h-4 inline mr-1" />
                      {plan.trialDays}-day free trial
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <FaCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.notIncluded.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Not included:</h4>
                      <ul className="space-y-3">
                        {plan.notIncluded.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <FaTimes className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-500 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    className={`w-full py-3 text-lg font-semibold ${
                      selectedPlan === plan.id
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                          : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelection(plan.id);
                    }}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                    <FaArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Section */}
      {showPaymentForm && selectedPlan && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardHeader>
                <h2 className="text-2xl font-bold text-gray-900">Complete Your Subscription</h2>
                <p className="text-gray-600">You're just one step away from starting your {getSelectedPlan()?.trialDays}-day free trial!</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Summary */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Plan Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Selected Plan:</span>
                      <span className="font-medium ml-2">{getSelectedPlan()?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="font-medium ml-2">{isAnnual ? 'Annual' : 'Monthly'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium ml-2">
                        ${isAnnual ? getSelectedPlan()?.annualPrice : getSelectedPlan()?.price}/{isAnnual ? 'year' : 'month'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trial Period:</span>
                      <span className="font-medium ml-2">{getSelectedPlan()?.trialDays} days free</span>
                    </div>
                    {getSelectedPlan()?.commissionRate && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Commission Rate:</span>
                        <span className="font-medium ml-2">{getSelectedPlan()?.commissionRate}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FaLock className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-900">Secure Payment</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-4">
                    Your payment information is encrypted and secure. You won't be charged until after your {getSelectedPlan()?.trialDays}-day free trial ends.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-green-700">
                    <FaCreditCard className="w-4 h-4" />
                    <span>We accept all major credit cards</span>
                    <FaShieldAlt className="w-4 h-4" />
                    <span>PCI DSS compliant</span>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="text-sm text-gray-600">
                  <p>
                    By clicking "Start Free Trial", you agree to our{' '}
                    <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                    Your subscription will automatically renew after the trial period unless cancelled.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedPlan('');
                    }}
                    className="flex-1"
                  >
                    Back to Plans
                  </Button>
                  <Button 
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Start Free Trial
                        <FaArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does the free trial work?
              </h3>
              <p className="text-gray-600">
                All plans come with a free trial period ({isInstitution ? '14' : '7'} days for {isInstitution ? 'institutions' : 'students'}). 
                You can cancel anytime during the trial without being charged. Your subscription will automatically start after the trial period.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time from your account settings. 
                Changes will be reflected in your next billing cycle with prorated charges or credits.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. 
                All payments are processed securely with PCI DSS compliance.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time from your account settings. 
                You'll continue to have access until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && getSelectedPlan() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Complete Your Trial Signup</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>No charges during trial:</strong> Your card will be authorized but not charged until after your{' '}
                  {getSelectedPlan()?.trialDays}-day free trial ends.
                </p>
              </div>

              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                    },
                  }}
                >
                  <SubscriptionPaymentForm
                    clientSecret={clientSecret}
                    amount={isAnnual ? getSelectedPlan()!.annualPrice : getSelectedPlan()!.price}
                    currency="USD"
                    planName={getSelectedPlan()!.name}
                    isTrial={true}
                    trialDays={getSelectedPlan()!.trialDays}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    isLoading={isProcessing}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 