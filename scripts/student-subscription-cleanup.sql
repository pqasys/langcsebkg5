-- Student Subscription Complete Rewrite - Database Cleanup & Setup
-- Phase 1-2: Check current data and perform cleanup

USE langcsebkg4a;

-- Step 1: Check current data counts
SELECT 'Current Data Counts' as info;
SELECT COUNT(*) as student_subscriptions FROM student_subscriptions;
SELECT COUNT(*) as student_billing_history FROM student_billing_history;
SELECT COUNT(*) as subscription_logs FROM subscription_logs WHERE subscriptionId IN (SELECT id FROM student_subscriptions);

-- Step 2: Clear all test subscription data
SELECT 'Clearing test data...' as info;

-- Delete subscription logs first (foreign key constraint)
DELETE FROM subscription_logs 
WHERE subscriptionId IN (SELECT id FROM student_subscriptions);

-- Delete billing history
DELETE FROM student_billing_history 
WHERE subscriptionId IN (SELECT id FROM student_subscriptions);

-- Delete subscriptions
DELETE FROM student_subscriptions;

-- Step 3: Create standard StudentTier records
SELECT 'Creating StudentTier records...' as info;

INSERT INTO student_tiers (id, planType, name, description, price, currency, billingCycle, features, maxCourses, maxLanguages, isActive, createdAt, updatedAt) VALUES
('basic-monthly', 'BASIC', 'Basic Plan (Monthly)', 'Basic student subscription with monthly billing', 12.99, 'USD', 'MONTHLY', '{"courses": 5, "languages": 3, "practiceTests": 10, "progressTracking": true, "support": "email"}', 5, 3, true, NOW(), NOW()),
('basic-annual', 'BASIC', 'Basic Plan (Annual)', 'Basic student subscription with annual billing', 129.99, 'USD', 'ANNUAL', '{"courses": 5, "languages": 3, "practiceTests": 10, "progressTracking": true, "support": "email"}', 5, 3, true, NOW(), NOW()),
('premium-monthly', 'PREMIUM', 'Premium Plan (Monthly)', 'Premium student subscription with monthly billing', 24.99, 'USD', 'MONTHLY', '{"courses": 20, "languages": 8, "practiceTests": 50, "progressTracking": true, "support": "priority", "offlineAccess": true, "certificateDownload": true}', 20, 8, true, NOW(), NOW()),
('premium-annual', 'PREMIUM', 'Premium Plan (Annual)', 'Premium student subscription with annual billing', 249.99, 'USD', 'ANNUAL', '{"courses": 20, "languages": 8, "practiceTests": 50, "progressTracking": true, "support": "priority", "offlineAccess": true, "certificateDownload": true}', 20, 8, true, NOW(), NOW()),
('pro-monthly', 'PRO', 'Pro Plan (Monthly)', 'Pro student subscription with monthly billing', 49.99, 'USD', 'MONTHLY', '{"courses": -1, "languages": -1, "practiceTests": -1, "progressTracking": true, "support": "24/7", "offlineAccess": true, "certificateDownload": true, "personalTutoring": true, "customLearningPaths": true}', -1, -1, true, NOW(), NOW()),
('pro-annual', 'PRO', 'Pro Plan (Annual)', 'Pro student subscription with annual billing', 499.99, 'USD', 'ANNUAL', '{"courses": -1, "languages": -1, "practiceTests": -1, "progressTracking": true, "support": "24/7", "offlineAccess": true, "certificateDownload": true, "personalTutoring": true, "customLearningPaths": true}', -1, -1, true, NOW(), NOW());

-- Step 4: Verify setup
SELECT 'Verification - StudentTier records created:' as info;
SELECT planType, billingCycle, price, isActive FROM student_tiers ORDER BY planType, billingCycle;

SELECT 'Verification - All test data cleared:' as info;
SELECT COUNT(*) as remaining_student_subscriptions FROM student_subscriptions;
SELECT COUNT(*) as remaining_student_billing_history FROM student_billing_history;
SELECT COUNT(*) as remaining_subscription_logs FROM subscription_logs WHERE subscriptionId IN (SELECT id FROM student_subscriptions);

SELECT 'Database cleanup and setup completed successfully!' as status; 