-- Add language proficiency fields to Student model
ALTER TABLE students 
ADD COLUMN native_language VARCHAR(50) NULL,
ADD COLUMN spoken_languages JSON NULL,
ADD COLUMN learning_goals TEXT NULL,
ADD COLUMN interests JSON NULL,
ADD COLUMN social_visibility ENUM('PUBLIC', 'PRIVATE', 'FRIENDS_ONLY') DEFAULT 'PRIVATE',
ADD COLUMN timezone VARCHAR(50) NULL,
ADD COLUMN date_of_birth DATE NULL,
ADD COLUMN gender VARCHAR(20) NULL,
ADD COLUMN location VARCHAR(255) NULL,
ADD COLUMN website VARCHAR(255) NULL,
ADD COLUMN social_links JSON NULL;

-- Add indexes for better performance
CREATE INDEX idx_students_native_language ON students(native_language);
CREATE INDEX idx_students_social_visibility ON students(social_visibility);
CREATE INDEX idx_students_location ON students(location); 