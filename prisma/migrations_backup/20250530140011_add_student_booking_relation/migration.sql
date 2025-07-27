-- Add student relation to booking table
ALTER TABLE `booking` ADD COLUMN `studentId` VARCHAR(36) NULL;
ALTER TABLE `booking` ADD INDEX `Booking_studentId_fkey`(`studentId`);
ALTER TABLE `booking` ADD CONSTRAINT `booking_student_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE; 