-- Add performance indexes for admin courses API
-- This migration adds indexes to optimize the most common query patterns

-- Index for course filtering by institution, category, and status
CREATE INDEX idx_course_institution_category_status ON course(institutionId, categoryId, status, createdAt DESC);

-- Index for course search functionality (MySQL doesn't support GIN indexes like PostgreSQL)
-- Using a regular index for title and description
CREATE INDEX idx_course_title ON course(title);
CREATE INDEX idx_course_description ON course(description(255));

-- Index for course pagination and ordering
CREATE INDEX idx_course_created_at ON course(createdAt DESC);

-- Index for course filtering by institution
CREATE INDEX idx_course_institution_id ON course(institutionId, createdAt DESC);

-- Index for course filtering by category
CREATE INDEX idx_course_category_id ON course(categoryId, createdAt DESC);

-- Index for course status filtering
CREATE INDEX idx_course_status ON course(status, createdAt DESC);

-- Composite index for common filter combinations
CREATE INDEX idx_course_filters ON course(institutionId, categoryId, status, createdAt DESC);

-- Index for course tags relationship
CREATE INDEX idx_course_tag_course_id ON coursetag(courseId);

-- Index for enrollments count
CREATE INDEX idx_enrollment_course_id ON student_course_enrollments(courseId);

-- Index for completions count
CREATE INDEX idx_completion_course_id ON student_course_completions(courseId);

-- Index for bookings count
CREATE INDEX idx_booking_course_id ON booking(courseId);

-- Index for modules count
CREATE INDEX idx_modules_course_id ON modules(course_id);

-- Index for institution lookup
CREATE INDEX idx_institution_id ON institution(id);

-- Index for category lookup
CREATE INDEX idx_category_id ON category(id);

-- Index for tag lookup
CREATE INDEX idx_tag_id ON tag(id); 