-- Priorities
INSERT INTO priorities (level) VALUES ('LOW');
INSERT INTO priorities (level) VALUES ('MEDIUM');
INSERT INTO priorities (level) VALUES ('HIGH');

-- Categories
INSERT INTO categories (name) VALUES ('Arbeit');
INSERT INTO categories (name) VALUES ('Privat');
INSERT INTO categories (name) VALUES ('Shopping');
INSERT INTO categories (name) VALUES ('Haushalt');

-- Demo Users
INSERT INTO users (username, email, role) VALUES ('demo_read', 'demo_read@example.com', 'READ');
INSERT INTO users (username, email, role) VALUES ('demo_update', 'demo_update@example.com', 'UPDATE');
