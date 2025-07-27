-- First, check if users table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add role column to users if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = "users";
SET @columnname = "role";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE users ADD COLUMN role ENUM('STUDENT', 'INSTITUTION', 'ADMIN') NOT NULL DEFAULT 'STUDENT' AFTER name"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check if institutions table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS institutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_institutions_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add description column to institutions if it doesn't exist
SET @tablename = "institutions";
SET @columnname = "description";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE institutions ADD COLUMN description TEXT AFTER name"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check if courses table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE,
    INDEX idx_courses_institution_id (institution_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add level column to courses if it doesn't exist
SET @tablename = "courses";
SET @columnname = "level";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE courses ADD COLUMN level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') AFTER description"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Create modules table if it doesn't exist
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    estimated_duration INT NOT NULL DEFAULT 0 COMMENT 'in minutes',
    vocabulary_list TEXT COMMENT 'JSON array of vocabulary words',
    grammar_points TEXT COMMENT 'JSON array of grammar points',
    cultural_notes TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_modules_course_id (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create module_skills table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS module_skills (
    module_id INT NOT NULL,
    skill VARCHAR(50) NOT NULL,
    PRIMARY KEY (module_id, skill),
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create content_items table
CREATE TABLE IF NOT EXISTS content_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    type ENUM('VIDEO', 'AUDIO', 'IMAGE', 'DOCUMENT') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(255) NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    INDEX idx_content_items_module_id (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    type ENUM('MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'MATCHING', 'SHORT_ANSWER') NOT NULL,
    question TEXT NOT NULL,
    options JSON COMMENT 'For multiple choice questions',
    correct_answer TEXT NOT NULL,
    points INT NOT NULL DEFAULT 1,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    INDEX idx_exercises_module_id (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INT NOT NULL,
    time_limit INT COMMENT 'in minutes, NULL means no time limit',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    INDEX idx_quizzes_module_id (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    type ENUM('MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'MATCHING', 'SHORT_ANSWER') NOT NULL,
    question TEXT NOT NULL,
    options JSON COMMENT 'For multiple choice questions',
    correct_answer TEXT NOT NULL,
    points INT NOT NULL DEFAULT 1,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_questions_quiz_id (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create student_progress table
CREATE TABLE IF NOT EXISTS student_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    module_id INT NOT NULL,
    content_completed BOOLEAN DEFAULT false,
    exercises_completed BOOLEAN DEFAULT false,
    quiz_completed BOOLEAN DEFAULT false,
    quiz_score INT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY unique_student_module (student_id, module_id),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    INDEX idx_student_progress_student_id (student_id),
    INDEX idx_student_progress_module_id (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing
-- Sample users (password is 'password123' hashed)
INSERT INTO users (name, email, password, role) VALUES
('John Student', 'john@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'STUDENT'),
('Mary Student', 'mary@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'STUDENT'),
('Admin User', 'admin@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'ADMIN');

-- Sample institutions
INSERT INTO institutions (name, email, password, description) VALUES
('Language School A', 'schoola@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'Premier language school offering comprehensive courses'),
('Language School B', 'schoolb@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'Modern language learning center with innovative methods');

-- Sample courses
INSERT INTO courses (institution_id, title, description, level) VALUES
(1, 'Beginner Spanish', 'Complete Spanish course for beginners', 'A1'),
(1, 'Intermediate Spanish', 'Spanish course for intermediate learners', 'B1'),
(2, 'Advanced French', 'Advanced French language and culture', 'C1'),
(2, 'Business English', 'English for professional communication', 'B2');

-- Sample modules
INSERT INTO modules (course_id, title, description, level, order_index, estimated_duration, vocabulary_list, grammar_points, cultural_notes, is_published) VALUES
(1, 'Basic Greetings', 'Learn essential Spanish greetings', 'A1', 1, 30, '["hola", "buenos días", "buenas noches"]', '["present tense", "basic pronouns"]', 'Spanish greeting customs', true),
(1, 'Numbers 1-10', 'Learn to count in Spanish', 'A1', 2, 20, '["uno", "dos", "tres"]', '["cardinal numbers"]', 'Number usage in Spanish culture', true),
(2, 'Past Tense', 'Learn Spanish past tense', 'B1', 1, 45, '["ayer", "anoche", "pasado"]', '["preterite", "imperfect"]', 'Temporal expressions in Spanish', true),
(3, 'Advanced Grammar', 'Complex French grammar structures', 'C1', 1, 60, '["subjonctif", "conditionnel"]', '["subjunctive", "conditional"]', 'French literary traditions', true);

-- Sample module skills
INSERT INTO module_skills (module_id, skill) VALUES
(1, 'SPEAKING'),
(1, 'LISTENING'),
(2, 'READING'),
(2, 'WRITING'),
(3, 'GRAMMAR'),
(3, 'VOCABULARY'),
(4, 'GRAMMAR'),
(4, 'WRITING');

-- Sample content items
INSERT INTO content_items (module_id, type, title, description, url, order_index) VALUES
(1, 'VIDEO', 'Greetings Video', 'Basic Spanish greetings video', 'https://example.com/videos/greetings.mp4', 1),
(1, 'AUDIO', 'Greetings Audio', 'Practice pronunciation', 'https://example.com/audio/greetings.mp3', 2),
(2, 'DOCUMENT', 'Numbers Worksheet', 'Practice writing numbers', 'https://example.com/docs/numbers.pdf', 1);

-- Sample exercises
INSERT INTO exercises (module_id, type, question, options, correct_answer, points, order_index) VALUES
(1, 'MULTIPLE_CHOICE', 'How do you say "Good morning" in Spanish?', '["Buenos días", "Buenas noches", "Hola", "Adiós"]', 'Buenos días', 1, 1),
(1, 'FILL_IN_BLANK', 'Complete the greeting: "___ días"', NULL, 'Buenos', 1, 2),
(2, 'MATCHING', 'Match the numbers', '{"1": "uno", "2": "dos", "3": "tres"}', '{"1": "uno", "2": "dos", "3": "tres"}', 3, 1);

-- Sample quizzes
INSERT INTO quizzes (module_id, title, description, passing_score, time_limit) VALUES
(1, 'Greetings Quiz', 'Test your knowledge of Spanish greetings', 70, 15),
(2, 'Numbers Quiz', 'Test your knowledge of Spanish numbers', 80, 20);

-- Sample quiz questions
INSERT INTO quiz_questions (quiz_id, type, question, options, correct_answer, points, order_index) VALUES
(1, 'MULTIPLE_CHOICE', 'Which greeting is used in the morning?', '["Buenos días", "Buenas noches", "Hola", "Adiós"]', 'Buenos días', 1, 1),
(1, 'SHORT_ANSWER', 'Write the Spanish word for "hello"', NULL, 'hola', 1, 2),
(2, 'MULTIPLE_CHOICE', 'What is the Spanish word for "three"?', '["uno", "dos", "tres", "cuatro"]', 'tres', 1, 1);

-- Sample student progress
INSERT INTO student_progress (student_id, module_id, content_completed, exercises_completed, quiz_completed, quiz_score) VALUES
(1, 1, true, true, true, 85),
(1, 2, true, false, false, NULL),
(2, 1, true, true, false, NULL),
(2, 3, false, false, false, NULL);

-- Add indexes to existing tables if they don't exist
ALTER TABLE modules
ADD INDEX idx_modules_course_id (course_id);

-- Add any missing foreign key constraints
ALTER TABLE modules
ADD CONSTRAINT fk_modules_course
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE; 