# Frontend - A/B Testing Platform

## Overview
Frontend application for the A/B Testing Platform built with React, Vite, and Tailwind CSS.

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
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

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Linting
```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix

# Format code
npm run format
```

## Project Structure
```
src/
├── App.jsx             # Main App component
├── main.jsx            # Entry point
├── index.css           # Global styles
├── components/         # Reusable components
├── pages/              # Page components
├── services/           # API services
└── assets/             # Static assets

public/                 # Public static files
```

## Features
- Modern React with Hooks
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Recharts for data visualization
- Zustand for state management

## Contributing
Please follow the coding standards and run tests before submitting PRs.
