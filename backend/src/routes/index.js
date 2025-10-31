/**
 * US-15: API Routes Consolidation
 * Central routing file for all API v1 endpoints
 */

const express = require('express');

const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const experimentRoutes = require('./experimentRoutes');
const variantRoutes = require('./variantRoutes');
const eventRoutes = require('./eventRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const assignmentRoutes = require('./assignmentRoutes');

// API v1 Routes
router.use('/auth', authRoutes);
router.use('/experiments', experimentRoutes);
router.use('/variants', variantRoutes);
router.use('/events', eventRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/assignment', assignmentRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'A/B Testing API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      experiments: '/api/v1/experiments',
      variants: '/api/v1/variants',
      events: '/api/v1/events',
      analytics: '/api/v1/analytics',
      assignment: '/api/v1/assignment',
    },
  });
});

module.exports = router;
