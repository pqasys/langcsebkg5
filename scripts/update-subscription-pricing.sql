-- Subscription Pricing Update Script
-- This script standardizes all subscription pricing across the platform
-- Run this after backing up the database

-- Update StudentTier pricing
UPDATE student_tiers SET 
  price = 12.99,
  name = 'Basic Plan',
  description = 'Perfect for beginners starting their language journey',
  features = JSON_OBJECT(
    'maxCourses', 5,
    'maxLanguages', 5,
    'progressTracking', true,
    'emailSupport', true,
    'mobileAccess', true,
    'basicLessons', true,
    'certificates', false,
    'liveConversations', false,
    'aiAssistant', false,
    'offlineAccess', false,
    'personalTutoring', false,
    'customLearningPaths', false,
    'videoConferencing', false
  ),
  maxCourses = 5,
  maxLanguages = 5,
  updatedAt = NOW()
WHERE planType = 'BASIC';

UPDATE student_tiers SET 
  price = 24.99,
  name = 'Premium Plan',
  description = 'Most popular choice for serious language learners',
  features = JSON_OBJECT(
    'maxCourses', 20,
    'maxLanguages', -1,
    'progressTracking', true,
    'prioritySupport', true,
    'liveConversations', true,
    'aiAssistant', true,
    'offlineAccess', true,
    'videoLessons', true,
    'culturalContent', true,
    'certificates', true,
    'basicLessons', true,
    'mobileAccess', true,
    'personalTutoring', false,
    'customLearningPaths', false,
    'videoConferencing', 'limited'
  ),
  maxCourses = 20,
  maxLanguages = -1,
  updatedAt = NOW()
WHERE planType = 'PREMIUM';

UPDATE student_tiers SET 
  price = 49.99,
  name = 'Pro Plan',
  description = 'Complete language learning experience with personal tutoring',
  features = JSON_OBJECT(
    'maxCourses', -1,
    'maxLanguages', -1,
    'progressTracking', true,
    'dedicatedSupport', true,
    'liveConversations', true,
    'aiAssistant', true,
    'offlineAccess', true,
    'videoLessons', true,
    'culturalContent', true,
    'certificates', true,
    'basicLessons', true,
    'mobileAccess', true,
    'personalTutoring', true,
    'customLearningPaths', true,
    'videoConferencing', 'unlimited',
    'groupStudySessions', true,
    'advancedAssessment', true,
    'portfolioBuilding', true,
    'careerGuidance', true,
    'exclusiveContent', true
  ),
  maxCourses = -1,
  maxLanguages = -1,
  updatedAt = NOW()
WHERE planType = 'PRO';

-- Update CommissionTier pricing
UPDATE commission_tiers SET 
  price = 99,
  name = 'Starter Plan',
  description = 'Perfect for small language schools getting started online',
  features = JSON_OBJECT(
    'maxStudents', 50,
    'maxCourses', 5,
    'maxTeachers', 2,
    'basicAnalytics', true,
    'emailSupport', true,
    'courseManagement', true,
    'studentProgress', true,
    'paymentProcessing', true,
    'mobileAccess', true,
    'certificateGeneration', true,
    'advancedAnalytics', false,
    'customBranding', false,
    'prioritySupport', false,
    'marketingTools', false,
    'apiAccess', false,
    'whiteLabel', false,
    'videoConferencing', false
  ),
  maxStudents = 50,
  maxCourses = 5,
  maxTeachers = 2,
  updatedAt = NOW()
WHERE planType = 'STARTER';

UPDATE commission_tiers SET 
  price = 299,
  name = 'Professional Plan',
  description = 'Ideal for growing institutions with multiple courses',
  features = JSON_OBJECT(
    'maxStudents', 200,
    'maxCourses', 15,
    'maxTeachers', 5,
    'basicAnalytics', true,
    'emailSupport', true,
    'courseManagement', true,
    'studentProgress', true,
    'paymentProcessing', true,
    'mobileAccess', true,
    'certificateGeneration', true,
    'advancedAnalytics', true,
    'customBranding', true,
    'prioritySupport', true,
    'marketingTools', true,
    'multiLanguageSupport', true,
    'advancedCertificates', true,
    'studentManagement', true,
    'revenueTracking', true,
    'apiAccess', false,
    'whiteLabel', false,
    'videoConferencing', 'limited'
  ),
  maxStudents = 200,
  maxCourses = 15,
  maxTeachers = 5,
  updatedAt = NOW()
WHERE planType = 'PROFESSIONAL';

UPDATE commission_tiers SET 
  price = 799,
  name = 'Enterprise Plan',
  description = 'Complete solution for large language organizations',
  features = JSON_OBJECT(
    'maxStudents', 1000,
    'maxCourses', 50,
    'maxTeachers', 20,
    'basicAnalytics', true,
    'emailSupport', true,
    'courseManagement', true,
    'studentProgress', true,
    'paymentProcessing', true,
    'mobileAccess', true,
    'certificateGeneration', true,
    'advancedAnalytics', true,
    'customBranding', true,
    'prioritySupport', true,
    'marketingTools', true,
    'multiLanguageSupport', true,
    'advancedCertificates', true,
    'studentManagement', true,
    'revenueTracking', true,
    'apiAccess', true,
    'whiteLabel', true,
    'dedicatedAccountManager', true,
    'customIntegrations', true,
    'advancedSecurity', true,
    'multiLocationSupport', true,
    'customReporting', true,
    'videoConferencing', 'unlimited'
  ),
  maxStudents = 1000,
  maxCourses = 50,
  maxTeachers = 20,
  updatedAt = NOW()
WHERE planType = 'ENTERPRISE';

-- Verify updates
SELECT 'Student Tiers Updated:' as message;
SELECT planType, name, price, maxCourses, maxLanguages FROM student_tiers ORDER BY price;

SELECT 'Institution Tiers Updated:' as message;
SELECT planType, name, price, commissionRate, maxStudents, maxCourses, maxTeachers FROM commission_tiers ORDER BY price; 