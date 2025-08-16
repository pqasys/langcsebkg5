-- Add itemId field to design_configs table
-- This field links design configurations to specific promotional items

ALTER TABLE design_configs 
ADD COLUMN itemId VARCHAR(255) NULL;

-- Create index for better query performance
CREATE INDEX idx_design_configs_item_id ON design_configs(itemId);

-- Create composite index for user-specific item queries
CREATE INDEX idx_design_configs_user_item ON design_configs(createdBy, itemId);

-- Update existing design configs to have a default itemId if they don't have one
-- This is for backward compatibility
UPDATE design_configs 
SET itemId = CONCAT('legacy-', id) 
WHERE itemId IS NULL;
