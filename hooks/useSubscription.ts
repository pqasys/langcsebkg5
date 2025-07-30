'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  currentPlan?: string;
  features: Record<string, any>;
  subscriptionEndDate?: Date;
  canUpgrade: boolean;
  canDowngrade: boolean;
  canCancel: boolean;
  nextBillingDate?: Date;
  billingHistory: BillingHistoryItem[];
  isFallback: boolean;
}

export interface BillingHistoryItem {
  id: string;
  billingDate: Date;
  amount: number;
  currency: string;
  status: string;
  description?: string;
}

export interface InstitutionEnrollment {
  hasInstitutionEnrollment: boolean;
  institutionId?: string;
  institutionName?: string;
  enrollmentStatus?: string;
  enrollmentDate?: Date;
  canAccessInstitutionContent: boolean;
}

export interface UserAccessLevel {
  // Platform access
  hasPlatformSubscription: boolean;
  platformPlan?: string;
  
  // Institution access
  hasInstitutionEnrollment: boolean;
  institutionId?: string;
  institutionName?: string;
  
  // Content access
  canAccessPlatformContent: boolean;
  canAccessInstitutionContent: boolean;
  canAccessLiveClasses: boolean;
  canAccessPremiumFeatures: boolean;
  
  // Feature access
  canUseHDVideo: boolean;
  canUseAdvancedFeatures: boolean;
  canAccessRecordings: boolean;
  canUseBreakoutRooms: boolean;
  
  // User type
  userType: 'FREE' | 'SUBSCRIBER' | 'INSTITUTION_STUDENT' | 'HYBRID' | 'INSTITUTION_STAFF';
}

export function useSubscription() {
  const { data: session, status } = useSession();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [institutionEnrollment, setInstitutionEnrollment] = useState<InstitutionEnrollment | null>(null);
  const [userAccessLevel, setUserAccessLevel] = useState<UserAccessLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      setLoading(false);
      return;
    }

    fetchUserAccessData();
  }, [session, status]);

  const fetchUserAccessData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch subscription data
      const subscriptionEndpoint = session?.user?.role === 'INSTITUTION' 
        ? '/api/institution/subscription'
        : '/api/student/subscription';

      const subscriptionResponse = await fetch(subscriptionEndpoint);
      const subscriptionData = subscriptionResponse.ok 
        ? await subscriptionResponse.json() 
        : null;

      // Fetch institution enrollment data (for students)
      let institutionData = null;
      if (session?.user?.role === 'STUDENT') {
        try {
          const institutionResponse = await fetch('/api/student/institution-enrollment');
          if (institutionResponse.ok) {
            institutionData = await institutionResponse.json();
          }
        } catch (err) {
          console.log('No institution enrollment data available');
        }
      }

      // Set individual states
      setSubscriptionStatus(subscriptionData?.subscriptionStatus || subscriptionData);
      setInstitutionEnrollment(institutionData?.enrollment || null);

      // Calculate user access level
      const accessLevel = calculateUserAccessLevel(
        subscriptionData?.subscriptionStatus || subscriptionData,
        institutionData?.enrollment,
        session?.user
      );
      setUserAccessLevel(accessLevel);

    } catch (err) {
      console.error('Error fetching user access data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user access data');
    } finally {
      setLoading(false);
    }
  };

  const calculateUserAccessLevel = (
    subscription: SubscriptionStatus | null,
    enrollment: InstitutionEnrollment | null,
    user: any
  ): UserAccessLevel => {
    const hasSubscription = subscription?.hasActiveSubscription || false;
    const hasInstitution = enrollment?.hasInstitutionEnrollment || false;
    const isInstitutionStaff = user?.role === 'INSTITUTION';

    // Determine user type
    let userType: UserAccessLevel['userType'] = 'FREE';
    if (isInstitutionStaff) {
      userType = 'INSTITUTION_STAFF';
    } else if (hasSubscription && hasInstitution) {
      userType = 'HYBRID';
    } else if (hasSubscription) {
      userType = 'SUBSCRIBER';
    } else if (hasInstitution) {
      userType = 'INSTITUTION_STUDENT';
    }

    // Calculate access levels
    const canAccessPlatformContent = hasSubscription;
    const canAccessInstitutionContent = hasInstitution || isInstitutionStaff;
    const canAccessLiveClasses = hasSubscription || hasInstitution || isInstitutionStaff;
    const canAccessPremiumFeatures = hasSubscription;

    // Feature access based on subscription
    const canUseHDVideo = hasSubscription;
    const canUseAdvancedFeatures = hasSubscription;
    const canAccessRecordings = hasSubscription;
    const canUseBreakoutRooms = hasSubscription;

    return {
      hasPlatformSubscription: hasSubscription,
      platformPlan: subscription?.currentPlan,
      hasInstitutionEnrollment: hasInstitution,
      institutionId: enrollment?.institutionId,
      institutionName: enrollment?.institutionName,
      canAccessPlatformContent,
      canAccessInstitutionContent,
      canAccessLiveClasses,
      canAccessPremiumFeatures,
      canUseHDVideo,
      canUseAdvancedFeatures,
      canAccessRecordings,
      canUseBreakoutRooms,
      userType
    };
  };

  const refreshUserAccess = () => {
    fetchUserAccessData();
  };

  return {
    // Individual states
    subscriptionStatus,
    institutionEnrollment,
    userAccessLevel,
    
    // Loading and error states
    loading,
    error,
    
    // Refresh function
    refreshUserAccess,
    
    // Convenience getters (backward compatibility)
    hasActiveSubscription: userAccessLevel?.hasPlatformSubscription || false,
    currentPlan: userAccessLevel?.platformPlan,
    features: subscriptionStatus?.features || {},
    isFallback: subscriptionStatus?.isFallback || false,
    
    // New access level getters
    canAccessPlatformContent: userAccessLevel?.canAccessPlatformContent || false,
    canAccessInstitutionContent: userAccessLevel?.canAccessInstitutionContent || false,
    canAccessLiveClasses: userAccessLevel?.canAccessLiveClasses || false,
    canAccessPremiumFeatures: userAccessLevel?.canAccessPremiumFeatures || false,
    userType: userAccessLevel?.userType || 'FREE',
    
    // Feature access
    canUseHDVideo: userAccessLevel?.canUseHDVideo || false,
    canUseAdvancedFeatures: userAccessLevel?.canUseAdvancedFeatures || false,
    canAccessRecordings: userAccessLevel?.canAccessRecordings || false,
    canUseBreakoutRooms: userAccessLevel?.canUseBreakoutRooms || false
  };
} 