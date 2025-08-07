-- Migration: Simplify Course Classification
-- Description: Remove redundant fields and add marketing fields for better course classification
-- Date: January 2024

-- Step 1: Add marketing fields
ALTER TABLE course ADD COLUMN marketingType VARCHAR(50) DEFAULT 'SELF_PACED';
ALTER TABLE course ADD COLUMN marketingDescription TEXT;

-- Step 2: Update marketing fields based on current classification
UPDATE course 
SET marketingType = CASE 
    WHEN hasLiveClasses = true AND isPlatformCourse = true THEN 'LIVE_ONLINE'
    WHEN hasLiveClasses = true AND isPlatformCourse = false THEN 'LIVE_ONLINE'
    WHEN hasLiveClasses = false AND isPlatformCourse = true THEN 'SELF_PACED'
    ELSE 'SELF_PACED'
END,
marketingDescription = CONCAT(title, ' - ', 
    CASE 
        WHEN hasLiveClasses = true AND isPlatformCourse = true THEN 'Live interactive sessions with global participants'
        WHEN hasLiveClasses = true AND isPlatformCourse = false THEN 'Interactive live sessions'
        WHEN hasLiveClasses = false AND isPlatformCourse = true THEN 'Self-paced learning with platform resources'
        ELSE 'Self-paced learning'
    END
);

-- Step 3: Remove redundant fields (commented out for safety - uncomment after testing)
-- ALTER TABLE course DROP COLUMN courseType;
-- ALTER TABLE course DROP COLUMN deliveryMode;
-- ALTER TABLE course DROP COLUMN enrollmentType;

-- Step 4: Add indexes for new fields
CREATE INDEX idx_course_has_live_classes ON course(hasLiveClasses);
CREATE INDEX idx_course_marketing_type ON course(marketingType);

-- Step 5: Verify the migration
SELECT 
    COUNT(*) as total_courses,
    SUM(CASE WHEN hasLiveClasses = true THEN 1 ELSE 0 END) as live_class_courses,
    SUM(CASE WHEN isPlatformCourse = true THEN 1 ELSE 0 END) as platform_courses,
    SUM(CASE WHEN requiresSubscription = true THEN 1 ELSE 0 END) as subscription_courses,
    COUNT(DISTINCT marketingType) as marketing_types
FROM course;
