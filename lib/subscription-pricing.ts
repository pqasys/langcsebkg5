/**
 * Single Source of Truth for Subscription Pricing
 * 
 * This file contains all subscription pricing information used across the platform.
 * Any pricing changes should be made here and will automatically propagate to all components.
 */

export interface StudentTier {
  planType: 'BASIC' | 'PREMIUM' | 'PRO';
  name: string;
  description: string;
  price: number;
  annualPrice: number;
  features: string[];
  limits: {
    maxCourses: number;
    maxLanguages: number;
  };
  popular?: boolean;
  trialDays: number;
}

export interface InstitutionTier {
  planType: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  name: string;
  description: string;
  price: number;
  annualPrice: number;
  commissionRate: number;
  features: string[];
  limits: {
    maxStudents: number;
    maxCourses: number;
    maxTeachers: number;
  };
  popular?: boolean;
  trialDays: number;
}

export const STUDENT_TIERS: Record<string, StudentTier> = {
  BASIC: {
    planType: 'BASIC',
    name: 'Basic Plan',
    description: 'Perfect for beginners starting their language journey',
    price: 12.99,
    annualPrice: 129.99,
    features: [
      'Access to 5 languages',
      'Basic video lessons',
      'Progress tracking',
      'Mobile app access',
      'Email support',
      'Basic certificates'
    ],
    limits: {
      maxCourses: 5,
      maxLanguages: 5
    },
    popular: false,
    trialDays: 7
  },
  PREMIUM: {
    planType: 'PREMIUM',
    name: 'Premium Plan',
    description: 'Most popular choice for serious language learners',
    price: 24.99,
    annualPrice: 249.99,
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
      'Study reminders',
      'Video conferencing (limited)'
    ],
    limits: {
      maxCourses: 20,
      maxLanguages: -1 // Unlimited
    },
    popular: true,
    trialDays: 7
  },
  PRO: {
    planType: 'PRO',
    name: 'Pro Plan',
    description: 'Complete language learning experience with personal tutoring',
    price: 49.99,
    annualPrice: 499.99,
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
      'Exclusive content',
      'Video conferencing (unlimited)'
    ],
    limits: {
      maxCourses: -1, // Unlimited
      maxLanguages: -1 // Unlimited
    },
    popular: false,
    trialDays: 7
  }
};

export const INSTITUTION_TIERS: Record<string, InstitutionTier> = {
  STARTER: {
    planType: 'STARTER',
    name: 'Starter Plan',
    description: 'Perfect for small language schools getting started online',
    price: 99,
    annualPrice: 990,
    commissionRate: 25,
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
    limits: {
      maxStudents: 50,
      maxCourses: 5,
      maxTeachers: 2
    },
    popular: false,
    trialDays: 14
  },
  PROFESSIONAL: {
    planType: 'PROFESSIONAL',
    name: 'Professional Plan',
    description: 'Ideal for growing institutions with multiple courses',
    price: 299,
    annualPrice: 2990,
    commissionRate: 15,
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
      'Revenue tracking',
      'Video conferencing (module integration)'
    ],
    limits: {
      maxStudents: 200,
      maxCourses: 15,
      maxTeachers: 5
    },
    popular: true,
    trialDays: 14
  },
  ENTERPRISE: {
    planType: 'ENTERPRISE',
    name: 'Enterprise Plan',
    description: 'Complete solution for large language organizations',
    price: 799,
    annualPrice: 7990,
    commissionRate: 10,
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
      '24/7 priority support',
      'Video conferencing (unlimited)'
    ],
    limits: {
      maxStudents: 1000,
      maxCourses: 50,
      maxTeachers: 20
    },
    popular: false,
    trialDays: 14
  }
};

// Helper functions
export const getStudentTier = (planType: string): StudentTier | null => {
  return STUDENT_TIERS[planType] || null;
};

export const getInstitutionTier = (planType: string): InstitutionTier | null => {
  return INSTITUTION_TIERS[planType] || null;
};

export const getAllStudentTiers = (): StudentTier[] => {
  return Object.values(STUDENT_TIERS);
};

export const getAllInstitutionTiers = (): InstitutionTier[] => {
  return Object.values(INSTITUTION_TIERS);
};

export const getPopularStudentTier = (): StudentTier | null => {
  return Object.values(STUDENT_TIERS).find(tier => tier.popular) || null;
};

export const getPopularInstitutionTier = (): InstitutionTier | null => {
  return Object.values(INSTITUTION_TIERS).find(tier => tier.popular) || null;
};

// Feature integration helpers
export const hasFeature = (planType: string, feature: string, userType: 'STUDENT' | 'INSTITUTION'): boolean => {
  const tiers = userType === 'STUDENT' ? STUDENT_TIERS : INSTITUTION_TIERS;
  const tier = tiers[planType];
  
  if (!tier) return false;
  
  return tier.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
};

// Video conferencing specific helpers
export const getVideoConferencingAccess = (planType: string, userType: 'STUDENT' | 'INSTITUTION'): 'none' | 'limited' | 'unlimited' => {
  if (userType === 'STUDENT') {
    switch (planType) {
      case 'BASIC':
        return 'none';
      case 'PREMIUM':
        return 'limited';
      case 'PRO':
        return 'unlimited';
      default:
        return 'none';
    }
  } else {
    switch (planType) {
      case 'STARTER':
        return 'none';
      case 'PROFESSIONAL':
        return 'limited';
      case 'ENTERPRISE':
        return 'unlimited';
      default:
        return 'none';
    }
  }
};

// Live conversations specific helpers
export const getLiveConversationsAccess = (planType: string): boolean => {
  return planType === 'PREMIUM' || planType === 'PRO';
};

// Community learning specific helpers
export const getCommunityAccess = (planType: string): 'basic' | 'full' | 'exclusive' => {
  switch (planType) {
    case 'BASIC':
      return 'basic';
    case 'PREMIUM':
      return 'full';
    case 'PRO':
      return 'exclusive';
    default:
      return 'basic';
  }
}; 