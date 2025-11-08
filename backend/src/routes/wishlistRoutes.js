// Wishlist Routes
const express = require('express');
const { authenticateUser: protect } = require('../middlewares/authMiddleware');
const {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Wishlist routes
router.get('/', getUserWishlist);              // Get user's wishlist
router.post('/add', addToWishlist);           // Add product to wishlist
router.delete('/remove/:productId', removeFromWishlist); // Remove product from wishlist
router.get('/check/:productId', isInWishlist); // Check if product is in wishlist

module.exports = router;