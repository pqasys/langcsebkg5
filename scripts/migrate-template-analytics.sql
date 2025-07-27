-- Migration script for Template Analytics features
-- Run this script to add the new tables and columns

-- Add version column to question_templates table
ALTER TABLE question_templates ADD COLUMN version INT DEFAULT 1;

-- Create question_template_versions table
CREATE TABLE question_template_versions (
  id VARCHAR(36) PRIMARY KEY,
  template_id VARCHAR(36) NOT NULL,
  version_number INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_config JSON NOT NULL,
  category VARCHAR(100),
  difficulty VARCHAR(20) NOT NULL,
  tags JSON,
  change_log TEXT,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_template_version (template_id, version_number),
  INDEX idx_template_id (template_id),
  INDEX idx_version_number (version_number),
  INDEX idx_created_by (created_by),
  
  FOREIGN KEY (template_id) REFERENCES question_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES user(id)
);

-- Create question_template_usage table
CREATE TABLE question_template_usage (
  id VARCHAR(36) PRIMARY KEY,
  template_id VARCHAR(36) NOT NULL,
  used_by VARCHAR(36) NOT NULL,
  institution_id VARCHAR(36),
  usage_context VARCHAR(100) NOT NULL,
  target_quiz_id VARCHAR(36),
  target_question_bank_id VARCHAR(36),
  customization_level VARCHAR(50) NOT NULL,
  success_rate FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_template_id (template_id),
  INDEX idx_used_by (used_by),
  INDEX idx_institution_id (institution_id),
  INDEX idx_usage_context (usage_context),
  INDEX idx_created_at (created_at),
  
  FOREIGN KEY (template_id) REFERENCES question_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (used_by) REFERENCES user(id),
  FOREIGN KEY (institution_id) REFERENCES institution(id)
);

-- Create question_template_suggestions table
CREATE TABLE question_template_suggestions (
  id VARCHAR(36) PRIMARY KEY,
  template_id VARCHAR(36) NOT NULL,
  suggestion_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  suggested_changes JSON,
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  confidence_score FLOAT DEFAULT 0.0,
  based_on_usage BOOLEAN DEFAULT FALSE,
  based_on_performance BOOLEAN DEFAULT FALSE,
  based_on_feedback BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'PENDING',
  reviewed_by VARCHAR(36),
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_template_id (template_id),
  INDEX idx_suggestion_type (suggestion_type),
  INDEX idx_priority (priority),
  INDEX idx_status (status),
  INDEX idx_reviewed_by (reviewed_by),
  
  FOREIGN KEY (template_id) REFERENCES question_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES user(id)
);

-- Add indexes to question_templates table
ALTER TABLE question_templates ADD INDEX idx_version (version);

-- Insert sample data for testing (optional)
-- INSERT INTO question_template_versions (id, template_id, version_number, name, description, template_config, category, difficulty, created_by)
-- SELECT 
--   UUID(),
--   id,
--   1,
--   name,
--   description,
--   template_config,
--   category,
--   difficulty,
--   created_by
-- FROM question_templates;

-- Update existing templates to have version 1
UPDATE question_templates SET version = 1 WHERE version IS NULL;

COMMIT; 