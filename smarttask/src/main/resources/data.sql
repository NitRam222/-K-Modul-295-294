-- Priorities
INSERT INTO priorities (level)
VALUES ('LOW')
ON CONFLICT (level) DO NOTHING;

INSERT INTO priorities (level)
VALUES ('MEDIUM')
ON CONFLICT (level) DO NOTHING;

INSERT INTO priorities (level)
VALUES ('HIGH')
ON CONFLICT (level) DO NOTHING;


-- Categories
INSERT INTO categories (name)
VALUES ('Arbeit')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name)
VALUES ('Privat')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name)
VALUES ('Shopping')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name)
VALUES ('Haushalt')
ON CONFLICT (name) DO NOTHING;


-- Demo Users
INSERT INTO users (username, email, role)
VALUES ('demo_read', 'demo_read@example.com', 'READ')
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, role)
VALUES ('demo_update', 'demo_update@example.com', 'UPDATE')
ON CONFLICT (username) DO NOTHING;


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
    JOIN categories c ON c.name = 'Arbeit'
    JOIN priorities p ON p.level = 'HIGH'
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
    JOIN categories c ON c.name = 'Shopping'
    JOIN priorities p ON p.level = 'MEDIUM'
WHERE u.username = 'demo_update'
  AND NOT EXISTS (
    SELECT 1
    FROM tasks t
    WHERE t.title = 'Einkaufen gehen'
      AND t.user_id = u.id
    );
