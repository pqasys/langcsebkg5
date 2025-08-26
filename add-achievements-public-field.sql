-- Add achievementsPublic field to user table
ALTER TABLE user ADD COLUMN achievementsPublic BOOLEAN DEFAULT FALSE;

-- Add index for better query performance
CREATE INDEX idx_user_achievements_public ON user(achievementsPublic);
