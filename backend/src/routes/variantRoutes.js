const express = require('express');
const router = express.Router();
const {
  createVariant,
  getVariantsByExperiment,
  getVariantById,
  updateVariantAllocation,
  updateVariant,
  deleteVariant,
} = require('../controllers/variantController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// POST /api/v1/variants - Create new variant
router.post('/', createVariant);

// GET /api/v1/variants/experiment/:experimentId - Get variants by experiment
router.get('/experiment/:experimentId', getVariantsByExperiment);

// GET /api/v1/variants/:id - Get variant by ID
router.get('/:id', getVariantById);

// PUT /api/v1/variants/:id - Update variant
router.put('/:id', updateVariant);

// PUT /api/v1/variants/:id/allocation - Update variant allocation
router.put('/:id/allocation', updateVariantAllocation);

// DELETE /api/v1/variants/:id - Delete variant
router.delete('/:id', deleteVariant);

module.exports = router;
