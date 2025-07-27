-- Drop foreign key constraints first
SET @constraint_name = (
    SELECT CONSTRAINT_NAME 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'institution' 
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    AND CONSTRAINT_NAME = 'Institution_typeId_fkey'
);

SET @sql = IF(@constraint_name IS NOT NULL, 
    CONCAT('ALTER TABLE `institution` DROP FOREIGN KEY `', @constraint_name, '`'),
    'SELECT "Foreign key does not exist"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Remove typeId column from institution table
SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'institution'
    AND COLUMN_NAME = 'typeId'
);

SET @sql = IF(@column_exists > 0,
    'ALTER TABLE `institution` DROP COLUMN `typeId`',
    'SELECT "Column does not exist"');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the institutiontype table
DROP TABLE IF EXISTS `institutiontype`;

-- Remove institution type related tags
DELETE FROM `tag` WHERE `name` IN (
    'University',
    'College',
    'Community College',
    'Technical Institute',
    'Business School',
    'Language School',
    'Art School',
    'Music School',
    'Culinary School',
    'Professional Training Center',
    'Online Learning Platform',
    'Research Institute',
    'Vocational School',
    'Adult Education Center',
    'International School'
);

-- Remove related tag relations
DELETE tr FROM `tagrelation` tr
INNER JOIN `tag` t ON tr.tagId = t.id OR tr.relatedId = t.id
WHERE t.name IN (
    'University',
    'College',
    'Community College',
    'Technical Institute',
    'Business School',
    'Language School',
    'Art School',
    'Music School',
    'Culinary School',
    'Professional Training Center',
    'Online Learning Platform',
    'Research Institute',
    'Vocational School',
    'Adult Education Center',
    'International School'
); 