-- Check if table exists before creating
SET @tableExists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'module_progress');

SET @createTableSQL = IF(@tableExists = 0,
    'CREATE TABLE `module_progress` (
        `id` VARCHAR(36) NOT NULL,
        `moduleId` VARCHAR(36) NOT NULL,
        `studentId` VARCHAR(36) NOT NULL,
        `contentCompleted` BOOLEAN NOT NULL DEFAULT false,
        `exercisesCompleted` BOOLEAN NOT NULL DEFAULT false,
        `quizCompleted` BOOLEAN NOT NULL DEFAULT false,
        `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        `completedAt` DATETIME(3) NULL,
        `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        `updatedAt` DATETIME(3) NOT NULL,

        UNIQUE INDEX `module_student_unique`(`moduleId`, `studentId`),
        INDEX `module_progress_module_id_idx`(`moduleId`),
        INDEX `module_progress_student_id_idx`(`studentId`),
        CONSTRAINT `module_progress_module_fk` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `module_progress_student_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
    'SELECT "Table module_progress already exists"'
);

PREPARE stmt FROM @createTableSQL;
EXECUTE stmt;
DEALLOCATE PREPARE stmt; 