/*
  Warnings:

  - You are about to drop the column `endDate` on the `course_pricing_rules` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `course_pricing_rules` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `course_pricing_rules` table. All the data in the column will be lost.
  - You are about to drop the column `completion_date` on the `student_course_completions` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `student_course_completions` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `student_course_completions` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `student_course_completions` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `student_course_completions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `student_course_completions` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `student_course_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `student_course_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `student_course_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `student_course_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `student_course_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `student_course_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `student_course_enrollments` table. All the data in the column will be lost.
  - Added the required column `ruleType` to the `course_pricing_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ruleValue` to the `course_pricing_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `student_course_completions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `student_course_completions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `student_course_completions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_course_completions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `student_course_enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `student_course_enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_course_enrollments` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `student_course_enrollments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `idx_completions_course` ON `student_course_completions`;

-- DropIndex
DROP INDEX `idx_completions_student` ON `student_course_completions`;

-- DropIndex
DROP INDEX `idx_enrollments_course` ON `student_course_enrollments`;

-- DropIndex
DROP INDEX `idx_enrollments_student` ON `student_course_enrollments`;

-- AlterTable
ALTER TABLE `course_pricing_rules` DROP COLUMN `endDate`,
    DROP COLUMN `price`,
    DROP COLUMN `startDate`,
    ADD COLUMN `ruleType` VARCHAR(20) NOT NULL,
    ADD COLUMN `ruleValue` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `student_course_completions` DROP COLUMN `completion_date`,
    DROP COLUMN `course_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `grade`,
    DROP COLUMN `student_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `courseId` VARCHAR(36) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` VARCHAR(20) NOT NULL,
    ADD COLUMN `studentId` VARCHAR(36) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `student_course_enrollments` DROP COLUMN `course_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `end_date`,
    DROP COLUMN `progress`,
    DROP COLUMN `start_date`,
    DROP COLUMN `student_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `courseId` VARCHAR(36) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `studentId` VARCHAR(36) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` VARCHAR(20) NOT NULL;

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

-- CreateIndex
CREATE INDEX `StudentCourseCompletion_studentId_fkey` ON `student_course_completions`(`studentId`);

-- CreateIndex
CREATE INDEX `StudentCourseCompletion_courseId_fkey` ON `student_course_completions`(`courseId`);

-- CreateIndex
CREATE INDEX `StudentCourseEnrollment_studentId_fkey` ON `student_course_enrollments`(`studentId`);

-- CreateIndex
CREATE INDEX `StudentCourseEnrollment_courseId_fkey` ON `student_course_enrollments`(`courseId`);

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_completions` ADD CONSTRAINT `student_course_completions_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_completions` ADD CONSTRAINT `student_course_completions_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commissionratelog` ADD CONSTRAINT `commissionratelog_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_weekly_prices` ADD CONSTRAINT `course_weekly_prices_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_pricing_rules` ADD CONSTRAINT `course_pricing_rules_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_monthly_prices` ADD CONSTRAINT `course_monthly_prices_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `course_pricing_rules` RENAME INDEX `course_pricing_rules_courseId_idx` TO `CoursePricingRule_courseId_fkey`;
