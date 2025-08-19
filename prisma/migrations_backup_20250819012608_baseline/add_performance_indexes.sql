-- Performance Optimization Indexes Migration
-- This migration adds indexes for frequently queried fields to improve performance

-- Course table indexes
CREATE INDEX idx_course_status ON Course(status);
CREATE INDEX idx_course_institution_id ON Course(institutionId);
CREATE INDEX idx_course_category_id ON Course(categoryId);
CREATE INDEX idx_course_created_at ON Course(createdAt);
CREATE INDEX idx_course_updated_at ON Course(updatedAt);
CREATE INDEX idx_course_status_institution ON Course(status, institutionId);
CREATE INDEX idx_course_status_category ON Course(status, categoryId);
CREATE INDEX idx_course_institution_status ON Course(institutionId, status);

-- Institution table indexes
CREATE INDEX idx_institution_status ON Institution(status);
CREATE INDEX idx_institution_is_featured ON Institution(isFeatured);
CREATE INDEX idx_institution_commission_rate ON Institution(commissionRate);
CREATE INDEX idx_institution_created_at ON Institution(createdAt);
CREATE INDEX idx_institution_updated_at ON Institution(updatedAt);
CREATE INDEX idx_institution_status_featured ON Institution(status, isFeatured);
CREATE INDEX idx_institution_country_city ON Institution(country, city);

-- User table indexes
CREATE INDEX idx_user_status ON User(status);
CREATE INDEX idx_user_role ON User(role);
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_created_at ON User(createdAt);
CREATE INDEX idx_user_updated_at ON User(updatedAt);
CREATE INDEX idx_user_status_role ON User(status, role);

-- StudentCourseEnrollment table indexes
CREATE INDEX idx_enrollment_course_id ON StudentCourseEnrollment(courseId);
CREATE INDEX idx_enrollment_student_id ON StudentCourseEnrollment(studentId);
CREATE INDEX idx_enrollment_status ON StudentCourseEnrollment(status);
CREATE INDEX idx_enrollment_enrolled_at ON StudentCourseEnrollment(enrolledAt);
CREATE INDEX idx_enrollment_course_status ON StudentCourseEnrollment(courseId, status);
CREATE INDEX idx_enrollment_student_status ON StudentCourseEnrollment(studentId, status);

-- StudentCourseCompletion table indexes
CREATE INDEX idx_completion_course_id ON StudentCourseCompletion(courseId);
CREATE INDEX idx_completion_student_id ON StudentCourseCompletion(studentId);
CREATE INDEX idx_completion_completed_at ON StudentCourseCompletion(completedAt);
CREATE INDEX idx_completion_course_student ON StudentCourseCompletion(courseId, studentId);

-- Payment table indexes
CREATE INDEX idx_payment_status ON Payment(status);
CREATE INDEX idx_payment_user_id ON Payment(userId);
CREATE INDEX idx_payment_course_id ON Payment(courseId);
CREATE INDEX idx_payment_created_at ON Payment(createdAt);
CREATE INDEX idx_payment_status_created ON Payment(status, createdAt);
CREATE INDEX idx_payment_user_status ON Payment(userId, status);

-- CourseTag table indexes
CREATE INDEX idx_course_tag_course_id ON CourseTag(courseId);
CREATE INDEX idx_course_tag_tag_id ON CourseTag(tagId);
CREATE INDEX idx_course_tag_course_tag ON CourseTag(courseId, tagId);

-- Tag table indexes
CREATE INDEX idx_tag_name ON Tag(name);
CREATE INDEX idx_tag_category_id ON Tag(categoryId);

-- Category table indexes
CREATE INDEX idx_category_name ON Category(name);
CREATE INDEX idx_category_parent_id ON Category(parentId);

-- InstitutionSubscription table indexes
CREATE INDEX idx_institution_subscription_institution_id ON InstitutionSubscription(institutionId);
CREATE INDEX idx_institution_subscription_status ON InstitutionSubscription(status);
CREATE INDEX idx_institution_subscription_commission_tier_id ON InstitutionSubscription(commissionTierId);
CREATE INDEX idx_institution_subscription_start_date ON InstitutionSubscription(startDate);
CREATE INDEX idx_institution_subscription_end_date ON InstitutionSubscription(endDate);
CREATE INDEX idx_institution_subscription_status_date ON InstitutionSubscription(status, startDate);

-- CommissionTier table indexes
CREATE INDEX idx_commission_tier_plan_type ON CommissionTier(planType);
CREATE INDEX idx_commission_tier_is_active ON CommissionTier(isActive);
CREATE INDEX idx_commission_tier_commission_rate ON CommissionTier(commissionRate);

-- StudentSubscription table indexes
CREATE INDEX idx_student_subscription_student_id ON StudentSubscription(studentId);
CREATE INDEX idx_student_subscription_status ON StudentSubscription(status);
CREATE INDEX idx_student_subscription_plan_type ON StudentSubscription(planType);
CREATE INDEX idx_student_subscription_start_date ON StudentSubscription(startDate);
CREATE INDEX idx_student_subscription_end_date ON StudentSubscription(endDate);

-- StudentTier table indexes
CREATE INDEX idx_student_tier_plan_type ON StudentTier(planType);
CREATE INDEX idx_student_tier_is_active ON StudentTier(isActive);

-- CourseWeeklyPrice table indexes
CREATE INDEX idx_course_weekly_price_course_id ON CourseWeeklyPrice(courseId);
CREATE INDEX idx_course_weekly_price_week_number ON CourseWeeklyPrice(weekNumber);
CREATE INDEX idx_course_weekly_price_course_week ON CourseWeeklyPrice(courseId, weekNumber);

-- CoursePricingRule table indexes
CREATE INDEX idx_course_pricing_rule_course_id ON CoursePricingRule(courseId);
CREATE INDEX idx_course_pricing_rule_rule_type ON CoursePricingRule(ruleType);
CREATE INDEX idx_course_pricing_rule_is_active ON CoursePricingRule(isActive);

-- Module table indexes
CREATE INDEX idx_module_course_id ON Module(courseId);
CREATE INDEX idx_module_order_index ON Module(orderIndex);
CREATE INDEX idx_module_status ON Module(status);
CREATE INDEX idx_module_course_order ON Module(courseId, orderIndex);

-- ModuleProgress table indexes
CREATE INDEX idx_module_progress_module_id ON ModuleProgress(moduleId);
CREATE INDEX idx_module_progress_student_id ON ModuleProgress(studentId);
CREATE INDEX idx_module_progress_status ON ModuleProgress(status);
CREATE INDEX idx_module_progress_module_student ON ModuleProgress(moduleId, studentId);

-- Quiz table indexes
CREATE INDEX idx_quiz_module_id ON Quiz(moduleId);
CREATE INDEX idx_quiz_status ON Quiz(status);
CREATE INDEX idx_quiz_module_status ON Quiz(moduleId, status);

-- QuizAttempt table indexes
CREATE INDEX idx_quiz_attempt_quiz_id ON QuizAttempt(quizId);
CREATE INDEX idx_quiz_attempt_student_id ON QuizAttempt(studentId);
CREATE INDEX idx_quiz_attempt_created_at ON QuizAttempt(createdAt);
CREATE INDEX idx_quiz_attempt_quiz_student ON QuizAttempt(quizId, studentId);

-- Exercise table indexes
CREATE INDEX idx_exercise_module_id ON Exercise(moduleId);
CREATE INDEX idx_exercise_type ON Exercise(type);
CREATE INDEX idx_exercise_status ON Exercise(status);
CREATE INDEX idx_exercise_module_type ON Exercise(moduleId, type);

-- ExerciseAttempt table indexes
CREATE INDEX idx_exercise_attempt_exercise_id ON ExerciseAttempt(exerciseId);
CREATE INDEX idx_exercise_attempt_student_id ON ExerciseAttempt(studentId);
CREATE INDEX idx_exercise_attempt_created_at ON ExerciseAttempt(createdAt);
CREATE INDEX idx_exercise_attempt_exercise_student ON ExerciseAttempt(exerciseId, studentId);

-- Notification table indexes
CREATE INDEX idx_notification_user_id ON Notification(userId);
CREATE INDEX idx_notification_type ON Notification(type);
CREATE INDEX idx_notification_status ON Notification(status);
CREATE INDEX idx_notification_created_at ON Notification(createdAt);
CREATE INDEX idx_notification_user_status ON Notification(userId, status);
CREATE INDEX idx_notification_user_type ON Notification(userId, type);

-- LearningSession table indexes
CREATE INDEX idx_learning_session_student_id ON LearningSession(studentId);
CREATE INDEX idx_learning_session_course_id ON LearningSession(courseId);
CREATE INDEX idx_learning_session_started_at ON LearningSession(startedAt);
CREATE INDEX idx_learning_session_ended_at ON LearningSession(endedAt);
CREATE INDEX idx_learning_session_student_course ON LearningSession(studentId, courseId);

-- StudentAchievement table indexes
CREATE INDEX idx_student_achievement_student_id ON StudentAchievement(studentId);
CREATE INDEX idx_student_achievement_achievement_type ON StudentAchievement(achievementType);
CREATE INDEX idx_student_achievement_earned_at ON StudentAchievement(earnedAt);
CREATE INDEX idx_student_achievement_student_type ON StudentAchievement(studentId, achievementType);

-- Composite indexes for complex queries
CREATE INDEX idx_course_institution_status_featured ON Course(institutionId, status, createdAt);
CREATE INDEX idx_enrollment_course_student_status ON StudentCourseEnrollment(courseId, studentId, status);
CREATE INDEX idx_payment_user_course_status ON Payment(userId, courseId, status);
CREATE INDEX idx_notification_user_status_created ON Notification(userId, status, createdAt);

-- Full-text search indexes for search functionality
CREATE FULLTEXT INDEX idx_course_search ON Course(title, description);
CREATE FULLTEXT INDEX idx_institution_search ON Institution(name, description);
CREATE FULLTEXT INDEX idx_tag_search ON Tag(name, description);

-- Partial indexes for active records only
CREATE INDEX idx_course_active ON Course(id) WHERE status = 'ACTIVE';
CREATE INDEX idx_institution_active ON Institution(id) WHERE status = 'ACTIVE';
CREATE INDEX idx_user_active ON User(id) WHERE status = 'ACTIVE';
CREATE INDEX idx_enrollment_active ON StudentCourseEnrollment(id) WHERE status = 'ENROLLED';

-- Indexes for date range queries
CREATE INDEX idx_course_date_range ON Course(createdAt, updatedAt) WHERE status = 'ACTIVE';
CREATE INDEX idx_enrollment_date_range ON StudentCourseEnrollment(enrolledAt, status);
CREATE INDEX idx_payment_date_range ON Payment(createdAt, status);

-- Performance monitoring table indexes (if exists)
-- CREATE INDEX idx_performance_metrics_timestamp ON PerformanceMetrics(timestamp);
-- CREATE INDEX idx_performance_metrics_type ON PerformanceMetrics(metricType);
-- CREATE INDEX idx_performance_metrics_type_timestamp ON PerformanceMetrics(metricType, timestamp);

-- Add comments for documentation
COMMENT ON INDEX idx_course_status IS 'Index for filtering courses by status';
COMMENT ON INDEX idx_course_institution_id IS 'Index for filtering courses by institution';
COMMENT ON INDEX idx_course_status_institution IS 'Composite index for institution courses with status';
COMMENT ON INDEX idx_institution_status_featured IS 'Composite index for featured institutions with status';
COMMENT ON INDEX idx_enrollment_course_student_status IS 'Composite index for student course enrollment status';
COMMENT ON INDEX idx_course_search IS 'Full-text search index for course content';
COMMENT ON INDEX idx_institution_search IS 'Full-text search index for institution content'; 