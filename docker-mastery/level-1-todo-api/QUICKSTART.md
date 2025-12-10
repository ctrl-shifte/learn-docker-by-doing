# Quick Start Guide

## What You Need to Do

1. **Create a Dockerfile** in this directory (todo-api/)
2. Follow the challenge in README.md
3. Build and test your Docker image

## The Challenge

Answer these 4 questions, then write the Dockerfile:

1. **What runtime?** → Node.js (what version? what base image?)
2. **What to build?** → `npm install` the dependencies
3. **What to run?** → Just the installed node_modules + code
4. **How to start?** → `node server.js`

## Your Dockerfile Structure

```dockerfile
FROM ???
WORKDIR ???
COPY ??? ???
RUN ???
COPY ??? ???
EXPOSE ???
CMD ???
```

## Test Commands

```bash
# Build
docker build -t todo-api:v1 .

# Run everything
docker-compose up -d

# Test
curl http://localhost:3000/health
curl http://localhost:3000/todos

# Check logs
docker-compose logs app

# Stop
docker-compose down
```

## Files in This Project

- `package.json` - Node.js dependencies (look here for clues!)
- `server.js` - Express API application
- `init.sql` - PostgreSQL initialization
- `docker-compose.yml` - Multi-container setup (already done)
- `.dockerignore` - Files to exclude from build
- `README.md` - Full challenge with hints
- `Dockerfile.solution` - Solution (DON'T PEEK until you try!)

## Need Help?

Compare your approach to your Flask Dockerfile:

**Your Flask version:**
```dockerfile
FROM python:3.11-alpine
WORKDIR /app
COPY . .
RUN pip install flask redis
EXPOSE 5001
CMD ["python", "app.py"]
```

**Node.js equivalent (fill in the blanks):**
```dockerfile
FROM node:???
WORKDIR /app
COPY ??? ./          # What defines dependencies?
RUN npm ???          # How to install them?
COPY ??? .           # What's left to copy?
EXPOSE ???           # What port?
CMD [???, ???]       # How to start?
```

**You've got this!** The pattern is identical, just different tools.
