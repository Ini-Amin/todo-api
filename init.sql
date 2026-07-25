CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE
);

-- Insert example tasks only if the table is empty
INSERT INTO tasks (title, done)
SELECT 'Learn Express.js', false
WHERE NOT EXISTS (SELECT 1 FROM tasks LIMIT 1);

INSERT INTO tasks (title, done)
SELECT 'Build a CRUD API', false
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Build a CRUD API');

INSERT INTO tasks (title, done)
SELECT 'Containerize with Docker', false
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Containerize with Docker');
