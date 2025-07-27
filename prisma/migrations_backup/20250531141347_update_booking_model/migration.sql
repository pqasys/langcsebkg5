/*
  Warnings:

  - You are about to drop the column `userId` on the `booking` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Booking_userId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `userId`,
    ADD COLUMN `studentId` VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE INDEX `Booking_studentId_fkey` ON `booking`(`studentId`);

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
