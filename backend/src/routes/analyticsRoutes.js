const express = require('express');
const router = express.Router();
const {
  getConversionRate,
  getSummaryMetrics,
  getDetailedAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// GET /api/v1/analytics/:experimentId/conversion-rate - Get conversion rates
router.get('/:experimentId/conversion-rate', getConversionRate);

// GET /api/v1/analytics/:experimentId/summary - Get summary metrics
router.get('/:experimentId/summary', getSummaryMetrics);

// GET /api/v1/analytics/:experimentId - Get detailed analytics
router.get('/:experimentId', getDetailedAnalytics);

module.exports = router;
