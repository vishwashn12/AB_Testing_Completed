const express = require('express');
const router = express.Router();
const {
  logExposure,
  trackConversion,
  getEventsByExperiment,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// PUBLIC ENDPOINTS - No auth required for end users to track events
// POST /api/v1/events/exposure - Log exposure event
router.post('/exposure', logExposure);

// POST /api/v1/events/conversion - Track conversion event
router.post('/conversion', trackConversion);

// PROTECTED ENDPOINT - Admins only
// GET /api/v1/events/experiment/:experimentId - Get events by experiment
router.get('/experiment/:experimentId', protect, getEventsByExperiment);

module.exports = router;
