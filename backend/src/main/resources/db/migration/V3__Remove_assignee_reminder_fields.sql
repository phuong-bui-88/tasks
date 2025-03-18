-- For MySQL versions before 8.0
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'task' AND COLUMN_NAME = 'assignee_email' 
               AND TABLE_SCHEMA = DATABASE());
SET @query = IF(@exist > 0, 'ALTER TABLE task DROP COLUMN assignee_email', 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'task' AND COLUMN_NAME = 'reminder_sent' 
               AND TABLE_SCHEMA = DATABASE());
SET @query = IF(@exist > 0, 'ALTER TABLE task DROP COLUMN reminder_sent', 'SELECT 1');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;