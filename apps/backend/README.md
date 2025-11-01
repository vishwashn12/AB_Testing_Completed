# Backend - A/B Testing Platform

## Overview
Backend service for the A/B Testing Platform built with Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB
- npm >= 9.0.0

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

### Running the Application
```bash
# Development mode
npm run dev

# Production mode
npm start

# Seed database with sample data
npm run seed
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Generate coverage report
npm run test:coverage
```

### Linting
```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## Project Structure
```
src/
├── app.js              # Express app configuration
├── index.js            # Entry point
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── scripts/            # Utility scripts
└── utils/              # Helper utilities

tests/
├── setup.js            # Test configuration
└── unit/               # Unit tests
```

## API Documentation
See the main README.md for API endpoints and usage.

## Contributing
Please follow the coding standards and run tests before submitting PRs.
