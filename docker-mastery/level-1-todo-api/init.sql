-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO todos (title, completed) VALUES
  ('Learn Docker', false),
  ('Build a Dockerfile from scratch', false),
  ('Master Docker Compose', false);
