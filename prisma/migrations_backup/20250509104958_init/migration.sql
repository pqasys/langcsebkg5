-- CreateTable
CREATE TABLE `institution` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) NULL,
    `country` VARCHAR(100) NOT NULL,
    `postcode` VARCHAR(20) NULL,
    `email` VARCHAR(50) NOT NULL,
    `website` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `institutionEmail` VARCHAR(100) NULL,
    `telephone` VARCHAR(20) NULL,
    `contactName` VARCHAR(100) NULL,
    `contactJobTitle` VARCHAR(100) NULL,
    `contactPhone` VARCHAR(20) NULL,
    `contactEmail` VARCHAR(100) NULL,
    `logoUrl` VARCHAR(255) NULL,
    `facilities` TEXT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `isApproved` BOOLEAN NOT NULL DEFAULT false,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
    `commissionRate` FLOAT NOT NULL DEFAULT 10,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `duration` INTEGER NOT NULL,
    `level` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `institutionId` VARCHAR(36) NOT NULL,
    `categoryId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `maxStudents` INTEGER NOT NULL DEFAULT 20,
    `base_price` DOUBLE NOT NULL DEFAULT 0,
    `pricingPeriod` VARCHAR(20) NOT NULL DEFAULT 'WEEKLY',
    `framework` ENUM('CEFR', 'ACTFL', 'JLPT', 'HSK', 'TOPIK') NOT NULL DEFAULT 'CEFR',

    INDEX `Course_categoryId_fkey`(`categoryId`),
    INDEX `Course_institutionId_fkey`(`institutionId`),
    UNIQUE INDEX `Course_title_institutionId_key`(`title`, `institutionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `bio` TEXT NULL,
    `status` ENUM('active', 'inactive') NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_active` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    INDEX `idx_students_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_institutions` (
    `id` VARCHAR(36) NOT NULL,
    `student_id` VARCHAR(36) NOT NULL,
    `institution_id` VARCHAR(36) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `student_institutions_student_id_idx`(`student_id`),
    INDEX `student_institutions_institution_id_idx`(`institution_id`),
    UNIQUE INDEX `student_institutions_student_id_institution_id_key`(`student_id`, `institution_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_course_enrollments` (
    `id` VARCHAR(36) NOT NULL,
    `student_id` VARCHAR(36) NOT NULL,
    `course_id` VARCHAR(36) NOT NULL,
    `status` ENUM('in_progress', 'completed', 'dropped') NULL DEFAULT 'in_progress',
    `progress` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `start_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `end_date` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_enrollments_course`(`course_id`),
    INDEX `idx_enrollments_student`(`student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_course_completions` (
    `id` VARCHAR(36) NOT NULL,
    `student_id` VARCHAR(36) NOT NULL,
    `course_id` VARCHAR(36) NOT NULL,
    `completion_date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `grade` VARCHAR(10) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_completions_course`(`course_id`),
    INDEX `idx_completions_student`(`student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `categoryId` VARCHAR(36) NULL,
    `slug` VARCHAR(50) NOT NULL,
    `parentId` VARCHAR(36) NULL,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `color` VARCHAR(7) NULL,
    `icon` VARCHAR(50) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `priority` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Tag_name_key`(`name`),
    UNIQUE INDEX `Tag_slug_key`(`slug`),
    INDEX `tag_categoryId_idx`(`categoryId`),
    INDEX `tag_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coursetag` (
    `id` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `tagId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `courseTag_courseId_idx`(`courseId`),
    INDEX `courseTag_tagId_idx`(`tagId`),
    UNIQUE INDEX `courseTag_courseId_tagId_key`(`courseId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NULL,
    `email` VARCHAR(50) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(100) NULL,
    `password` VARCHAR(100) NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'user',
    `institutionId` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_institutionId_fkey`(`institutionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `institutionId` VARCHAR(36) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Booking_courseId_fkey`(`courseId`),
    INDEX `Booking_institutionId_fkey`(`institutionId`),
    INDEX `Booking_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commissionratelog` (
    `id` VARCHAR(36) NOT NULL,
    `institutionId` VARCHAR(36) NOT NULL,
    `previousRate` DOUBLE NOT NULL,
    `newRate` DOUBLE NOT NULL,
    `changedBy` VARCHAR(36) NOT NULL,
    `reason` TEXT NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CommissionRateLog_changedBy_idx`(`changedBy`),
    INDEX `CommissionRateLog_institutionId_idx`(`institutionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_items` (
    `id` VARCHAR(36) NOT NULL,
    `module_id` VARCHAR(36) NOT NULL,
    `type` ENUM('VIDEO', 'AUDIO', 'IMAGE', 'DOCUMENT') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `url` VARCHAR(255) NOT NULL,
    `order_index` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_content_items_module_id`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercises` (
    `id` VARCHAR(36) NOT NULL,
    `module_id` VARCHAR(36) NOT NULL,
    `type` ENUM('MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'MATCHING', 'SHORT_ANSWER') NOT NULL,
    `question` TEXT NOT NULL,
    `options` JSON NULL,
    `correct_answer` TEXT NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 1,
    `order_index` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_exercises_module_id`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `module_skills` (
    `module_id` VARCHAR(36) NOT NULL,
    `skill` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`module_id`, `skill`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modules` (
    `id` VARCHAR(36) NOT NULL,
    `course_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `level` ENUM('CEFR_A1', 'CEFR_A2', 'CEFR_B1', 'CEFR_B2', 'CEFR_C1', 'CEFR_C2', 'ACTFL_NOVICE_LOW', 'ACTFL_NOVICE_MID', 'ACTFL_NOVICE_HIGH', 'ACTFL_INTERMEDIATE_LOW', 'ACTFL_INTERMEDIATE_MID', 'ACTFL_INTERMEDIATE_HIGH', 'ACTFL_ADVANCED_LOW', 'ACTFL_ADVANCED_MID', 'ACTFL_ADVANCED_HIGH', 'ACTFL_SUPERIOR', 'JLPT_N5', 'JLPT_N4', 'JLPT_N3', 'JLPT_N2', 'JLPT_N1', 'HSK_1', 'HSK_2', 'HSK_3', 'HSK_4', 'HSK_5', 'HSK_6', 'TOPIK_1', 'TOPIK_2', 'TOPIK_3', 'TOPIK_4', 'TOPIK_5', 'TOPIK_6') NOT NULL,
    `order_index` INTEGER NOT NULL DEFAULT 0,
    `estimated_duration` INTEGER NOT NULL DEFAULT 0,
    `vocabulary_list` TEXT NULL,
    `grammar_points` TEXT NULL,
    `cultural_notes` TEXT NULL,
    `is_published` BOOLEAN NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_modules_course_id`(`course_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_questions` (
    `id` VARCHAR(36) NOT NULL,
    `quiz_id` VARCHAR(36) NOT NULL,
    `type` ENUM('MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'MATCHING', 'SHORT_ANSWER') NOT NULL,
    `question` TEXT NOT NULL,
    `options` JSON NULL,
    `correct_answer` TEXT NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 1,
    `order_index` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_quiz_questions_quiz_id`(`quiz_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quizzes` (
    `id` VARCHAR(36) NOT NULL,
    `module_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `passing_score` INTEGER NOT NULL,
    `time_limit` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_quizzes_module_id`(`module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_progress` (
    `id` VARCHAR(36) NOT NULL,
    `student_id` VARCHAR(36) NOT NULL,
    `module_id` VARCHAR(36) NOT NULL,
    `content_completed` BOOLEAN NULL DEFAULT false,
    `exercises_completed` BOOLEAN NULL DEFAULT false,
    `quiz_completed` BOOLEAN NULL DEFAULT false,
    `quiz_score` INTEGER NULL,
    `started_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `completed_at` TIMESTAMP(0) NULL,

    INDEX `idx_student_progress_module_id`(`module_id`),
    INDEX `idx_student_progress_student_id`(`student_id`),
    UNIQUE INDEX `unique_student_module`(`student_id`, `module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_weekly_prices` (
    `id` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `week_number` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `course_weekly_prices_courseId_idx`(`courseId`),
    UNIQUE INDEX `course_weekly_prices_courseId_week_number_year_key`(`courseId`, `week_number`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_pricing_rules` (
    `id` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `course_pricing_rules_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tagrelation` (
    `id` VARCHAR(36) NOT NULL,
    `tagId` VARCHAR(36) NOT NULL,
    `relatedId` VARCHAR(36) NOT NULL,
    `strength` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `tagRelation_relatedId_idx`(`relatedId`),
    INDEX `tagRelation_tagId_idx`(`tagId`),
    UNIQUE INDEX `tagRelation_tagId_relatedId_key`(`tagId`, `relatedId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_institution_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE SET NULL ON UPDATE CASCADE; 