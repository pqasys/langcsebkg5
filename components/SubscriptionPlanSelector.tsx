'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Video
} from 'lucide-react';
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

interface SubscriptionPlanSelectorProps {
  userType: 'STUDENT' | 'INSTITUTION';
  selectedPlan: string;
  onPlanSelect: (planId: string) => void;
  isAnnual: boolean;
  onBillingToggle: (isAnnual: boolean) => void;
  onContinue: () => void;
  isLoading?: boolean;
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

export default function SubscriptionPlanSelector({
  userType,
  selectedPlan,
  onPlanSelect,
  isAnnual,
  onBillingToggle,
  onContinue,
  isLoading = false
}: SubscriptionPlanSelectorProps) {
  const plans = userType === 'STUDENT' ? studentPlans : institutionPlans;
  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your {userType === 'STUDENT' ? 'Learning' : 'Business'} Plan
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Start with a free trial and upgrade anytime. All plans include our core features.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex items-center">
          <span className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            !isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
          }`}>
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={onBillingToggle}
            className="mx-2"
          />
          <span className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
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
              selectedPlan === plan.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            onClick={() => onPlanSelect(plan.id)}
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
                  {plan.trialDays}-day free trial
                </p>
              </div>
              {userType === 'INSTITUTION' && plan.commissionRate && (
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
              <span className="font-medium ml-2">{isAnnual ? 'Annual' : 'Monthly'}</span>
            </div>
            <div>
              <span className="text-gray-600">Price:</span>
              <span className="font-medium ml-2">
                ${isAnnual ? selectedPlanData.annualPrice : selectedPlanData.price}/{isAnnual ? 'year' : 'month'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Trial:</span>
              <span className="font-medium ml-2">{selectedPlanData.trialDays} days free</span>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="text-center">
        <Button
          onClick={onContinue}
          disabled={!selectedPlan || isLoading}
          size="lg"
          className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading ? 'Processing...' : 'Continue with Registration'}
        </Button>
        <p className="text-sm text-gray-500 mt-3">
          You can change your plan anytime after registration
        </p>
      </div>
    </div>
  );
} 