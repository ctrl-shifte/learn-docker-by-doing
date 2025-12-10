# 🔒 LEVEL 2 SOLUTIONS

## ⚠️ DON'T PEEK UNTIL YOU'VE TRIED!

The learning happens in the struggle. These solutions are here for:
1. When you're completely stuck after trying
2. To compare your approach after completing
3. To verify your solution works correctly

---

## 📁 File Structure

You need to create these files:
```
level-2-blog-platform/
├── api/
│   ├── Dockerfile              ← Solution below
│   └── Dockerfile.dev          ← Solution below
├── frontend/
│   ├── Dockerfile              ← Solution below
│   └── Dockerfile.dev          ← Solution below
├── docker-compose.yml          ← Solution below
└── docker-compose.dev.yml      ← Solution below
```

---

## 1️⃣ API Production Dockerfile

**File:** `api/Dockerfile`

```dockerfile
# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (for layer caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for potential build steps)
RUN npm install

# Copy source code
COPY src ./src

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

# Copy application code from builder
COPY --from=builder /app/src ./src

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of app files
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose API port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "src/server.js"]
```

**Key Points:**
- ✅ Multi-stage build (builder + production)
- ✅ Layer caching optimized (package.json before source)
- ✅ Production-only dependencies in final image
- ✅ Non-root user for security
- ✅ Health check included
- ✅ Should be ~150-200MB

---

## 2️⃣ API Development Dockerfile

**File:** `api/Dockerfile.dev`

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install ALL dependencies (including nodemon)
RUN npm install

# Expose API port
EXPOSE 3001

# Use nodemon for hot-reload
# Source code will be mounted as volume in docker-compose
CMD ["npx", "nodemon", "src/server.js"]
```

**Key Points:**
- ✅ Single stage (simpler for dev)
- ✅ All dependencies including devDependencies
- ✅ Nodemon for hot-reload
- ✅ Source mounted as volume in compose file
- ✅ Faster rebuild times

---

## 3️⃣ Frontend Production Dockerfile

**File:** `frontend/Dockerfile`

```dockerfile
# ============================================
# Stage 1: Build React Application
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and config files
COPY index.html ./
COPY vite.config.js ./
COPY src ./src

# Build the application
# This creates /app/dist with optimized production build
RUN npm run build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Copy custom nginx configuration
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Key Points:**
- ✅ Multi-stage: build + serve
- ✅ Build stage uses Node to compile React
- ✅ Runtime stage uses tiny nginx (~40MB base)
- ✅ Only dist/ files copied to final image
- ✅ Final image should be ~20-40MB
- ✅ No node_modules in production!

---

## 4️⃣ Frontend Development Dockerfile

**File:** `frontend/Dockerfile.dev`

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server
# --host makes it accessible from outside container
# Source code will be mounted as volume
CMD ["npm", "run", "dev", "--", "--host"]
```

**Key Points:**
- ✅ Single stage for dev
- ✅ Vite dev server with hot-reload
- ✅ --host flag for external access
- ✅ Source code mounted as volume
- ✅ Fast refresh on file changes

---

## 5️⃣ Production Docker Compose

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  database:
    image: postgres:16-alpine
    container_name: blog_database
    environment:
      POSTGRES_DB: blogdb
      POSTGRES_USER: bloguser
      POSTGRES_PASSWORD: blogpass
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bloguser -d blogdb"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - blog-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: blog_redis
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - blog-network

  # API Backend
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: blog_api
    environment:
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: blogdb
      DB_USER: bloguser
      DB_PASSWORD: blogpass
      REDIS_HOST: redis
      REDIS_PORT: 6379
      NODE_ENV: production
      PORT: 3001
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - blog-network

  # Frontend (built React app served by Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: blog_frontend
    networks:
      - blog-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: blog_nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
      - frontend
    restart: unless-stopped
    networks:
      - blog-network

volumes:
  postgres-data:
    driver: local
  redis-data:
    driver: local

networks:
  blog-network:
    driver: bridge
```

**Key Points:**
- ✅ All services on custom network
- ✅ Health checks for database/redis
- ✅ depends_on with conditions
- ✅ Persistent volumes
- ✅ Only nginx exposes ports
- ✅ Services communicate via service names

---

## 6️⃣ Development Docker Compose

**File:** `docker-compose.dev.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database (same as production)
  database:
    image: postgres:16-alpine
    container_name: blog_database_dev
    environment:
      POSTGRES_DB: blogdb
      POSTGRES_USER: bloguser
      POSTGRES_PASSWORD: blogpass
    volumes:
      - postgres-data-dev:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"  # Expose for DB tools (e.g., pgAdmin)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bloguser -d blogdb"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - blog-network-dev

  # Redis Cache (same as production)
  redis:
    image: redis:7-alpine
    container_name: blog_redis_dev
    volumes:
      - redis-data-dev:/data
    ports:
      - "6379:6379"  # Expose for Redis clients
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - blog-network-dev

  # API Backend (Development Mode)
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev  # Uses dev Dockerfile!
    container_name: blog_api_dev
    volumes:
      # Mount source code for hot-reload
      - ./api/src:/app/src:ro
      # Prevent overwriting node_modules
      - /app/node_modules
    environment:
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: blogdb
      DB_USER: bloguser
      DB_PASSWORD: blogpass
      REDIS_HOST: redis
      REDIS_PORT: 6379
      NODE_ENV: development
      PORT: 3001
    ports:
      - "3001:3001"  # Expose for direct API access/debugging
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - blog-network-dev

  # Frontend (Development Mode)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev  # Uses dev Dockerfile!
    container_name: blog_frontend_dev
    volumes:
      # Mount source code for hot-reload
      - ./frontend/src:/app/src:ro
      - ./frontend/index.html:/app/index.html:ro
      - ./frontend/vite.config.js:/app/vite.config.js:ro
      # Prevent overwriting node_modules
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3001
    ports:
      - "5173:5173"  # Vite dev server
    depends_on:
      - api
    networks:
      - blog-network-dev

volumes:
  postgres-data-dev:
    driver: local
  redis-data-dev:
    driver: local

networks:
  blog-network-dev:
    driver: bridge
```

**Key Points:**
- ✅ Uses Dockerfile.dev images
- ✅ Source code mounted as volumes
- ✅ All ports exposed for debugging
- ✅ Separate volumes for dev data
- ✅ Hot-reload enabled for API and frontend
- ✅ Anonymous volumes prevent node_modules override

---

## 🚀 Usage Commands

### Production
```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Test
curl http://localhost/api/health
# Open browser: http://localhost

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Development
```bash
# Build dev images
docker-compose -f docker-compose.dev.yml build

# Start dev environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f api

# Test hot-reload
# Edit api/src/server.js or frontend/src/App.jsx
# Watch console for reload confirmation

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Scaling (Production)
```bash
# Scale API to 3 instances
docker-compose up -d --scale api=3

# Nginx will automatically load balance
```

---

## 📊 Expected Results

### Image Sizes
```bash
$ docker images | grep blog

blog-frontend       ~30MB   (production - nginx+static files)
blog-frontend-dev   ~250MB  (development - node+vite)
blog-api            ~180MB  (production - node alpine)
blog-api-dev        ~220MB  (development - node+nodemon)
```

### Build Times (approx)
- First build: 3-5 minutes
- Rebuild (no changes): 5-10 seconds
- Rebuild (code change): 10-20 seconds

---

## 🔍 How To Verify

### 1. Check Health
```bash
curl http://localhost/api/health
# Should return: {"status":"healthy",...}
```

### 2. Test Cache
```bash
# First request (database)
curl http://localhost/api/posts | jq '.source'
# Should return: "database"

# Second request (cache)
curl http://localhost/api/posts | jq '.source'
# Should return: "cache"
```

### 3. Test Hot-Reload (Dev)
```bash
# Start dev
docker-compose -f docker-compose.dev.yml up

# In another terminal, edit api/src/server.js
# Add a console.log somewhere
# Watch logs - should show restart

# Edit frontend/src/App.jsx
# Change a text string
# Browser should auto-refresh
```

### 4. Check Image Sizes
```bash
docker images | grep blog
# API prod should be ~180MB
# Frontend prod should be ~30MB
```

### 5. Check Non-Root User
```bash
docker-compose exec api whoami
# Should return: appuser (not root!)
```

---

## 💡 Common Issues

### Issue 1: "Cannot connect to database"
- **Check:** Health checks passing?
  ```bash
  docker-compose ps
  ```
- **Fix:** Ensure depends_on conditions are set

### Issue 2: "Hot-reload not working"
- **Check:** Volume mounts correct?
  ```bash
  docker-compose -f docker-compose.dev.yml config
  ```
- **Fix:** Verify ro flag and anonymous volume for node_modules

### Issue 3: "Frontend can't reach API"
- **Check:** VITE_API_URL correct? Nginx config?
- **Fix:** In dev: use localhost:3001, In prod: use /api (nginx proxy)

### Issue 4: "Image too large"
- **Check:** Using multi-stage? Production deps only?
  ```bash
  docker images
  ```
- **Fix:** Ensure --only=production flag and multi-stage

---

## 🎓 What You Learned

By completing this level, you now understand:

✅ **Multi-stage builds** - Separate build from runtime  
✅ **Development workflows** - Hot-reload with Docker  
✅ **Layer caching** - Optimize build times  
✅ **Security** - Non-root users in production  
✅ **Service orchestration** - Health checks and dependencies  
✅ **Environment separation** - Different configs for dev/prod  
✅ **Reverse proxying** - Nginx as API gateway  
✅ **Caching strategies** - Redis integration  
✅ **Image optimization** - Minimal production images  

---

## 🚀 Ready for Level 3?

Level 3 takes these concepts and applies them to a full microservices architecture with:
- Multiple languages (Go, Python, Node.js)
- Message queues (RabbitMQ)
- Service mesh concepts
- API Gateway patterns
- Production-grade monitoring

**You're ready!** Head to `level-3-ecommerce/` 🎉
