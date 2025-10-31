const express = require('express');
const router = express.Router();
const { getAssignment } = require('../controllers/assignmentController');

// PUBLIC ENDPOINT - No authentication required for end users
// POST /api/v1/assignment - Get variant assignment for user
router.post('/', getAssignment);

// GET /api/v1/assignment/:experimentId/:userId - Simple GET endpoint for easy integration
router.get('/:experimentId/:userId', async (req, res, next) => {
  // Convert GET params to POST body format
  req.body = {
    experimentId: req.params.experimentId,
    userId: req.params.userId
  };
  // Call the same controller
  return getAssignment(req, res, next);
});

module.exports = router;
