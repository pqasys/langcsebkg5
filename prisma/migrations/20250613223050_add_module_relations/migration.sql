/*
  Warnings:

  - You are about to drop the column `description` on the `content_items` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `content_items` table. All the data in the column will be lost.
  - You are about to drop the column `correct_answer` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `exercises` table. All the data in the column will be lost.
  - Added the required column `content` to the `content_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answer` to the `exercises` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Tag_name_key` ON `tag`;

-- AlterTable
ALTER TABLE `content_items` DROP COLUMN `description`,
    DROP COLUMN `url`,
    ADD COLUMN `content` TEXT NOT NULL,
    MODIFY `order_index` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `exercises` DROP COLUMN `correct_answer`,
    DROP COLUMN `points`,
    ADD COLUMN `answer` TEXT NOT NULL,
    MODIFY `order_index` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `tag_name_idx` ON `tag`(`name`);

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
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `commissionratelog` ADD CONSTRAINT `commissionratelog_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_items` ADD CONSTRAINT `content_items_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercises` ADD CONSTRAINT `exercises_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_weekly_prices` ADD CONSTRAINT `course_weekly_prices_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_monthly_price` ADD CONSTRAINT `course_monthly_price_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- RenameIndex
ALTER TABLE `coursetag` RENAME INDEX `courseTag_courseId_idx` TO `coursetag_courseId_idx`;

-- RenameIndex
ALTER TABLE `coursetag` RENAME INDEX `courseTag_courseId_tagId_key` TO `coursetag_courseId_tagId_key`;

-- RenameIndex
ALTER TABLE `coursetag` RENAME INDEX `courseTag_tagId_idx` TO `coursetag_tagId_idx`;

-- RenameIndex
ALTER TABLE `tag` RENAME INDEX `Tag_slug_key` TO `tag_slug_key`;
