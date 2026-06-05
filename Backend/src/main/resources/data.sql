-- Demo Users
INSERT INTO users (username, email, role)
VALUES ('demo_read', 'demo_read@example.com', 'READ')
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, role)
VALUES ('demo_update', 'demo_update@example.com', 'UPDATE')
ON CONFLICT (username) DO NOTHING;


-- Priorities für demo_update
INSERT INTO priorities (level, user_id)
SELECT 'LOW', u.id
FROM users u
WHERE u.username = 'demo_update'
ON CONFLICT (user_id, level) DO NOTHING;

INSERT INTO priorities (level, user_id)
SELECT 'MEDIUM', u.id
FROM users u
WHERE u.username = 'demo_update'
ON CONFLICT (user_id, level) DO NOTHING;

INSERT INTO priorities (level, user_id)
SELECT 'HIGH', u.id
FROM users u
WHERE u.username = 'demo_update'
ON CONFLICT (user_id, level) DO NOTHING;


-- Categories für demo_update
INSERT INTO categories (name, user_id)
SELECT 'Arbeit', u.id
FROM users u
WHERE u.username = 'demo_update'
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO categories (name, user_id)
SELECT 'Privat', u.id
FROM users u
WHERE u.username = 'demo_update'
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO categories (name, user_id)
SELECT 'Shopping', u.id
FROM users u
WHERE u.username = 'demo_update'
ON CONFLICT (user_id, name) DO NOTHING;

INSERT INTO categories (name, user_id)
SELECT 'Haushalt', u.id
FROM users u
WHERE u.username = 'demo_update'
ON CONFLICT (user_id, name) DO NOTHING;


-- Demo Task 1
INSERT INTO tasks (
    title,
    description,
    completed,
    due_date,
    user_id,
    category_id,
    priority_id
)
SELECT
    'Projekt abschliessen',
    'Das wichtige Projekt bis Ende der Woche fertigstellen.',
    false,
    CURRENT_DATE + INTERVAL '7 days',
    u.id,
    c.id,
    p.id
FROM users u
    JOIN categories c ON c.name = 'Arbeit' AND c.user_id = u.id
    JOIN priorities p ON p.level = 'HIGH' AND p.user_id = u.id
WHERE u.username = 'demo_update'
  AND NOT EXISTS (
    SELECT 1
    FROM tasks t
    WHERE t.title = 'Projekt abschliessen'
      AND t.user_id = u.id
    );


-- Demo Task 2
INSERT INTO tasks (
    title,
    description,
    completed,
    due_date,
    user_id,
    category_id,
    priority_id
)
SELECT
    'Einkaufen gehen',
    'Wocheneinkauf erledigen: Milch, Brot, Gemüse.',
    false,
    CURRENT_DATE + INTERVAL '1 day',
    u.id,
    c.id,
    p.id
FROM users u
    JOIN categories c ON c.name = 'Shopping' AND c.user_id = u.id
    JOIN priorities p ON p.level = 'MEDIUM' AND p.user_id = u.id
WHERE u.username = 'demo_update'
  AND NOT EXISTS (
    SELECT 1
    FROM tasks t
    WHERE t.title = 'Einkaufen gehen'
      AND t.user_id = u.id
    );
