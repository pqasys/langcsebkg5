/*
  Warnings:

  - You are about to drop the column `end_date` on the `course_pricing_rules` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `course_pricing_rules` table. All the data in the column will be lost.
  - You are about to drop the column `week_number` on the `course_weekly_prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseId,year,weekNumber]` on the table `course_weekly_prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDate` to the `course_pricing_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `course_pricing_rules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekNumber` to the `course_weekly_prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `course_weekly_prices_courseId_week_number_year_key` ON `course_weekly_prices`;

-- AlterTable
ALTER TABLE `course_pricing_rules` DROP COLUMN `end_date`,
    DROP COLUMN `start_date`,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `course_weekly_prices` DROP COLUMN `week_number`,
    ADD COLUMN `weekNumber` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `course_weekly_prices_courseId_year_weekNumber_key` ON `course_weekly_prices`(`courseId`, `year`, `weekNumber`);

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_completions` ADD CONSTRAINT `student_course_completions_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_completions` ADD CONSTRAINT `student_course_completions_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_weekly_prices` ADD CONSTRAINT `course_weekly_prices_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_pricing_rules` ADD CONSTRAINT `course_pricing_rules_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
