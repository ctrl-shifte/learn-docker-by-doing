# TODO API - Dockerfile Challenge

## Your Mission: Build the Dockerfile from Scratch! 🚀

I've given you a Node.js Express app with PostgreSQL. Now **YOU** build the Dockerfile by answering the 4 core questions.

## Step-by-Step Guide

### STEP 1: Answer the Core Questions

Before writing ANY code, think through:

1. **What runtime does my app need?**
   - Hint: Look at package.json - what's the "main" language?
   - Hint: Node.js images on Docker Hub: `node:20-alpine`, `node:20`, `node:20-slim`

2. **What does my app need to build?**
   - Hint: What file lists dependencies? What command installs them?
   - Hint: `npm install` reads from...?

3. **What does my app need to run?**
   - Hint: Does it need build tools, or just the installed dependencies + code?
   - Hint: Look for a multi-stage build opportunity!

4. **How do I start my app?**
   - Hint: Check package.json "scripts" section
   - Hint: What's in the "main" field?

---

### STEP 2: Build Your Dockerfile

Create a file called `Dockerfile` in the todo-api directory.

**Try the single-stage approach first (simpler):**

```dockerfile
FROM ??? 
WORKDIR ???
COPY ??? ???
RUN ???
COPY ??? ???
EXPOSE ???
CMD ???
```

**Fill in the blanks:**
- FROM: Which Node.js version? (alpine for smaller size)
- WORKDIR: Where should the app live? (convention: /app)
- COPY (first): What files define dependencies? (think caching!)
- RUN: Command to install dependencies?
- COPY (second): What's left to copy? (the actual code)
- EXPOSE: What port? (check server.js)
- CMD: How to start? (check package.json "start" script)

---

### STEP 3: Optimize with Multi-Stage Build (Advanced)

**Why?** Dev dependencies (like nodemon) shouldn't be in production.

```dockerfile
# Stage 1: Build
FROM ??? AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install  # Installs ALL dependencies (dev + prod)

COPY . .
# Optional: RUN npm run build (if you had a build step)

# Stage 2: Runtime
FROM ??? AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production  # Only production dependencies!
COPY --from=builder /app/server.js .
# Copy any other necessary files

EXPOSE 3000
CMD ["node", "server.js"]
```

---

### STEP 4: Add Best Practices

Once you have a working Dockerfile, level it up:

**Security:**
```dockerfile
# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

**Health Check:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

**Environment Variables:**
```dockerfile
ENV NODE_ENV=production \
    PORT=3000
```

---

## Test Your Dockerfile

### Build the image:
```bash
docker build -t todo-api:v1 .
```

### Run with Docker Compose:
```bash
docker-compose up -d
```

### Test the API:
```bash
# Check health
curl http://localhost:3000/health

# Get todos
curl http://localhost:3000/todos

# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Master Dockerfiles!"}'

# Toggle completion
curl -X PATCH http://localhost:3000/todos/1

# Delete a todo
curl -X DELETE http://localhost:3000/todos/1
```

---

## Common Gotchas & Tips

### 1. Layer Caching
❌ **Bad:**
```dockerfile
COPY . .
RUN npm install
```
Every code change = reinstall all dependencies!

✅ **Good:**
```dockerfile
COPY package*.json ./
RUN npm install
COPY . .
```
Dependencies cached until package.json changes!

### 2. Image Size
- `node:20` = ~1GB
- `node:20-alpine` = ~170MB (Alpine Linux, minimal)
- `node:20-slim` = ~240MB (Debian minimal)

### 3. Don't Forget .dockerignore!
Already created for you. Prevents copying `node_modules` into build context.

### 4. Port Confusion
- `EXPOSE` in Dockerfile = documentation only
- `-p 3000:3000` in docker run = actual port mapping
- `ports:` in docker-compose.yml = actual port mapping

---

## Challenge Yourself

Once you've built a working Dockerfile, try:

1. **Add a development Dockerfile** (`Dockerfile.dev`) with hot-reload
2. **Compare image sizes** between multi-stage and single-stage
3. **Add nginx** as a reverse proxy (like your Flask example!)
4. **Scale the app** with multiple replicas behind nginx

---

## Solution Hint Structure

Your final Dockerfile should look something like this:

```dockerfile
FROM node:???-alpine AS ???
WORKDIR ???
COPY package*.json ./
RUN ???
COPY . .
# Add security, healthcheck, etc.
EXPOSE ???
CMD [???, ???]
```

**Don't look at the solution until you've tried! The struggle is where the learning happens.** 💪

Good luck! You've got this. The pattern is the same as your Flask app, just different commands and runtime.
