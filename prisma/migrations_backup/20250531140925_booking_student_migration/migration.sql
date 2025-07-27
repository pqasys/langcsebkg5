/*
  Warnings:

  - You are about to drop the column `studentId` on the `booking` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Booking_studentId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `studentId`;

-- AddForeignKey
ALTER TABLE `course` ADD CONSTRAINT `course_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_institution_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
