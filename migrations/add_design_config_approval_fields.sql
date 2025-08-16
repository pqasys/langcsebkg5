-- Add approval workflow fields to design_configs table
ALTER TABLE design_configs 
ADD COLUMN isApproved BOOLEAN DEFAULT FALSE,
ADD COLUMN approvedBy VARCHAR(36) NULL,
ADD COLUMN approvedAt DATETIME NULL,
ADD COLUMN approvalStatus VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN approvalNotes TEXT NULL;

-- Add indexes for better performance
CREATE INDEX idx_design_configs_approval_status ON design_configs(approvalStatus);
CREATE INDEX idx_design_configs_created_by ON design_configs(createdBy);
CREATE INDEX idx_design_configs_approved_by ON design_configs(approvedBy);

-- Update existing design configs to be approved if they are active
UPDATE design_configs 
SET isApproved = TRUE, 
    approvalStatus = 'APPROVED' 
WHERE isActive = TRUE AND isApproved IS NULL;
