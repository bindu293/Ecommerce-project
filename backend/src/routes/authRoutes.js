// Authentication Routes
// Defines all auth-related API endpoints

const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateUser, getProfile);

module.exports = router;
