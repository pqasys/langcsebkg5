-- Drop and recreate test database
DROP DATABASE IF EXISTS csebook_test;
CREATE DATABASE csebook_test;
USE csebook_test;

-- Copy schema and data from production
SOURCE csebook_backup.sql;

-- Add subcategoryId column
ALTER TABLE `course` ADD COLUMN `subcategoryId` VARCHAR(36) NULL;

-- Update existing records
UPDATE `course` c
SET 
    -- If current categoryId is a main category (has no parent)
    `subcategoryId` = CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM `category` cat 
            WHERE cat.id = c.`categoryId` AND cat.`parentId` IS NOT NULL
        ) THEN (
            -- Get the first subcategory of this main category
            SELECT sub.id 
            FROM `category` sub 
            WHERE sub.`parentId` = c.`categoryId` 
            ORDER BY sub.id 
            LIMIT 1
        )
        -- If current categoryId is already a subcategory
        ELSE c.`categoryId`
    END,
    -- Update categoryId to be the parent if current categoryId is a subcategory
    `categoryId` = CASE 
        WHEN EXISTS (
            SELECT 1 FROM `category` cat 
            WHERE cat.id = c.`categoryId` AND cat.`parentId` IS NOT NULL
        ) THEN (
            -- Get the parent category
            SELECT parent.id 
            FROM `category` cat 
            JOIN `category` parent ON cat.`parentId` = parent.id 
            WHERE cat.id = c.`categoryId`
        )
        -- Keep the same categoryId if it's already a main category
        ELSE c.`categoryId`
    END;

-- Add foreign key constraint for subcategoryId
ALTER TABLE `course` ADD CONSTRAINT `Course_subcategoryId_fkey` 
FOREIGN KEY (`subcategoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Make subcategoryId required after data migration
ALTER TABLE `course` MODIFY COLUMN `subcategoryId` VARCHAR(36) NOT NULL;

-- Verify the results
SELECT 
    c.id,
    c.title,
    mc.name as main_category_name,
    sc.name as sub_category_name
FROM `course` c
JOIN `category` mc ON c.`categoryId` = mc.id
JOIN `category` sc ON c.`subcategoryId` = sc.id
LIMIT 5; 