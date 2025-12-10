# 🚀 Docker Mastery - QUICKSTART GUIDE

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ **Docker Desktop** installed (version 20.10+)
- ✅ **Docker Compose** installed (version 2.0+)
- ✅ **Text editor** (VS Code recommended)
- ✅ **Terminal** access
- ✅ **8GB+ RAM** (for Level 3)
- ✅ **Basic programming knowledge**

## ⚡ Quick Navigation

Already extracted the files? Jump to your level:

### [LEVEL 1: TODO API](#level-1-todo-api) → **Start Here!**
📍 Location: `level-1-todo-api/`  
⏱️ Time: 2-3 hours  
📚 Skills: Basic Dockerfile, docker-compose

### [LEVEL 2: Blog Platform](#level-2-blog-platform)
📍 Location: `level-2-blog-platform/`  
⏱️ Time: 4-6 hours  
📚 Skills: Multi-stage builds, dev vs prod, reverse proxy

### [LEVEL 3: E-Commerce](#level-3-e-commerce)
📍 Location: `level-3-ecommerce/`  
⏱️ Time: 8-15 hours  
📚 Skills: Microservices, polyglot, message queues

---

## 🎯 LEVEL 1: TODO API

### Your First Dockerfile Challenge!

**Objective:** Build a simple Node.js API with PostgreSQL from scratch.

```bash
cd level-1-todo-api

# Read the challenge
cat README.md

# Your task: Create a Dockerfile
# Answer these 4 questions:
# 1. What runtime? → Node.js 20
# 2. What to build? → npm install
# 3. What to run? → Just the code + node_modules
# 4. How to start? → node server.js

# Create your Dockerfile
nano Dockerfile  # or use your editor

# Test your solution
docker build -t todo-api:v1 .
docker-compose up -d

# Verify it works
curl http://localhost:3000/health
curl http://localhost:3000/todos

# Compare to solution (after trying!)
cat Dockerfile.solution
```

### Key Files
- `README.md` - Challenge instructions
- `QUICKSTART.md` - This is faster than README
- `COMPARISON.md` - Flask vs Node.js patterns
- `Dockerfile.solution` - Solution (don't peek!)

### Expected Outcome
✅ Docker image built successfully  
✅ Containers running via docker-compose  
✅ API endpoints responding  
✅ Understanding of basic Dockerfile structure  

---

## 🎯 LEVEL 2: Blog Platform

### Multi-Tier Application with 5 Services

**Objective:** Build a production-grade blog with frontend, API, database, cache, and proxy.

```bash
cd level-2-blog-platform

# Read the challenge
cat README.md

# You need to create 4 Dockerfiles:
# 1. api/Dockerfile (production)
# 2. api/Dockerfile.dev (development)
# 3. frontend/Dockerfile (production)
# 4. frontend/Dockerfile.dev (development)

# Plus 2 compose files:
# 5. docker-compose.yml (production)
# 6. docker-compose.dev.yml (development)

# Start with API production Dockerfile
cd api
nano Dockerfile

# Then frontend production Dockerfile
cd ../frontend
nano Dockerfile

# Then create compose file
cd ..
nano docker-compose.yml

# Test production setup
docker-compose build
docker-compose up -d

# Check it works
curl http://localhost/api/health
# Open browser: http://localhost

# Test development setup
docker-compose -f docker-compose.dev.yml up -d

# Test hot-reload: edit api/src/server.js
# Watch it reload in logs!

# Compare to solution
cat SOLUTION.md
```

### Key Files
- `README.md` - Full challenge with step-by-step
- `SOLUTION.md` - Complete solutions
- `HINTS.md` - Progressive hints if stuck
- Application code (already provided)

### Expected Outcome
✅ 5 services running (frontend, API, PostgreSQL, Redis, Nginx)  
✅ Production images optimized (<200MB API, <40MB frontend)  
✅ Development hot-reload working  
✅ Redis caching demonstrated  
✅ Nginx reverse proxy configured  

---

## 🎯 LEVEL 3: E-Commerce

### Production-Grade Microservices

**Objective:** Build a complete e-commerce platform with 9+ services across 3 languages.

```bash
cd level-3-ecommerce

# Read the architecture
cat ARCHITECTURE.md
cat README.md

# Build order (recommended):
# 1. User Service (Go) - Hardest! Multi-stage with static binary
# 2. Product Service (Node.js) - MongoDB integration
# 3. Order Service (Python) - RabbitMQ consumer
# 4. Payment Service (Node.js) - Async processing
# 5. Frontend (React) - Ties it all together

# Start with User Service
cd services/user-service
nano Dockerfile

# The Go challenge: 
# - Multi-stage build
# - Static binary (CGO_ENABLED=0)
# - Distroless or scratch image
# - Target: 10-20MB!

# Example structure:
# FROM golang:1.21-alpine AS builder
# ... build ...
# FROM alpine:latest
# ... copy binary only ...

# Continue with other services
# Then create docker-compose.yml

# Test the system
docker-compose build
docker-compose up -d

# Test user flow
# 1. Register user
curl -X POST http://localhost/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# 2. Login
curl -X POST http://localhost/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# 3. Get products
curl http://localhost/api/products

# 4. Create order (use token from login)
curl -X POST http://localhost/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'

# Check RabbitMQ
# Open: http://localhost:15672
# Login: guest/guest

# Compare to solution
cat SOLUTION.md
```

### Key Files
- `README.md` - Challenge overview
- `ARCHITECTURE.md` - System architecture
- `SOLUTION.md` - Complete solutions
- `HINTS.md` - Service-specific hints
- `TROUBLESHOOTING.md` - Common issues

### Expected Outcome
✅ 9+ services running  
✅ User Service (Go): 10-20MB  
✅ All APIs functional  
✅ RabbitMQ message queue working  
✅ Multiple databases (PostgreSQL + MongoDB)  
✅ Redis caching  
✅ Frontend integrated  

---

## 🐛 Common Issues

### Issue: "Cannot connect to Docker daemon"
```bash
# Solution: Start Docker Desktop
# Or on Linux: sudo systemctl start docker
```

### Issue: "Port already in use"
```bash
# Solution: Stop conflicting service
docker-compose down
# Or change ports in docker-compose.yml
```

### Issue: "No space left on device"
```bash
# Solution: Clean up Docker
docker system prune -a --volumes
```

### Issue: "Build taking forever"
```bash
# Solution: Check your internet connection
# Docker may be downloading base images
# First build always takes longer
```

### Issue: "Hot-reload not working (Level 2)"
```bash
# Solution: Check volume mounts
docker-compose -f docker-compose.dev.yml config
# Verify source code is mounted correctly
```

---

## 📊 Progress Tracking

Mark your achievements:

### Level 1
- [ ] Created first Dockerfile
- [ ] Built Docker image successfully
- [ ] Started containers with docker-compose
- [ ] Made API calls to running service
- [ ] Understood layer caching
- [ ] Completed in: ___ hours

### Level 2
- [ ] Created production Dockerfiles
- [ ] Created development Dockerfiles
- [ ] Set up docker-compose (prod)
- [ ] Set up docker-compose (dev)
- [ ] Tested hot-reload
- [ ] Optimized image sizes
- [ ] Completed in: ___ hours

### Level 3
- [ ] Built Go service (multi-stage)
- [ ] Built Node.js services
- [ ] Built Python service
- [ ] Set up message queue
- [ ] Integrated all services
- [ ] Tested full user flow
- [ ] Optimized all images
- [ ] Completed in: ___ hours

---

## 💡 Pro Tips

### Tip 1: Use Layer Caching
```dockerfile
# ❌ Bad: Reinstalls deps on every code change
COPY . .
RUN npm install

# ✅ Good: Deps cached until package.json changes
COPY package*.json ./
RUN npm install
COPY . .
```

### Tip 2: Check Logs When Stuck
```bash
# See all logs
docker-compose logs

# Follow specific service
docker-compose logs -f api

# Last 100 lines
docker-compose logs --tail=100
```

### Tip 3: Build Incrementally
Don't try to build everything at once!
1. Build one service
2. Test it works
3. Add next service
4. Test again
5. Repeat

### Tip 4: Use Docker Desktop Dashboard
The GUI makes it easier to:
- See running containers
- View logs
- Inspect volumes
- Check resource usage

---

## 🎓 Learning Path

### Week 1: Level 1
- Day 1-2: Read docs, attempt Dockerfile
- Day 3: Complete and test
- Day 4: Compare to solution, understand why

### Week 2: Level 2
- Day 1-2: API Dockerfiles
- Day 3-4: Frontend Dockerfiles
- Day 5-6: Docker Compose
- Day 7: Test and optimize

### Week 3-4: Level 3
- Week 3: Build all services
- Week 4: Integrate and test

### Alternative: Weekend Sprint
- Friday PM: Level 1
- Saturday: Level 2
- Sunday: Start Level 3
- Following weekends: Complete Level 3

---

## 🆘 Getting Help

Stuck? Try this order:

1. **Check logs**
   ```bash
   docker-compose logs [service-name]
   ```

2. **Re-read instructions**
   - Often the answer is in the README

3. **Check HINTS.md**
   - Progressive hints without spoiling

4. **Google the error**
   - Add "docker" to your search

5. **Check SOLUTION.md**
   - Only after genuinely trying!

---

## 🎉 After Completion

Congratulations! You now know Docker better than most developers.

### Next Steps:
1. **Kubernetes** - Orchestrate containers at scale
2. **CI/CD** - Automate Docker builds
3. **Cloud Deploy** - AWS ECS, GCP Cloud Run, Azure Containers
4. **Security** - Image scanning, secrets management
5. **Monitoring** - Prometheus, Grafana

### Share Your Success:
- Write a blog post about what you learned
- Share on LinkedIn/Twitter
- Help others with their Docker journey

---

## 📣 Feedback

After each level, reflect:
- ⭐ What was most challenging?
- 💡 What "clicked" for you?
- 🚀 What would you do differently?
- 📚 What do you want to learn next?

---

**Ready to begin? Choose your level and dive in!** 🐳🚀

Good luck, future Docker Master! 💪
