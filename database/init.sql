CREATE USER todouser WITH PASSWORD 'todouser';

GRANT ALL PRIVILEGES ON DATABASE tododb TO todouser;

 
\connect tododb;
 
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT text_not_blank CHECK (text <> '')
);
 
-- Example 1: Basic insert (created_at and updated_at will be automatically set to current time)
INSERT INTO tasks (text, completed)
VALUES ('Finalize quarterly report', FALSE);

-- Example 2: Multiple inserts in a single statement
INSERT INTO tasks (text, completed)
VALUES 
  ('Schedule team meeting', FALSE),
  ('Review pull requests', FALSE),
  ('Deploy to production', FALSE),
  ('Update documentation', FALSE);

-- Example 3: Insert with explicit completion status
INSERT INTO tasks (text, completed)
VALUES ('Send client invoice', TRUE);

-- Example 4: Insert with all fields specified (overriding default timestamps)
INSERT INTO tasks (text, completed, created_at, updated_at)
VALUES ('Archive old files', FALSE, '2025-03-25 14:30:00', '2025-03-25 14:30:00');

-- Example 5: Insert tasks with longer text description
INSERT INTO tasks (text, completed)
VALUES ('Research and compile market analysis for Q2 product strategy meeting', FALSE);

-- Example 6: Insert a high-priority task (you might want to add a priority column to your schema)
INSERT INTO tasks (text, completed)
VALUES ('Fix critical security vulnerability in authentication module', FALSE);
 
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO todouser;
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO todouser; 