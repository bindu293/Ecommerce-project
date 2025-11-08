// AI Routes
// Defines all AI-powered feature endpoints

const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  generateDescription,
} = require('../controllers/aiController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Public route for recommendations (works without auth)
router.get('/recommendations', getRecommendations);
// Protected route for generating descriptions
router.post('/generate-description', authenticateUser, generateDescription);

module.exports = router;
