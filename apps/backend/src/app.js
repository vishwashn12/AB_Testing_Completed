const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Security Middleware (US-19, US-20)
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin requests
  crossOriginEmbedderPolicy: false
})); // Set security headers
app.use(cors({
  origin: true, // Allow all origins for local development
  credentials: true,
}));

// Rate Limiting (US-19)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 mins
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression Middleware (US-22)
if (process.env.ENABLE_COMPRESSION === 'true') {
  app.use(compression());
}

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'A/B Testing API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes (US-15)
app.use('/api/v1', routes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler (US-16)
app.use(errorHandler);

module.exports = app;
