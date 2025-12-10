-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) DEFAULT 'Anonymous',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster queries
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Insert sample posts
INSERT INTO posts (title, content, author) VALUES
  ('Welcome to the Blog Platform!', 
   'This is your first blog post. You''re seeing this from a PostgreSQL database running in Docker! The API is caching results in Redis for better performance.', 
   'System'),
  
  ('Understanding Docker Multi-Stage Builds', 
   'Multi-stage builds help you create smaller, more secure Docker images by separating the build environment from the runtime environment. This is especially useful for compiled languages and frontend applications.', 
   'Docker Expert'),
  
  ('Redis Caching in Action', 
   'Every time you fetch posts, the API checks Redis first. If the data is cached, you get it instantly! Try creating a new post and watch the cache invalidate. Check the API logs to see cache hits and misses.', 
   'Backend Developer'),
  
  ('Hot Reload Development', 
   'In development mode, both the API and frontend support hot-reload. Try editing the source code and watch your changes appear instantly without rebuilding the containers!', 
   'DevOps Engineer'),
  
  ('Production vs Development', 
   'Notice how we have separate Dockerfiles for production and development? This is a best practice. Production prioritizes size and security, while development prioritizes speed and debugging capabilities.', 
   'Software Architect');

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '✓ Database initialized successfully';
  RAISE NOTICE '✓ Posts table created';
  RAISE NOTICE '✓ Sample data inserted';
END $$;
