# 🎯 LEVEL 2: Social Blog Platform

## 🏆 Challenge Overview

Build a **production-ready blog platform** with 5 services:
- **Frontend:** React SPA with hot-reload for development
- **API:** Node.js/Express backend
- **Database:** PostgreSQL with initialization scripts
- **Cache:** Redis for session management
- **Proxy:** Nginx reverse proxy with load balancing

**Time Estimate:** 4-6 hours  
**Difficulty:** ⭐⭐ Intermediate

---

## 🎓 What You'll Learn

### New Concepts (vs Level 1)
- Multi-stage builds for **frontend compilation**
- **Development vs Production** Dockerfile patterns
- Nginx as a **reverse proxy**
- Redis for **caching** and sessions
- **Hot-reload** in development mode
- **Image optimization** (size comparison)
- **Dependency wait strategies** (healthchecks)
- **Environment-specific configs**

---

## 📁 Project Structure

```
level-2-blog-platform/
├── api/                  # Node.js backend
│   ├── src/
│   ├── package.json
│   ├── Dockerfile       ⚠️ YOU BUILD THIS
│   └── Dockerfile.dev   ⚠️ YOU BUILD THIS
├── frontend/            # React SPA
│   ├── src/
│   ├── package.json
│   ├── Dockerfile       ⚠️ YOU BUILD THIS
│   └── Dockerfile.dev   ⚠️ YOU BUILD THIS
├── nginx/
│   └── nginx.conf       ✅ PROVIDED
├── database/
│   └── init.sql         ✅ PROVIDED
├── docker-compose.yml   ⚠️ YOU COMPLETE THIS
├── docker-compose.dev.yml ⚠️ YOU COMPLETE THIS
└── README.md            ✅ YOU'RE HERE
```

---

## 🎯 Your Mission

### Phase 1: Build Individual Dockerfiles (3-4 hours)

You need to create **4 Dockerfiles**:

1. **`api/Dockerfile`** - Production API image
   - Multi-stage build
   - Only production dependencies
   - Non-root user
   - Optimized for size

2. **`api/Dockerfile.dev`** - Development API image
   - Hot-reload with nodemon
   - All dependencies (including dev)
   - Faster rebuild times
   - Debugging enabled

3. **`frontend/Dockerfile`** - Production frontend image
   - Multi-stage: build → serve
   - Stage 1: Build React app with npm
   - Stage 2: Serve with Nginx
   - Tiny final image (<50MB)

4. **`frontend/Dockerfile.dev`** - Development frontend image
   - Hot-reload with Vite/Webpack dev server
   - Source maps enabled
   - Fast refresh

### Phase 2: Orchestrate with Docker Compose (1-2 hours)

Complete two compose files:

1. **`docker-compose.yml`** - Production setup
   - All services optimized
   - Nginx serving static frontend
   - API behind proxy
   - Persistent volumes

2. **`docker-compose.dev.yml`** - Development setup
   - Uses Dockerfile.dev images
   - Volume mounts for live code changes
   - Exposed ports for debugging
   - Faster startup

---

## 🔧 Technical Requirements

### API Service Requirements
- Node.js 20
- Express server
- PostgreSQL connection
- Redis session store
- Endpoints:
  - `GET /api/health` - Health check
  - `GET /api/posts` - List all posts
  - `POST /api/posts` - Create post
  - `GET /api/posts/:id` - Get single post
  - `PUT /api/posts/:id` - Update post
  - `DELETE /api/posts/:id` - Delete post

### Frontend Requirements
- React 18
- Vite build tool
- API calls to backend
- Environment variable for API URL
- Responsive design

### Nginx Configuration
- Reverse proxy to API on `/api/*`
- Serve static files for frontend on `/*`
- Load balancing if API is scaled
- Gzip compression

### Database Requirements
- PostgreSQL 16
- Persistent volume
- Init script for tables
- Health checks

### Redis Requirements
- Redis 7
- Session storage
- Persistent volume
- Health checks

---

## 📝 Step-by-Step Guide

### STEP 1: Understand the Application (15 min)

Before writing ANY Dockerfile, examine:

```bash
# Check API dependencies
cat api/package.json

# Check Frontend dependencies
cat frontend/package.json

# Check what the API does
cat api/src/server.js

# Check frontend entry point
cat frontend/src/main.jsx
```

**Questions to answer:**
1. What Node version is required?
2. What's the build command for frontend?
3. What's the start command for API?
4. What ports do services use?

---

### STEP 2: API Production Dockerfile (30-45 min)

**Challenge:** Create `api/Dockerfile`

**Requirements:**
- Multi-stage build
- Stage 1: Install all deps, prepare app
- Stage 2: Production deps only, non-root user
- Final image should be ~150-200MB

**Template:**
```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
# Copy dependency files
COPY ??? ???
# Install dependencies
RUN ???
# Copy source code
COPY ??? ???

# Stage 2: Production
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
# Copy dependency files
COPY ??? ???
# Install ONLY production dependencies
RUN ???
# Copy app from builder
COPY --from=builder ??? ???
# Create non-root user
RUN addgroup -S ??? && adduser -S ??? -G ???
# Change ownership
RUN chown -R ???
# Switch to non-root
USER ???
EXPOSE ???
CMD ???
```

**Hints:**
- Package files: `package*.json`
- Install all: `npm install`
- Install prod only: `npm install --only=production`
- Copy source: `COPY src ./src`

---

### STEP 3: API Development Dockerfile (20-30 min)

**Challenge:** Create `api/Dockerfile.dev`

**Requirements:**
- Single stage (simpler for dev)
- Install ALL dependencies (including nodemon)
- Use nodemon for hot-reload
- Mount source code as volume (specified in compose)

**Template:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install  # All dependencies, including dev
EXPOSE 3001
# Use nodemon for hot-reload
CMD ["npx", "nodemon", "src/server.js"]
```

**Why simpler?**
- Dev: Fast iteration > image size
- Prod: Security + size > build time

---

### STEP 4: Frontend Production Dockerfile (45-60 min)

**Challenge:** Create `frontend/Dockerfile`

**This is the hardest one!** Multi-stage with build + serve.

**Requirements:**
- Stage 1: Build React app
- Stage 2: Serve with Nginx
- Final image should be ~20-30MB
- Environment variables for API URL

**Template:**
```dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config (optional)
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Key concepts:**
- `npm run build` creates `/app/dist` directory
- Nginx serves static files from `/usr/share/nginx/html`
- Alpine nginx is tiny (~40MB)
- Only the built files are copied (no source, no node_modules!)

---

### STEP 5: Frontend Development Dockerfile (15-20 min)

**Challenge:** Create `frontend/Dockerfile.dev`

**Requirements:**
- Use Vite dev server
- Hot-reload enabled
- Source code mounted as volume

**Template:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 5173
# Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
```

**Note:** `--host` makes Vite accessible from outside container

---

### STEP 6: Production Docker Compose (30-45 min)

**Challenge:** Complete `docker-compose.yml`

**Template:**
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: blogdb
      POSTGRES_USER: bloguser
      POSTGRES_PASSWORD: blogpass
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bloguser -d blogdb"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  # API Backend
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    environment:
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: blogdb
      DB_USER: bloguser
      DB_PASSWORD: blogpass
      REDIS_HOST: redis
      REDIS_PORT: 6379
      NODE_ENV: production
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy
    # Don't expose port - nginx will proxy

  # Frontend (built and served by Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    # Don't expose port - nginx will proxy

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
      - frontend

volumes:
  postgres-data:
  redis-data:
```

---

### STEP 7: Development Docker Compose (20-30 min)

**Challenge:** Complete `docker-compose.dev.yml`

**Key differences from production:**
- Use Dockerfile.dev images
- Mount source code as volumes (hot-reload!)
- Expose ports for direct access
- Override commands if needed

**Template:**
```yaml
version: '3.8'

services:
  database:
    # Same as production
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: blogdb
      POSTGRES_USER: bloguser
      POSTGRES_PASSWORD: blogpass
    volumes:
      - postgres-data-dev:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"  # Expose for DB tools
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bloguser -d blogdb"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    # Same as production
    image: redis:7-alpine
    volumes:
      - redis-data-dev:/data
    ports:
      - "6379:6379"  # Expose for Redis tools
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev  # Use dev Dockerfile!
    volumes:
      - ./api/src:/app/src:ro  # Mount source code (read-only)
      - /app/node_modules  # Prevent overwriting node_modules
    environment:
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: blogdb
      DB_USER: bloguser
      DB_PASSWORD: blogpass
      REDIS_HOST: redis
      REDIS_PORT: 6379
      NODE_ENV: development
    ports:
      - "3001:3001"  # Expose for direct access/debugging
    depends_on:
      database:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev  # Use dev Dockerfile!
    volumes:
      - ./frontend/src:/app/src:ro  # Mount source code
      - /app/node_modules  # Prevent overwriting
    environment:
      - VITE_API_URL=http://localhost:3001
    ports:
      - "5173:5173"  # Vite dev server
    depends_on:
      - api

volumes:
  postgres-data-dev:
  redis-data-dev:
```

---

## 🧪 Testing Your Solution

### Production Mode
```bash
# Build all images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Test the app
curl http://localhost/api/health
# Open browser: http://localhost

# Check image sizes
docker images | grep blog

# Stop
docker-compose down
```

### Development Mode
```bash
# Start dev environment
docker-compose -f docker-compose.dev.yml up -d

# Check logs
docker-compose -f docker-compose.dev.yml logs -f

# Test hot-reload: Edit api/src/server.js
# Save and watch it reload!

# Test frontend hot-reload: Edit frontend/src/App.jsx
# Browser should auto-refresh!

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Verification Checklist
- [ ] API health check responds
- [ ] Can create a blog post
- [ ] Frontend loads and displays posts
- [ ] Redis caching works (check API logs)
- [ ] Hot-reload works in dev mode
- [ ] Production images are optimized (<200MB total)
- [ ] No root user in production containers
- [ ] Database persists data after restart

---

## 🎯 Success Criteria

Your solution should achieve:

### Image Sizes
- **api (prod):** ~150-200MB
- **api (dev):** ~200-250MB
- **frontend (prod):** ~20-40MB
- **frontend (dev):** ~200-250MB

### Build Times
- **Production build:** 2-5 minutes (first time)
- **Production rebuild:** 30-60 seconds (with caching)
- **Dev build:** 1-3 minutes
- **Dev rebuild:** 10-20 seconds (with caching)

### Functionality
- ✅ All API endpoints work
- ✅ Frontend communicates with API
- ✅ Redis sessions persist
- ✅ Database persists across restarts
- ✅ Hot-reload works in dev mode
- ✅ Production serves optimized static files

---

## 💡 Common Challenges & Solutions

### Challenge 1: "ECONNREFUSED" errors
**Problem:** API can't connect to database  
**Solution:** Use `depends_on` with health checks

### Challenge 2: Frontend can't reach API
**Problem:** CORS or wrong API URL  
**Solution:** Check VITE_API_URL and nginx proxy config

### Challenge 3: Hot-reload not working
**Problem:** File changes not detected  
**Solution:** Ensure volume mounts are correct, check `:ro` flag

### Challenge 4: Huge image sizes
**Problem:** Production images are 500MB+  
**Solution:** Use multi-stage builds, alpine images, --only=production

### Challenge 5: Slow builds
**Problem:** Docker always reinstalls node_modules  
**Solution:** Copy package.json BEFORE source code

---

## 🚀 Bonus Challenges

Completed the basics? Try these:

### Bonus 1: Add Image Upload
- Add file upload endpoint
- Use volume for persistent storage
- Serve images through nginx

### Bonus 2: Add Scaling
- Scale API to 3 instances: `docker-compose up -d --scale api=3`
- Verify nginx load balances requests
- Check Redis session sharing works

### Bonus 3: Add Logging
- Add logging service (ELK stack light)
- Centralize logs from all services

### Bonus 4: Add Monitoring
- Add health dashboard
- Monitor container stats

### Bonus 5: Optimize Further
- Get frontend image under 20MB
- Use distroless images for API
- Implement Docker layer caching in CI/CD

---

## 📚 Resources

- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Nginx Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Docker Compose depends_on](https://docs.docker.com/compose/compose-file/05-services/#depends_on)
- [React Production Build](https://vitejs.dev/guide/build.html)

---

## 🆘 Need Help?

Check these files:
- **HINTS.md** - Progressive hints for each step
- **SOLUTION.md** - Full working solution (try first!)

---

**Ready? Let's build! 🚀**

Time estimate: 4-6 hours  
Coffee recommended: ☕☕☕
