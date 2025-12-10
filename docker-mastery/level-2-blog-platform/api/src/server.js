const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'blogdb',
  user: process.env.DB_USER || 'bloguser',
  password: process.env.DB_PASSWORD || 'blogpass'
});

// Redis connection
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.on('connect', () => console.log('✓ Redis connected'));

// Session management with Redis
redisClient.connect().then(() => {
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'blog-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  }));

  console.log('✓ Session store configured with Redis');
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    // Check Redis connection
    const redisPing = await redisClient.ping();
    
    res.json({
      status: 'healthy',
      database: 'connected',
      redis: redisPing === 'PONG' ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Get all posts (with caching)
app.get('/api/posts', async (req, res) => {
  try {
    // Try to get from cache first
    const cacheKey = 'posts:all';
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      console.log('✓ Cache hit for all posts');
      return res.json({
        posts: JSON.parse(cached),
        source: 'cache'
      });
    }

    // If not in cache, fetch from database
    console.log('✗ Cache miss - fetching from database');
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    
    // Store in cache for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(result.rows));
    
    res.json({
      posts: result.rows,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single post (with caching)
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Try cache first
    const cacheKey = `post:${id}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      console.log(`✓ Cache hit for post ${id}`);
      return res.json({
        post: JSON.parse(cached),
        source: 'cache'
      });
    }

    // Fetch from database
    console.log(`✗ Cache miss for post ${id} - fetching from database`);
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Cache for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify(result.rows[0]));
    
    res.json({
      post: result.rows[0],
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a post
app.post('/api/posts', async (req, res) => {
  const { title, content, author } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author || 'Anonymous']
    );
    
    // Invalidate cache
    await redisClient.del('posts:all');
    console.log('✓ Cache invalidated for all posts');
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update a post
app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Invalidate caches
    await redisClient.del('posts:all');
    await redisClient.del(`post:${id}`);
    console.log(`✓ Cache invalidated for post ${id}`);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Invalidate caches
    await redisClient.del('posts:all');
    await redisClient.del(`post:${id}`);
    console.log(`✓ Cache invalidated for post ${id}`);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Session tracking endpoint (demonstrates Redis session)
app.get('/api/session', (req, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;
  
  res.json({
    sessionId: req.sessionID,
    views: req.session.views,
    message: 'Session stored in Redis'
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║     Blog API Server Running            ║
╠════════════════════════════════════════╣
║ Port:        ${PORT}                     ║
║ Environment: ${process.env.NODE_ENV || 'development'}       ║
║ Database:    ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}        ║
║ Redis:       ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}           ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await pool.end();
  await redisClient.quit();
  process.exit(0);
});
