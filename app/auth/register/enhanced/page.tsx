'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Users, 
  BookOpen, 
  BarChart3, 
  HeadphonesIcon,
  Globe,
  Code,
  Shield,
  TrendingUp,
  Settings,
  Palette,
  Languages,
  Award,
  MessageCircle,
  Sparkles,
  User,
  Video,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Building2
} from 'lucide-react';
import { citiesByCountryAndState } from '@/lib/data/cities';
import { statesByCountry, NO_STATE } from '@/lib/data/states';
import { toast } from 'sonner';
import { getAllStudentTiers, getAllInstitutionTiers } from '@/lib/subscription-pricing';

interface Plan {
  id: string;
  name: string;
  price: number;
  annualPrice: number;
  period: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  trialDays: number;
  commissionRate?: number;
}

// Generate student plans from single source of truth
const generateStudentPlans = (): Plan[] => {
  const studentTiers = getAllStudentTiers();
  return studentTiers.map(tier => ({
    id: tier.planType,
    name: tier.name.replace(' Plan', ''),
    price: tier.price,
    annualPrice: tier.annualPrice,
    period: 'month',
    description: tier.description,
    features: tier.features,
    notIncluded: [], // Will be populated based on tier comparison
    popular: tier.popular || false,
    trialDays: tier.trialDays
  }));
};

const studentPlans = generateStudentPlans();

// Generate institution plans from single source of truth
const generateInstitutionPlans = (): Plan[] => {
  const institutionTiers = getAllInstitutionTiers();
  return institutionTiers.map(tier => ({
    id: tier.planType,
    name: tier.name.replace(' Plan', ''),
    price: tier.price,
    annualPrice: tier.annualPrice,
    period: 'month',
    description: tier.description,
    features: tier.features,
    notIncluded: [], // Will be populated based on tier comparison
    popular: tier.popular || false,
    commissionRate: tier.commissionRate,
    trialDays: tier.trialDays
  }));
};

const institutionPlans = generateInstitutionPlans();

type RegistrationStep = 'userType' | 'accountInfo' | 'subscription' | 'location' | 'complete';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'STUDENT' | 'INSTITUTION';
  description?: string;
  country: string;
  state: string;
  city: string;
  address: string;
  selectedPlan: string;
  isAnnual: boolean;
}

function EnhancedRegistrationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('userType');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    description: '',
    country: '',
    state: '',
    city: '',
    address: '',
    selectedPlan: '',
    isAnnual: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [customState, setCustomState] = useState<string>('');
  const [customCity, setCustomCity] = useState<string>('');

  const COUNTRIES = Object.keys(statesByCountry).sort();

  // Handle pre-selected plan from pricing page
  useEffect(() => {
    const planId = searchParams.get('plan');
    const billing = searchParams.get('billing');
    
    if (planId) {
      // Map pricing page plan IDs to registration plan IDs
      const planMapping: { [key: string]: string } = {
        basic: 'BASIC',
        premium: 'PREMIUM',
        pro: 'PRO'
      };
      
      const mappedPlanId = planMapping[planId];
      if (mappedPlanId) {
        setFormData(prev => ({
          ...prev,
          selectedPlan: mappedPlanId,
          isAnnual: billing === 'yearly'
        }));
        
        // Don't skip steps - user still needs to provide account info
        // setCurrentStep('subscription');
      }
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedState('');
    setSelectedCity('');
    setCustomState('');
    setCustomCity('');
    setFormData(prev => ({
      ...prev,
      country: value,
      state: '',
      city: '',
    }));
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity('');
    setCustomCity('');
    setFormData(prev => ({
      ...prev,
      state: value,
      city: '',
    }));
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setFormData(prev => ({
      ...prev,
      city: value,
    }));
  };

  const handlePlanSelect = (planId: string) => {
    setFormData(prev => ({ ...prev, selectedPlan: planId }));
  };

  const handleBillingToggle = (isAnnual: boolean) => {
    setFormData(prev => ({ ...prev, isAnnual }));
  };

  const nextStep = () => {
    if (currentStep === 'userType') {
      setCurrentStep('accountInfo');
    } else if (currentStep === 'accountInfo') {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        return;
      }
      if (!formData.password) {
        setError('Password is required');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.role === 'INSTITUTION' && !formData.description?.trim()) {
        setError('Institution description is required');
        return;
      }
      setCurrentStep('subscription');
    } else if (currentStep === 'subscription') {
      if (!formData.selectedPlan) {
        setError('Please select a subscription plan');
        return;
      }
      if (formData.role === 'INSTITUTION') {
        setCurrentStep('location');
      } else {
        setCurrentStep('complete');
      }
    } else if (currentStep === 'location') {
      setCurrentStep('complete');
    }
    setError(null);
  };

  const prevStep = () => {
    if (currentStep === 'accountInfo') {
      setCurrentStep('userType');
    } else if (currentStep === 'subscription') {
      setCurrentStep('accountInfo');
    } else if (currentStep === 'location') {
      setCurrentStep('subscription');
    } else if (currentStep === 'complete') {
      setCurrentStep(formData.role === 'INSTITUTION' ? 'location' : 'subscription');
    }
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Final validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    if (!formData.selectedPlan) {
      setError('Please select a subscription plan');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        description: formData.description?.trim(),
        country: selectedCountry,
        state: hasStateData ? selectedState : customState,
        city: hasStateData ? selectedCity : customCity,
        address: formData.address,
        subscriptionPlan: formData.selectedPlan,
        billingCycle: formData.isAnnual ? 'ANNUAL' : 'MONTHLY',
        startTrial: true
      };

      const endpoint = formData.role === 'INSTITUTION' 
        ? '/api/auth/register/institution' 
        : '/api/auth/register';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const hasStateData = selectedCountry && statesByCountry[selectedCountry]?.[0] !== NO_STATE;
  const plans = formData.role === 'STUDENT' ? studentPlans : institutionPlans;
  const selectedPlanData = plans.find(plan => plan.id === formData.selectedPlan);

  const renderUserTypeStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Account Type</h2>
        <p className="text-lg text-gray-600">Select the type of account you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            formData.role === 'STUDENT' ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-1 hover:ring-gray-300'
          }`}
          onClick={() => setFormData(prev => ({ ...prev, role: 'STUDENT' }))}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Student</h3>
            <p className="text-gray-600">I want to learn languages and take courses</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Access to language courses</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Progress tracking</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Practice tests and quizzes</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Mobile app access</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            formData.role === 'INSTITUTION' ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:ring-1 hover:ring-gray-300'
          }`}
          onClick={() => setFormData(prev => ({ ...prev, role: 'INSTITUTION' }))}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Building2 className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Educational Institution</h3>
            <p className="text-gray-600">I want to offer courses and manage students</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Course management</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Student management</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Payment processing</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-700">Analytics and reporting</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAccountInfoStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Account</h2>
        <p className="text-lg text-gray-600">Enter your basic information to get started</p>
      </div>
      
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {formData.role === 'STUDENT' ? 'Full Name' : 'Institution Name'}
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder={formData.role === 'STUDENT' ? 'Enter your full name' : 'Enter institution name'}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
            />
          </div>

          {formData.role === 'INSTITUTION' && (
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Institution Description
              </label>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your institution"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSubscriptionStep = () => (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your {formData.role === 'STUDENT' ? 'Learning' : 'Business'} Plan
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Start with a free trial and upgrade anytime. All plans include our core features.
        </p>
        {searchParams.get('plan') && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              ✓ Plan pre-selected from pricing page
            </p>
          </div>
        )}
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex items-center">
          <span className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            !formData.isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
          }`}>
            Monthly
          </span>
          <Switch
            checked={formData.isAnnual}
            onCheckedChange={handleBillingToggle}
            className="mx-2"
          />
          <span className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            formData.isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
          }`}>
            Annual
            <span className="ml-1 text-green-600 font-semibold">(Save 20%)</span>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              formData.selectedPlan === plan.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                {plan.id === 'BASIC' || plan.id === 'STARTER' ? (
                  <Star className="w-8 h-8 text-blue-600" />
                ) : plan.id === 'PREMIUM' || plan.id === 'PROFESSIONAL' ? (
                  <Zap className="w-8 h-8 text-purple-600" />
                ) : (
                  <Crown className="w-8 h-8 text-yellow-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${formData.isAnnual ? plan.annualPrice : plan.price}
                </span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {formData.isAnnual && (
                  <span className="text-green-600 font-medium">
                    ${(plan.annualPrice / 12).toFixed(0)}/month equivalent
                  </span>
                )}
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">
                  {plan.trialDays}-day free trial
                </p>
              </div>
              {formData.role === 'INSTITUTION' && plan.commissionRate && (
                <div className="mt-3 bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium">
                    {plan.commissionRate}% commission rate
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What's included:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.notIncluded && plan.notIncluded.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900">Not included:</h4>
                  {plan.notIncluded.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0">×</div>
                      <span className="text-sm text-gray-500">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Plan Summary */}
      {selectedPlanData && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Selected Plan Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium ml-2">{selectedPlanData.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Billing:</span>
              <span className="font-medium ml-2">{formData.isAnnual ? 'Annual' : 'Monthly'}</span>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <span className="font-medium ml-2">
                ${formData.isAnnual ? selectedPlanData.annualPrice : selectedPlanData.price}/{formData.isAnnual ? 'year' : 'month'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Trial:</span>
              <span className="font-medium ml-2">{selectedPlanData.trialDays} days free</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLocationStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Institution Location</h2>
        <p className="text-lg text-gray-600">Tell us where your institution is located</p>
      </div>
      
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              id="country"
              name="country"
              required
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {hasStateData ? (
            <>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a state</option>
                  {selectedCountry && statesByCountry[selectedCountry]
                    ?.sort((a, b) => a.localeCompare(b))
                    ?.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a city</option>
                  {selectedState && citiesByCountryAndState[selectedCountry]?.[selectedState]
                    ?.sort((a, b) => a.localeCompare(b))
                    ?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  required
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  disabled={!selectedCountry}
                  placeholder="Enter state/province"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  disabled={!selectedCountry}
                  placeholder="Enter city"
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              id="address"
              name="address"
              type="text"
              required
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Review Your Registration</h2>
        <p className="text-lg text-gray-600">Please review your information before completing registration</p>
      </div>
      
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium ml-2">{formData.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium ml-2">{formData.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium ml-2">{formData.role}</span>
                </div>
                {formData.description && (
                  <div>
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium ml-2">{formData.description}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Subscription Plan</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium ml-2">{selectedPlanData?.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Billing:</span>
                  <span className="font-medium ml-2">{formData.isAnnual ? 'Annual' : 'Monthly'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium ml-2">
                    ${formData.isAnnual ? selectedPlanData?.annualPrice : selectedPlanData?.price}/{formData.isAnnual ? 'year' : 'month'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Trial:</span>
                  <span className="font-medium ml-2">{selectedPlanData?.trialDays} days free</span>
                </div>
              </div>
            </div>
          </div>

          {formData.role === 'INSTITUTION' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Location Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium ml-2">{selectedCountry}</span>
                </div>
                <div>
                  <span className="text-gray-600">State/Province:</span>
                  <span className="font-medium ml-2">{hasStateData ? selectedState : customState}</span>
                </div>
                <div>
                  <span className="text-gray-600">City:</span>
                  <span className="font-medium ml-2">{hasStateData ? selectedCity : customCity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium ml-2">{formData.address}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You'll start with a {selectedPlanData?.trialDays}-day free trial. 
              You can cancel anytime during the trial period without being charged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'userType':
        return renderUserTypeStep();
      case 'accountInfo':
        return renderAccountInfoStep();
      case 'subscription':
        return renderSubscriptionStep();
      case 'location':
        return renderLocationStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderUserTypeStep();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'userType':
        return 'Choose Account Type';
      case 'accountInfo':
        return 'Account Information';
      case 'subscription':
        return 'Select Plan';
      case 'location':
        return 'Location Details';
      case 'complete':
        return 'Review & Complete';
      default:
        return 'Registration';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'userType':
        return formData.role;
      case 'accountInfo':
        return formData.name && formData.email && formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword &&
               (formData.role === 'STUDENT' || formData.description);
      case 'subscription':
        return formData.selectedPlan;
      case 'location':
        return selectedCountry && 
               (hasStateData ? (selectedState && selectedCity) : (customState && customCity)) &&
               formData.address;
      case 'complete':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-lg text-gray-600">Join thousands of learners and educators worldwide</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['userType', 'accountInfo', 'subscription', 'location', 'complete'].map((step, index) => {
              const stepIndex = ['userType', 'accountInfo', 'subscription', 'location', 'complete'].indexOf(step);
              const currentIndex = ['userType', 'accountInfo', 'subscription', 'location', 'complete'].indexOf(currentStep);
              const isCompleted = stepIndex < currentIndex;
              const isCurrent = step === currentStep;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between max-w-2xl mx-auto mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 'userType'}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === 'complete' ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedRegistrationPage() {
  return (
    <Suspense fallback={<div>Loading registration form...</div>}>
      <EnhancedRegistrationContent />
    </Suspense>
  );
} 