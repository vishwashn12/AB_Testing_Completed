# A/B Testing Platform - Monorepo

[![CI/CD Pipeline](https://github.com/vishwashn12/AB_Testing_Completed/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/vishwashn12/AB_Testing_Completed/actions/workflows/ci-cd.yml)

## Overview
A comprehensive A/B Testing Platform built with the MERN stack (MongoDB, Express, React, Node.js) organized as a monorepo.

## Project Structure

```
PESU_RR_CSE_L_P78_A_B_Testing_Backend_EndPointOps/
├── .github/                    # GitHub configuration
│   ├── CODEOWNERS.txt          # Code owners
│   └── workflows/
│       └── ci-cd.yml           # CI/CD pipeline
├── apps/                       # Applications
│   ├── backend/                # Backend Express app
│   └── frontend/               # Frontend React app
├── packages/                   # Shared packages
│   └── shared/                 # Shared utilities
├── docs/                       # Documentation
│   └── CI-CD.md                # CI/CD documentation
├── .gitignore                  # Git ignore rules
├── package.json                # Root package.json (monorepo)
└── README.md                   # This file
```

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, Rate Limiting
- **Testing:** Jest, Supertest

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Testing:** Vitest, Testing Library

### Shared
- Common utilities and constants
- Shared validation logic
- Type definitions

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishwashn12/AB_Testing_Completed.git
   cd AB_Testing_Completed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Backend:
   ```bash
   cd apps/backend
   cp .env.example .env
   # Edit .env with your configuration
   ```
   
   Frontend:
   ```bash
   cd apps/frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the Application

#### Development Mode
```bash
# Run both frontend and backend
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend
```

#### Production Build
```bash
# Build both applications
npm run build

# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

### Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend
```

### Linting

```bash
# Lint all workspaces
npm run lint

# Lint backend
npm run lint --workspace=apps/backend

# Lint frontend
npm run lint --workspace=apps/frontend
```

## Workspace Scripts

### Root Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build all applications
- `npm test` - Run all tests
- `npm run lint` - Lint all code
- `npm run clean` - Clean all node_modules

### Backend Scripts
See `apps/backend/README.md` for detailed backend documentation.

### Frontend Scripts
See `apps/frontend/README.md` for detailed frontend documentation.

## Project Documentation

- [Backend Documentation](apps/backend/README.md)
- [Frontend Documentation](apps/frontend/README.md)
- [CI/CD Documentation](docs/CI-CD.md)

## Features

### Current Features
- ✅ User authentication and authorization
- ✅ Experiment management (CRUD operations)
- ✅ Variant creation and management
- ✅ User assignment to variants
- ✅ Event tracking
- ✅ Real-time analytics dashboard
- ✅ Responsive UI with Tailwind CSS
- ✅ Secure API with JWT authentication
- ✅ Rate limiting and security headers
- ✅ Comprehensive testing setup

### Planned Features
- [ ] Advanced statistical analysis
- [ ] Multi-variate testing
- [ ] Automated experiment scheduling
- [ ] Email notifications
- [ ] Advanced reporting and exports
- [ ] Role-based access control
- [ ] API documentation with Swagger

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Experiments
- `GET /api/experiments` - Get all experiments
- `GET /api/experiments/:id` - Get experiment by ID
- `POST /api/experiments` - Create new experiment
- `PUT /api/experiments/:id` - Update experiment
- `DELETE /api/experiments/:id` - Delete experiment

### Variants
- `GET /api/variants/experiment/:experimentId` - Get variants by experiment
- `POST /api/variants` - Create new variant
- `PUT /api/variants/:id` - Update variant
- `DELETE /api/variants/:id` - Delete variant

### Assignments
- `POST /api/assignments` - Assign user to variant
- `GET /api/assignments/:userId` - Get user assignments

### Events
- `POST /api/events` - Track event
- `GET /api/events/experiment/:experimentId` - Get events by experiment

### Analytics
- `GET /api/analytics/experiment/:experimentId` - Get experiment analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Code Quality Standards

- **Linting:** ESLint with Airbnb config
- **Formatting:** Prettier
- **Testing:** Minimum 70% code coverage
- **Commits:** Conventional commits format

## License
ISC

## Authors
A/B Testing Team

## Support
For support, please create an issue in the GitHub repository.

## Acknowledgments
- PESU University
- Course: Software Engineering
- Project: A/B Testing Platform
