-- Sample data for testing Progress Tracking Dashboard
-- Run this after ensuring you have students and courses in the system

-- 1. Create sample module progress (replace student_id and module_id with actual IDs)
INSERT INTO module_progress (
    id, 
    moduleId, 
    studentId, 
    contentCompleted, 
    exercisesCompleted, 
    quizCompleted, 
    timeSpent, 
    quizScore, 
    bestQuizScore,
    sessionCount,
    averageSessionTime,
    learningStreak,
    lastStudyDate,
    retryAttempts,
    achievementUnlocked,
    createdAt,
    updatedAt,
    lastAccessedAt
) VALUES 
-- Sample progress data (replace with actual IDs from your database)
('test-progress-1', '2070f139-4946-11f0-9f87-0a0027000007', 'your-student-id-here', true, true, true, 3600, 85, 90, 5, 720, 3, NOW(), 1, true, NOW(), NOW(), NOW()),
('test-progress-2', '2070f139-4946-11f0-9f87-0a0027000008', 'your-student-id-here', true, false, false, 1800, NULL, NULL, 3, 600, 2, NOW(), 0, false, NOW(), NOW(), NOW());

-- 2. Create sample learning sessions
INSERT INTO learning_sessions (
    id,
    moduleProgressId,
    startedAt,
    endedAt,
    duration,
    activityType,
    completed,
    notes
) VALUES 
('test-session-1', 'test-progress-1', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), 3600, 'content', true, 'Studied video content'),
('test-session-2', 'test-progress-1', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY - INTERVAL 30 MINUTE), 1800, 'quiz', true, 'Completed module quiz'),
('test-session-3', 'test-progress-2', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY - INTERVAL 45 MINUTE), 2700, 'exercise', true, 'Completed exercises');

-- 3. Create sample achievements
INSERT INTO student_achievements (
    id,
    studentId,
    achievementType,
    title,
    description,
    icon,
    unlockedAt,
    metadata
) VALUES 
('test-achievement-1', 'your-student-id-here', 'module_complete', 'First Module Complete', 'Completed your first learning module', 'star', NOW(), '{"moduleId": "2070f139-4946-11f0-9f87-0a0027000007"}'),
('test-achievement-2', 'your-student-id-here', 'streak', '3-Day Streak', 'Studied for 3 consecutive days', 'flame', NOW(), '{"streakLength": 3}');

-- Note: Replace 'your-student-id-here' with actual student ID from your database
-- You can find student IDs by running: SELECT id, name, email FROM students LIMIT 5; 