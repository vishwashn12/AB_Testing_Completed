# A/B Testing Platform - MERN Stack

## 📋 Project Overview

A comprehensive **A/B Testing platform** built with MERN stack (MongoDB, Express.js, React, Node.js) following industry-standard software engineering practices. This MVP enables controlled experimentation with exactly **two variants (A and B)** per experiment, focusing on accurate tracking, secure APIs, and data-driven decision-making.

### Key Features
- ✅ **Classic A/B Testing** - Exactly 2 variants per experiment (Variant A vs Variant B)
- ✅ **Deterministic Assignment** - Consistent user bucketing using hashing algorithms
- ✅ **Real-time Analytics** - Conversion rates, exposure tracking, and performance metrics
- ✅ **Secure JWT Authentication** - Protected admin APIs with HTTPS support
- ✅ **Automated CI/CD** - GitHub Actions pipeline with ZIP artifact deployment
- ✅ **Privacy-First** - User ID anonymization before storage

### MVP Timeline
- **Sprint 1 (Weeks 1-2)**: Experiment CRUD + A/B Variant Management + JWT Auth + HTTPS
- **Sprint 2 (Weeks 3-4)**: Tracking & Analytics + API Consistency + Performance Optimization

### Team Members
- **Dev 1** - Backend Core (Experiment + A/B Variant APIs, Validation)
- **Dev 2** - Analytics & DB Operations (Tracking, Conversion Metrics, Aggregations)
- **Dev 3** - Integration & Security (API Consolidation, JWT, HTTPS)
- **Dev 4** - Deployment & CI/CD (GitHub Actions, ZIP Artifact, Testing)

### Project Duration
- **Sprint 1**: Weeks 1-2 (US-01 to US-08, US-19, US-20)
- **Sprint 2**: Weeks 3-4 (US-10 to US-13, US-15, US-16, US-21 to US-23)

---

## 🏗️ Architecture

### Tech Stack
- **Backend**: Node.js 18+, Express.js 4.x, MongoDB 6.x, Mongoose
- **Frontend**: React 18, Vite 5, Tailwind CSS 3.x
- **Authentication**: JWT (jsonwebtoken)
- **Testing**: Jest, Supertest, Cypress
- **DevOps**: PM2, GitHub Actions, CI/CD Pipelines

### Project Structure
```
ab-testing-platform/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database, JWT config
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers, hash functions
│   │   ├── scripts/        # Seed data, utilities
│   │   └── app.js          # Express app setup
│   ├── tests/              # Test suites
│   │   ├── unit/           # Unit tests
│   │   ├── integration/    # API tests
│   │   └── system/         # E2E tests
│   ├── package.json
│   └── .env.example
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   ├── hooks/          # Custom hooks
│   │   └── App.jsx
│   ├── cypress/            # E2E tests
│   ├── package.json
│   └── vite.config.js
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml       # CI/CD pipeline
│   └── PULL_REQUEST_TEMPLATE.md
├── SETUP_GUIDE.md
├── GIT_WORKFLOW.md
├── JIRA_GUIDE.md
├── SSL_SETUP_GUIDE.md
└── README.md
```

---

## 🚀 CI/CD Pipeline

Our GitHub Actions pipeline implements **5 critical stages** to ensure code quality:

### Pipeline Stages

#### 1. **Build Stage** 🔨
- Installs all dependencies from `package.json`
- Compiles TypeScript (if applicable)
- Verifies no build errors
- **Success Criteria**: Clean dependency installation

#### 2. **Test Stage** ✅
- Runs **Unit Tests**: Individual function/module testing
- Runs **Integration Tests**: API endpoint testing with Supertest
- Runs **System Tests**: End-to-end workflows with Cypress
- **Success Criteria**: All tests pass (0 failures)

#### 3. **Coverage Stage** 📊
- Measures code coverage using Jest
- Generates HTML coverage report
- **Quality Gate**: ≥ **75% code coverage**
- Reports saved as artifacts
- **Command**: `npm run test:coverage`

#### 4. **Lint Stage** 🔍
- Static code analysis with ESLint
- Checks code style and best practices
- **Quality Gate**: ESLint score with **0 errors, < 10 warnings**
- **Command**: `npm run lint`
- **Threshold**: Must pass for merge

#### 5. **Security Stage** 🔒
- Vulnerability scanning with `npm audit`
- Dependency security check
- **Quality Gate**: No critical vulnerabilities
- Security report saved as artifact
- **Command**: `npm audit --audit-level=high`

### Deployment Artifact

After all stages pass, pipeline creates a **deployment package** containing:
- ✅ Source code (backend + frontend)
- ✅ Coverage report (HTML)
- ✅ Lint report (JSON)
- ✅ Security scan report (JSON)
- ✅ Documentation (README, guides)
- ✅ Setup instructions

**Download**: Available in GitHub Actions → Artifacts section → `deployment-package.zip`

---

## 💻 Running Locally

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB 6+ (local or Atlas)
- Git

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your MongoDB URI:
# MONGODB_URI=mongodb://localhost:27017/ab-testing
# JWT_SECRET=your-secret-key-here
# PORT=5000

# Seed the database with sample data
npm run seed

# Start development server
npm run dev

# Run tests
npm test

# Check coverage
npm run test:coverage

# Run linter
npm run lint

# Security scan
npm audit
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run Cypress E2E tests
npm run test:e2e

# Build for production
npm run build
```

### Local Development Setup

For detailed setup instructions, see **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**

```bash
# Quick start (after cloning repository)

# 1. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed     # Populate database with sample data
npm run dev      # Start backend on port 5000

# 2. Frontend setup (in new terminal)
cd frontend
npm install
npm run dev      # Start frontend on port 5174

# 3. Access application
# Backend: http://localhost:5000
# Frontend: http://localhost:5174
```

### Sample Data

The seed script (`npm run seed`) creates:
- 2 users (admin@abtest.com / user@abtest.com)
- 4 experiments (Homepage CTA, Pricing Layout, Checkout Flow, Email Subject)
- **6 variants total** (2 per experiment: Variant A and Variant B)
- ~190 sample events (exposures and conversions)
- Each experiment follows strict **A/B testing paradigm** (50/50 or custom split)

**Login Credentials**:
```
Email: admin@abtest.com
Password: Admin123!
```

**💡 A/B Testing Structure**:
- Each experiment has exactly **2 variants**: Variant A (Control) and Variant B (Treatment)
- Traffic allocation must sum to 100%
- Users are deterministically assigned to A or B based on hashed user ID

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
All endpoints (except health check) require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### **Experiment Management**
```http
POST   /api/v1/experiments              # Create experiment (US-01)
GET    /api/v1/experiments              # List experiments (US-04)
GET    /api/v1/experiments/:id          # Get experiment
PUT    /api/v1/experiments/:id/status   # Update status (US-02)
DELETE /api/v1/experiments/:id          # Soft delete (US-03)
```

#### **Variant Management**
```http
POST   /api/v1/variants                 # Add variants (US-06)
GET    /api/v1/variants/:experimentId   # List variants
PUT    /api/v1/variants/:id/allocation  # Update allocation (US-07)
```

#### **User Assignment**
```http
POST   /api/v1/assignment               # Get user variant (US-08)
```

#### **Tracking & Analytics**
```http
POST   /api/v1/events/exposure          # Log exposure (US-10)
POST   /api/v1/events/conversion        # Track conversion (US-11)
GET    /api/v1/analytics/:experimentId  # Get metrics (US-12, US-13)
```

#### **Authentication**
```http
POST   /api/v1/auth/login               # Login (US-19)
POST   /api/v1/auth/register            # Register
```

### Example Request

```bash
# Create experiment
curl -X POST http://localhost:5000/api/v1/experiments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Homepage CTA Test",
    "description": "Testing button colors",
    "status": "draft"
  }'
```

---

## 🧪 Testing

### Test Organization

```
tests/
├── unit/                    # Function-level tests
│   ├── test_experiment_model.test.js
│   ├── test_variant_validation.test.js
│   └── test_hash_assignment.test.js
├── integration/             # API endpoint tests
│   ├── test_experiment_api.test.js
│   ├── test_analytics_api.test.js
│   └── test_auth_flow.test.js
└── system/                  # End-to-end workflows
    ├── test_complete_experiment_lifecycle.test.js
    └── test_user_assignment_journey.test.js
```

### Running Tests

```bash
# All tests
npm test

# Watch mode (during development)
npm run test:watch

# Specific test file
npm test -- test_experiment_model.test.js

# Coverage report
npm run test:coverage
# Open: coverage/index.html in browser
```

### Coverage Requirements
- **Overall**: ≥ 75% (enforced by CI)
- **Critical modules**: ≥ 60% (models, controllers)
- **Focus areas**: Business logic, validation, security

---

## 🔒 Security

### Security Measures (US-19, US-20, US-21)

1. **JWT Authentication**
   - Token expiry: 24 hours
   - Password hashing: bcrypt (10 rounds)
   - Secure token storage

2. **HTTPS Support**
   - Development: Self-signed certificates
   - Production: Let's Encrypt or commercial certificates
   - See **[SSL_SETUP_GUIDE.md](./SSL_SETUP_GUIDE.md)** for detailed instructions

3. **Data Privacy**
   - User IDs hashed (SHA-256) before storage
   - No PII in logs
   - MongoDB field-level encryption ready

4. **Input Validation**
   - Request sanitization (express-validator)
   - MongoDB injection prevention
   - Rate limiting: 100 req/15min per IP

### SSL/HTTPS Configuration

For detailed SSL setup instructions (development and production), see:
- **[SSL_SETUP_GUIDE.md](./SSL_SETUP_GUIDE.md)**

Quick summary:
- **Development**: Use HTTP (ENABLE_HTTPS=false) or generate self-signed certificate
- **Production**: Use Let's Encrypt (free) or commercial SSL certificate

---

## 📈 Performance

### Performance Optimizations (US-22, US-23)

- **Response Time**: < 2 seconds (target)
- **Database Indexes**:
  - `experiments`: name (unique), status
  - `variants`: experiment_id, allocation
  - `events`: user_id, experiment_id, timestamp
- **Connection Pooling**: Max 50 connections
- **Compression**: gzip for API responses
- **Memory**: Optimized for standard deployment

### Monitoring

```bash
# Check API performance
npm run benchmark

# Memory usage
node --trace-gc server.js

# Generate performance report
npm run performance
```

---

## 🔄 Git Workflow

### Branch Strategy

```
main (protected)
├── feature/us-01-create-experiment      # Dev 1
├── feature/us-06-add-variants           # Dev 1
├── feature/us-10-log-exposure           # Dev 2
├── feature/us-12-conversion-rate        # Dev 2
├── feature/us-15-api-consolidation      # Dev 3
├── feature/us-19-jwt-auth               # Dev 3
└── feature/us-22-performance            # Dev 4
```

### Branch Naming Convention
```
feature/<user-story-id>-<brief-description>

Examples:
✅ feature/us-01-create-experiment
✅ feature/us-08-deterministic-assignment
❌ abhishek-branch
❌ final-code
```

### Commit Messages

**Format**: `<type>: <description> (US-XX)`

```bash
# Good examples
✅ feat: Add POST /experiments endpoint (US-01)
✅ fix: Validate allocation sums to 100% (US-07)
✅ test: Add unit tests for hash assignment (US-08)
✅ docs: Update API documentation for analytics
✅ refactor: Extract validation middleware

# Bad examples
❌ Update code
❌ Fixed bug
❌ Changes
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/us-01-create-experiment
   ```

2. **Commit Changes** (2-3 commits per day when working)
   ```bash
   git add .
   git commit -m "feat: Implement experiment Mongoose model (US-01)"
   ```

3. **Push to Remote**
   ```bash
   git push origin feature/us-01-create-experiment
   ```

4. **Create PR** (use template in `.github/PULL_REQUEST_TEMPLATE.md`)
   - Link to Jira ticket (US-XX)
   - Describe changes
   - List test coverage
   - Request review from teammate

5. **Review & Merge**
   - At least 1 peer review required
   - All CI checks must pass
   - Resolve conflicts if any
   - Squash and merge

---

## 📦 Deployment

### CI/CD Deployment Package

The GitHub Actions pipeline automatically creates a deployment package containing:
- Complete source code (backend + frontend)
- Quality reports (coverage, lint, security)
- Documentation and setup guides
- Deployment instructions

**To deploy:**
1. Download `deployment-package.zip` from GitHub Actions artifacts
2. Extract on your server
3. Follow instructions in `DEPLOYMENT_INFO.txt`

### Manual Deployment

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed deployment instructions.

### Environment Variables (Production)

```bash
# .env.production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ab-testing
JWT_SECRET=<strong-random-secret>
ENABLE_HTTPS=true
SSL_CERT_PATH=/etc/ssl/cert.pem
SSL_KEY_PATH=/etc/ssl/key.pem
```

For SSL certificate setup, see **[SSL_SETUP_GUIDE.md](./SSL_SETUP_GUIDE.md)**

---

## 🎯 Sprint Goals

### Sprint 1 (Weeks 1-2) ✅

**Goal**: Core experiment and variant management with authentication

**User Stories**:
- US-01 to US-04: Experiment CRUD
- US-06 to US-08: Variant management + assignment
- US-19, US-20: JWT auth + HTTPS

**Deliverables**:
- Working experiment API
- Variant allocation system
- Secure authentication
- 60%+ test coverage

### Sprint 2 (Weeks 3-4) 🎯

**Goal**: Analytics, API standardization, and production readiness

**User Stories**:
- US-10 to US-13: Event tracking + metrics
- US-15, US-16: API consistency
- US-21 to US-23: Privacy + performance + deployment

**Deliverables**:
- Full analytics pipeline
- 75%+ test coverage
- Deployment artifact
- Production-ready system

---

## 📊 Quality Metrics

### Current Status
- ✅ Code Coverage: **TBD** (Target: ≥75%)
- ✅ ESLint Score: **TBD** (Target: 0 errors)
- ✅ Security Audit: **TBD** (Target: 0 critical)
- ✅ API Response Time: **TBD** (Target: <2s)

### Quality Gates
| Metric | Threshold | Status |
|--------|-----------|--------|
| Test Coverage | ≥75% | 🔄 Pending |
| Lint Score | 0 errors, <10 warnings | 🔄 Pending |
| Security Vulnerabilities | 0 critical | 🔄 Pending |
| API Response Time | <2 seconds | 🔄 Pending |
| Build Success Rate | ≥60% | 🔄 Pending |

---

## 🤝 Contributing

### For Team Members

1. **Pick a User Story** from Jira backlog
2. **Create Feature Branch** following naming convention
3. **Implement + Test** simultaneously (TDD approach)
4. **Create PR** using template
5. **Request Review** from teammate
6. **Address Feedback** and merge

### Code Review Checklist

- [ ] Code follows ESLint rules
- [ ] All tests pass locally
- [ ] Test coverage added for new code
- [ ] API documentation updated
- [ ] No console.logs or debug code
- [ ] Error handling implemented
- [ ] Security considerations addressed

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB is running
mongosh

# Update MONGODB_URI in .env
MONGODB_URI=mongodb://localhost:27017/ab-testing
```

**Port Already in Use**
```bash
# Kill process on port 5000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Alternative: Change PORT in .env
PORT=5001
```

**Tests Failing**
```bash
# Clear Jest cache
npm run test -- --clearCache

# Run specific test
npm test -- test_experiment_model.test.js --verbose
```

**CI Pipeline Failing**
```bash
# Run pipeline checks locally
npm run lint
npm run test:coverage
npm audit
```

---

## 📚 Additional Resources

### Learning Materials
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Jest Testing Guide](https://jestjs.io/docs/getting-started)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

### Related Documentation
- [Jira Board](https://your-team.atlassian.net) - Sprint tracking
- [Architecture Diagram](./docs/architecture.md) - System design
- [API Postman Collection](./docs/postman_collection.json) - API testing

---

## 📞 Contact

### Team Communication
- **Slack Channel**: #ab-testing-team
- **Daily Standup**: 10:00 AM (15 mins)
- **Sprint Review**: End of Week 2 & Week 4
- **TA Office Hours**: [Schedule Link]

### Issue Reporting
- **Blockers**: Tag @team-lead in Jira
- **CI/CD Issues**: Create issue with `ci-cd` label
- **Security Concerns**: Direct message to Dev 3

---

## 📄 License

This project is part of Software Engineering course evaluation.  
© 2025 A/B Testing Team. All rights reserved.

---

**Last Updated**: October 28, 2025  
**Version**: 1.0.0  
**Sprint**: Sprint 1 (Week 1)
