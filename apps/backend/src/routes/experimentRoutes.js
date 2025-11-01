const express = require('express');
const router = express.Router();
const {
  createExperiment,
  getAllExperiments,
  getExperimentById,
  updateExperimentStatus,
  updateExperiment,
  deleteExperiment,
} = require('../controllers/experimentController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// POST /api/v1/experiments - Create new experiment
router.post('/', createExperiment);

// GET /api/v1/experiments - Get all experiments
router.get('/', getAllExperiments);

// GET /api/v1/experiments/:id - Get experiment by ID
router.get('/:id', getExperimentById);

// PUT /api/v1/experiments/:id - Update experiment
router.put('/:id', updateExperiment);

// PUT /api/v1/experiments/:id/status - Update experiment status
router.put('/:id/status', updateExperimentStatus);

// DELETE /api/v1/experiments/:id - Soft delete experiment
router.delete('/:id', deleteExperiment);

module.exports = router;
