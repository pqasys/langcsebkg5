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
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
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
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `maxStudents` INTEGER NOT NULL DEFAULT 15,
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
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` DATETIME(3) NULL,
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `paymentDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `student_course_enrollments_studentId_idx`(`studentId`),
    INDEX `student_course_enrollments_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_course_completions` (
    `id` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(20) NOT NULL,
    `studentId` VARCHAR(36) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudentCourseCompletion_studentId_fkey`(`studentId`),
    INDEX `StudentCourseCompletion_courseId_fkey`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
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
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `slug` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coursetag` (
    `id` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `tagId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `courseTag_courseId_idx`(`courseId`),
    INDEX `courseTag_tagId_idx`(`tagId`),
    UNIQUE INDEX `courseTag_courseId_tagId_key`(`courseId`, `tagId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(255) NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    `institutionId` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_institutionId_fkey`(`institutionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking` (
    `id` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `institutionId` VARCHAR(36) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `amount` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studentId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,

    INDEX `Booking_courseId_fkey`(`courseId`),
    INDEX `Booking_institutionId_fkey`(`institutionId`),
    INDEX `Booking_studentId_fkey`(`studentId`),
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
    `weekNumber` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `course_weekly_prices_courseId_idx`(`courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_monthly_prices` (
    `id` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `year` INTEGER NOT NULL,
    `monthNumber` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `course_monthly_prices_courseId_idx`(`courseId`),
    UNIQUE INDEX `course_monthly_prices_courseId_year_monthNumber_key`(`courseId`, `year`, `monthNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_pricing_rules` (
    `id` VARCHAR(36) NOT NULL,
    `courseId` VARCHAR(36) NOT NULL,
    `ruleType` VARCHAR(20) NOT NULL,
    `ruleValue` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `tagRelation_relatedId_idx`(`relatedId`),
    INDEX `tagRelation_tagId_idx`(`tagId`),
    UNIQUE INDEX `tagRelation_tagId_relatedId_key`(`tagId`, `relatedId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `institution_commissions` (
    `id` VARCHAR(191) NOT NULL,
    `institutionId` VARCHAR(191) NOT NULL,
    `rate` DOUBLE NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `institution_commissions_institutionId_key`(`institutionId`),
    INDEX `institution_commissions_institutionId_idx`(`institutionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `institution_payouts` (
    `id` VARCHAR(191) NOT NULL,
    `institutionId` VARCHAR(191) NOT NULL,
    `enrollmentId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `institution_payouts_institutionId_idx`(`institutionId`),
    INDEX `institution_payouts_enrollmentId_idx`(`enrollmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `metadata` JSON NULL,
    `institutionId` VARCHAR(191) NOT NULL,
    `enrollmentId` VARCHAR(191) NOT NULL,
    `commissionAmount` DOUBLE NOT NULL DEFAULT 0,
    `institutionAmount` DOUBLE NOT NULL DEFAULT 0,
    `payoutId` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `referenceNumber` VARCHAR(191) NULL,
    `notes` TEXT NULL,

    INDEX `payments_institutionId_idx`(`institutionId`),
    INDEX `payments_enrollmentId_idx`(`enrollmentId`),
    INDEX `payments_payoutId_idx`(`payoutId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_completions` ADD CONSTRAINT `student_course_completions_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_completions` ADD CONSTRAINT `student_course_completions_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tag` ADD CONSTRAINT `tag_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_weekly_prices` ADD CONSTRAINT `course_weekly_prices_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_pricing_rules` ADD CONSTRAINT `course_pricing_rules_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `institution_commissions` ADD CONSTRAINT `institution_commissions_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `institution_payouts` ADD CONSTRAINT `InstitutionPayout_institution_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `institution_payouts` ADD CONSTRAINT `InstitutionPayout_enrollment_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `student_course_enrollments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `institution_payouts` ADD CONSTRAINT `InstitutionPayout_commission_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution_commissions`(`institutionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `student_course_enrollments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_payoutId_fkey` FOREIGN KEY (`payoutId`) REFERENCES `institution_payouts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
