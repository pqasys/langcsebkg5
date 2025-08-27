-- Migration: Update all existing VideoSession records to have 60-minute duration
-- This migration ensures all live classes conform to the 60-minute duration requirement

-- Update the endTime and duration for all VideoSession records
-- endTime = startTime + 60 minutes
-- duration = 60 minutes
UPDATE video_sessions 
SET 
  endTime = DATE_ADD(startTime, INTERVAL 60 MINUTE),
  duration = 60,
  updatedAt = NOW()
WHERE 
  -- Only update sessions that don't already have 60-minute duration
  (endTime != DATE_ADD(startTime, INTERVAL 60 MINUTE) OR duration != 60)
  AND status != 'CANCELLED'; -- Skip cancelled sessions

-- Log the number of updated records
-- Note: This is informational and won't affect the migration
-- The actual count will be shown when the migration runs
