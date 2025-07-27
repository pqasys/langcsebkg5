-- Add new payment fields
ALTER TABLE `payments`
ADD COLUMN `institutionId` VARCHAR(191) NOT NULL,
ADD COLUMN `enrollmentId` VARCHAR(191) NOT NULL,
ADD COLUMN `commissionAmount` DOUBLE NOT NULL DEFAULT 0,
ADD COLUMN `institutionAmount` DOUBLE NOT NULL DEFAULT 0,
ADD COLUMN `payoutId` VARCHAR(191) NULL,
ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
ADD COLUMN `referenceNumber` VARCHAR(191) NULL,
ADD COLUMN `notes` TEXT NULL,
ADD INDEX `payments_institutionId_idx` (`institutionId`),
ADD INDEX `payments_enrollmentId_idx` (`enrollmentId`),
ADD INDEX `payments_payoutId_idx` (`payoutId`),
ADD CONSTRAINT `payments_institutionId_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT `payments_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `student_course_enrollments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT `payments_payoutId_fkey` FOREIGN KEY (`payoutId`) REFERENCES `institution_payouts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add payments relation to InstitutionPayout
ALTER TABLE `institution_payouts`
ADD COLUMN `payments` JSON NULL; 