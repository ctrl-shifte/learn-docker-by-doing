# 🔥 LEVEL 3: E-Commerce Microservices Platform

## 🏆 Challenge Overview

Build a **production-grade microservices e-commerce platform** with 9+ services across 3 programming languages.

**Time Estimate:** 8-15 hours  
**Difficulty:** ⭐⭐⭐ Advanced / Beast Mode

---

## 🎯 System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        NGINX (API Gateway)                    │
│                         Port 80/443                           │
└───────────┬──────────────────────────────────────────────────┘
            │
            ├─── /api/users  ────→  User Service (Go)
            ├─── /api/products ──→  Product Service (Node.js)
            ├─── /api/orders  ───→  Order Service (Python)
            ├─── /api/payments ──→  Payment Service (Node.js)
            └─── /*  ────────────→  Frontend (React)
                    │
                    ├─── PostgreSQL (Users DB)
                    ├─── MongoDB (Products DB)
                    ├─── PostgreSQL (Orders DB)
                    ├─── Redis (Cache + Sessions)
                    └─── RabbitMQ (Message Queue)
```

---

## 📦 Services Overview

| # | Service | Language | Database | Purpose |
|---|---------|----------|----------|---------|
| 1 | **User Service** | Go | PostgreSQL | Authentication, user management |
| 2 | **Product Service** | Node.js | MongoDB | Product catalog, inventory |
| 3 | **Order Service** | Python | PostgreSQL | Order processing, history |
| 4 | **Payment Service** | Node.js | PostgreSQL | Payment processing (mock) |
| 5 | **Frontend** | React | - | Customer-facing web app |
| 6 | **API Gateway** | Nginx | - | Reverse proxy, load balancing, SSL |
| 7 | **PostgreSQL** | - | - | Relational data (users, orders, payments) |
| 8 | **MongoDB** | - | - | Document storage (products) |
| 9 | **Redis** | - | - | Caching, session storage |
| 10 | **RabbitMQ** | - | - | Message queue for async tasks |

---

## 🎓 What You'll Master

### Core Docker Skills
- ✅ **Polyglot microservices** (Go, Python, Node.js)
- ✅ **Multi-stage builds** for compiled languages (Go)
- ✅ **Service discovery** via Docker networking
- ✅ **Database per service** pattern
- ✅ **Message-driven architecture** with RabbitMQ
- ✅ **API Gateway** pattern with Nginx
- ✅ **Health checks** and startup dependencies
- ✅ **Logging** strategies across services
- ✅ **Security** hardening (non-root, secrets)
- ✅ **Production deployment** patterns

### Architecture Patterns
- ✅ **Microservices** architecture
- ✅ **Event-driven** communication
- ✅ **CQRS** basics (Command Query Responsibility Segregation)
- ✅ **Service mesh** concepts
- ✅ **Circuit breaker** patterns
- ✅ **Distributed tracing** ready

---

## 🎯 Your Mission

### Phase 1: Understand the Architecture (30-60 min)
- Read the architecture document
- Understand service boundaries
- Study the API contracts
- Review the message queue flows

### Phase 2: Build Service Dockerfiles (4-6 hours)
Build Dockerfiles for each service:

1. **User Service (Go)** - Most complex!
   - Multi-stage: build with Go SDK → runtime with minimal image
   - CGO disabled for static binary
   - Distroless or scratch image
   - Target size: 10-20MB

2. **Product Service (Node.js)**
   - Multi-stage: deps install → production runtime
   - Alpine-based
   - Target size: 150-200MB

3. **Order Service (Python)**
   - Multi-stage: deps install → runtime
   - Alpine-based with pip
   - Target size: 150-200MB

4. **Payment Service (Node.js)**
   - Similar to Product Service
   - Target size: 150-200MB

5. **Frontend (React)**
   - Multi-stage: build → nginx serve
   - Target size: 20-40MB

### Phase 3: Database Initialization (1-2 hours)
- PostgreSQL init scripts for Users, Orders, Payments
- MongoDB init script for Products
- Database migrations strategy

### Phase 4: Message Queue Integration (1-2 hours)
- RabbitMQ setup
- Queue consumers in services
- Event publishing patterns

### Phase 5: API Gateway Configuration (1 hour)
- Nginx routing rules
- Load balancing
- SSL configuration (optional)
- Rate limiting (optional)

### Phase 6: Docker Compose Orchestration (2-3 hours)
- Production compose file
- Development compose file
- Service dependencies
- Network configuration
- Volume management
- Environment variables

### Phase 7: Testing & Optimization (1-2 hours)
- End-to-end user flow testing
- Performance testing
- Image size optimization
- Security hardening

---

## 📁 Project Structure

```
level-3-ecommerce/
├── services/
│   ├── user-service/           # Go microservice
│   │   ├── main.go
│   │   ├── go.mod
│   │   ├── Dockerfile          ⚠️ YOU BUILD
│   │   └── Dockerfile.dev      ⚠️ YOU BUILD
│   ├── product-service/        # Node.js microservice
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile          ⚠️ YOU BUILD
│   │   └── Dockerfile.dev      ⚠️ YOU BUILD
│   ├── order-service/          # Python microservice
│   │   ├── app/
│   │   ├── requirements.txt
│   │   ├── Dockerfile          ⚠️ YOU BUILD
│   │   └── Dockerfile.dev      ⚠️ YOU BUILD
│   ├── payment-service/        # Node.js microservice
│   │   ├── src/
│   │   ├── package.json
│   │   ├── Dockerfile          ⚠️ YOU BUILD
│   │   └── Dockerfile.dev      ⚠️ YOU BUILD
│   └── frontend/               # React SPA
│       ├── src/
│       ├── package.json
│       ├── Dockerfile          ⚠️ YOU BUILD
│       └── Dockerfile.dev      ⚠️ YOU BUILD
├── databases/
│   ├── postgres/
│   │   ├── users-init.sql      ✅ PROVIDED
│   │   ├── orders-init.sql     ✅ PROVIDED
│   │   └── payments-init.sql   ✅ PROVIDED
│   └── mongo/
│       └── products-init.js    ✅ PROVIDED
├── gateway/
│   └── nginx.conf              ✅ PROVIDED (but you may customize)
├── docker-compose.yml          ⚠️ YOU BUILD
├── docker-compose.dev.yml      ⚠️ YOU BUILD
├── ARCHITECTURE.md             ✅ PROVIDED
└── README.md                   ✅ YOU'RE HERE
```

---

## 🔧 Technical Requirements

### User Service (Go)
- **Endpoints:**
  - `POST /api/users/register` - Create user
  - `POST /api/users/login` - Authenticate user
  - `GET /api/users/profile` - Get user profile
  - `PUT /api/users/profile` - Update profile
- **Database:** PostgreSQL
- **Features:** JWT authentication, password hashing

### Product Service (Node.js)
- **Endpoints:**
  - `GET /api/products` - List products
  - `GET /api/products/:id` - Get product details
  - `POST /api/products` - Create product (admin)
  - `PUT /api/products/:id` - Update product (admin)
  - `DELETE /api/products/:id` - Delete product (admin)
- **Database:** MongoDB
- **Features:** Caching with Redis, image URLs

### Order Service (Python)
- **Endpoints:**
  - `POST /api/orders` - Create order
  - `GET /api/orders/:id` - Get order details
  - `GET /api/orders/user/:userId` - Get user orders
  - `PUT /api/orders/:id/status` - Update order status
- **Database:** PostgreSQL
- **Features:** Message queue integration (RabbitMQ)

### Payment Service (Node.js)
- **Endpoints:**
  - `POST /api/payments` - Process payment
  - `GET /api/payments/:orderId` - Get payment status
- **Database:** PostgreSQL
- **Features:** Mock payment processing, webhook simulation

### Frontend (React)
- **Pages:**
  - Home / Product listing
  - Product details
  - Shopping cart
  - Checkout
  - User profile
  - Order history
- **Features:** Responsive design, state management

---

## 🚀 Getting Started Guide

### Step 1: Start Simple (User Service)
The User Service in Go is the most challenging. Start here:

1. **Understand Go multi-stage builds:**
   ```dockerfile
   # Stage 1: Build
   FROM golang:1.21-alpine AS builder
   # ... build static binary
   
   # Stage 2: Runtime
   FROM alpine:latest
   # or FROM scratch (even smaller!)
   # ... copy only the binary
   ```

2. **Key concepts:**
   - Static linking for portability
   - CGO_ENABLED=0 for pure Go binary
   - Distroless/scratch for minimal size
   - Health check endpoint

3. **Expected outcome:**
   - Binary size: ~10-15MB
   - Final image: 10-20MB total
   - No root user
   - Health check working

### Step 2: Node.js Services (Product & Payment)
Similar pattern to Level 2, but:
- More complex business logic
- Database connections
- Redis caching
- RabbitMQ integration

### Step 3: Python Service (Orders)
- Use Alpine Python
- Multi-stage for dependencies
- Virtual environment
- RabbitMQ consumer

### Step 4: Frontend
- Same as Level 2 pattern
- Environment variables for API Gateway URL

### Step 5: Orchestrate Everything
- Start services one by one
- Test each before adding next
- Use health checks and depends_on
- Verify message queue flows

---

## 🧪 Testing Strategy

### 1. Unit Testing (Per Service)
```bash
# Test User Service
curl -X POST http://localhost/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test Product Service
curl http://localhost/api/products

# Test Order Service
curl -X POST http://localhost/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2}'
```

### 2. Integration Testing (Full Flow)
1. Register user
2. Login (get JWT)
3. Browse products
4. Add to cart
5. Create order
6. Process payment
7. Check order status

### 3. Message Queue Testing
- Create an order
- Check RabbitMQ management UI (localhost:15672)
- Verify message was queued
- Verify Order Service consumed it

### 4. Load Testing (Optional)
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost/api/products

# Scale a service
docker-compose up -d --scale product-service=3
```

---

## 📊 Success Criteria

### Image Sizes
- **User Service (Go):** 10-20MB ⭐
- **Product Service (Node):** 150-200MB
- **Order Service (Python):** 150-200MB
- **Payment Service (Node):** 150-200MB
- **Frontend:** 20-40MB

### Build Times
- **First build:** 10-15 minutes (all services)
- **Rebuild (no changes):** 10-20 seconds
- **Rebuild (code change):** 30-60 seconds

### Functionality Checklist
- [ ] User registration works
- [ ] User login returns JWT
- [ ] Products load from MongoDB
- [ ] Product caching works (check Redis)
- [ ] Orders can be created
- [ ] Order message sent to RabbitMQ
- [ ] Payment processing works
- [ ] Frontend displays all data
- [ ] All health checks pass
- [ ] Services restart on failure
- [ ] Data persists after restart
- [ ] Message queue processes events

---

## 💡 Pro Tips

### Tip 1: Build Order Matters
Build in this order to minimize frustration:
1. Databases first (PostgreSQL, MongoDB, Redis)
2. User Service (get auth working)
3. Product Service (simpler, tests caching)
4. Order Service (adds message queue)
5. Payment Service (completes backend)
6. Frontend (ties it all together)

### Tip 2: Use Docker Networks
```yaml
networks:
  frontend-network:  # Frontend <-> API Gateway
  backend-network:   # Services <-> Databases
  queue-network:     # Services <-> RabbitMQ
```

### Tip 3: Health Checks Are Critical
Every service should have:
- `/health` endpoint
- Docker HEALTHCHECK
- depends_on: condition: service_healthy

### Tip 4: Logging Strategy
- Centralize logs with `docker-compose logs`
- Use structured logging (JSON)
- Include request IDs for tracing

### Tip 5: Security Checklist
- [ ] No root users in containers
- [ ] Secrets via environment variables
- [ ] Input validation in APIs
- [ ] CORS configured properly
- [ ] Rate limiting on API Gateway
- [ ] No credentials in images

---

## 🎖️ Bonus Challenges

### 🌟 Bronze: Basic Completion
- All services running
- Basic functionality working
- All Dockerfiles created

### 🥈 Silver: Production Ready
- Image sizes optimized
- Non-root users
- Health checks implemented
- Proper logging
- Environment variables managed

### 🥇 Gold: Advanced Features
- Add monitoring (Prometheus + Grafana)
- Add distributed tracing (Jaeger)
- Implement CI/CD pipeline
- Add rate limiting
- Implement circuit breakers
- Add load testing results

### 💎 Platinum: Expert Mode
- Kubernetes deployment (Helm charts)
- Service mesh (Istio/Linkerd)
- Complete observability stack
- Blue/green deployment
- Auto-scaling policies
- Disaster recovery plan

---

## 📚 Resources

### Docker
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Health checks](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Networks](https://docs.docker.com/network/)

### Go
- [Go Docker best practices](https://chemidy.medium.com/create-the-smallest-and-secured-golang-docker-image-based-on-scratch-4752223b7324)
- [Distroless images](https://github.com/GoogleContainerTools/distroless)

### Microservices
- [Microservices.io](https://microservices.io/)
- [12-Factor App](https://12factor.net/)

### Message Queues
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)

---

## 🆘 Need Help?

- **ARCHITECTURE.md** - Detailed architecture explanation
- **HINTS.md** - Progressive hints for each service
- **SOLUTION.md** - Complete solutions (try first!)
- **TROUBLESHOOTING.md** - Common issues and fixes

---

## 🏁 Let's Begin!

This is the final boss of Docker challenges. Take your time, build incrementally, and don't be afraid to break things. That's where the learning happens!

**Estimated time:** 8-15 hours  
**Coffee required:** ☕☕☕☕☕☕  
**Satisfaction level:** 🚀🚀🚀

Ready? Take a deep breath and start with the User Service!

Good luck, Docker Master! 💪🐳
