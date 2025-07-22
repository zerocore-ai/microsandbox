-- Add down migration script here

-- Drop indexes first
DROP INDEX IF EXISTS idx_sandboxes_name;

-- Drop sandboxes table
DROP TABLE IF EXISTS sandboxes;
