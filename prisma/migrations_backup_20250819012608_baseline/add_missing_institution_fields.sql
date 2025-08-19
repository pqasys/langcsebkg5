-- Add missing fields to institution table
ALTER TABLE `institution` 
ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN `subscriptionPlan` VARCHAR(20) NOT NULL DEFAULT 'BASIC',
ADD COLUMN `discountSettings` JSON NULL,
ADD COLUMN `metadata` JSON NULL,
ADD COLUMN `socialMedia` JSON NULL,
ADD COLUMN `defaultMaxStudents` INTEGER NOT NULL DEFAULT 15,
ADD COLUMN `stripeCustomerId` VARCHAR(255) NULL,
ADD COLUMN `mainImageUrl` VARCHAR(255) NULL;

-- Add missing fields to user table
ALTER TABLE `user` 
ADD COLUMN `forcePasswordReset` BOOLEAN NOT NULL DEFAULT false;

-- Add indexes for better performance
CREATE INDEX `institution_isActive_idx` ON `institution`(`isActive`);
CREATE INDEX `institution_status_idx` ON `institution`(`status`);
CREATE INDEX `user_forcePasswordReset_idx` ON `user`(`forcePasswordReset`); 