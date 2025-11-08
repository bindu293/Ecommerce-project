// Order Routes
// Defines all order-related API endpoints

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// All order routes require authentication
router.use(authenticateUser);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
