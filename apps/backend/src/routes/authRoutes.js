const express = require('express');
const router = express.Router();
const {
  login,
  register,
  getCurrentUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/v1/auth/login - User login
router.post('/login', login);

// POST /api/v1/auth/register - User registration
router.post('/register', register);

// GET /api/v1/auth/me - Get current user (requires auth)
router.get('/me', protect, getCurrentUser);

module.exports = router;
