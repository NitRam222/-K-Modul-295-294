-- Ensure user_id columns exist for per-user categories and priorities
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id bigint;
ALTER TABLE priorities ADD COLUMN IF NOT EXISTS user_id bigint;

-- Ensure demo_update user exists to migrate legacy rows
INSERT INTO users (username, email, role)
VALUES ('demo_update', 'demo_update@example.com', 'UPDATE')
ON CONFLICT (username) DO NOTHING;

-- Create unique indexes required by data.sql ON CONFLICT clauses
CREATE UNIQUE INDEX IF NOT EXISTS uk_categories_user_id_name ON categories (user_id, name);
CREATE UNIQUE INDEX IF NOT EXISTS uk_priorities_user_id_level ON priorities (user_id, level);

-- Assign legacy rows to a default demo user
UPDATE categories
SET user_id = (SELECT id FROM users WHERE username = 'demo_update')
WHERE user_id IS NULL;

UPDATE priorities
SET user_id = (SELECT id FROM users WHERE username = 'demo_update')
WHERE user_id IS NULL;

-- Set the new foreign key columns to NOT NULL after migration
ALTER TABLE categories ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE priorities ALTER COLUMN user_id SET NOT NULL;
