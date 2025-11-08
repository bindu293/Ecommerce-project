// Order Controller
// Handles order creation, retrieval, and status updates

const { admin, db } = require('../../config/firebase');
const { sendOrderConfirmationEmail } = require('../services/emailService');

/**
 * Create Order (Checkout)
 * Creates a new order from cart items and sends confirmation email
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { shippingAddress, paymentMethod } = req.body;

    // Validate input
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        message: 'Shipping address and payment method are required' 
      });
    }

    // Get user's cart
    const cartDoc = await db.collection('carts').doc(userId).get();
    
    if (!cartDoc.exists || !cartDoc.data().items || cartDoc.data().items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    const cartItems = cartDoc.data().items;

    // Calculate total
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 10; // Fixed shipping
    const total = subtotal + tax + shipping;

    // Get user info (fallback to authenticated token if user doc missing)
    const userDoc = await db.collection('users').doc(userId).get();
    let userData = userDoc.exists ? userDoc.data() : null;
    const userEmail = userData?.email || req.user?.email || '';
    const userName = userData?.name || 'Valued Customer';

    // Create order object
    const orderData = {
      userId,
      userEmail,
      userName,
      items: cartItems,
      shippingAddress,
      paymentMethod,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order to Firestore
    const orderRef = await db.collection('orders').add(orderData);

    // Update product stock
    for (const item of cartItems) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await productRef.get();
      
      if (productDoc.exists) {
        const currentStock = productDoc.data().stock;
        await productRef.update({
          stock: currentStock - item.quantity,
        });
      }
    }

    // Clear cart
    await db.collection('carts').doc(userId).update({
      items: [],
      updatedAt: new Date().toISOString(),
    });

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(userEmail, {
        orderId: orderRef.id,
        userName,
        items: cartItems,
        total: total.toFixed(2),
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order if email fails
    }

    // Update user purchase history
    try {
      await db.collection('users').doc(userId).set({
        purchase_history: admin.firestore.FieldValue.arrayUnion(orderRef.id),
        email: userEmail,
        name: userName,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Failed updating user purchase history:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: orderRef.id,
        ...orderData,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating order', 
      error: error.message 
    });
  }
};

/**
 * Get User's Orders
 * Returns order history for authenticated user with advanced filtering
 */
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { status, startDate, endDate, limit = 50, page = 1 } = req.query;

    let ordersRef = db.collection('orders').where('userId', '==', userId);

    // Apply status filter
    if (status && status !== 'all') {
      ordersRef = ordersRef.where('status', '==', status);
    }

    // Apply date range filter
    if (startDate) {
      ordersRef = ordersRef.where('createdAt', '>=', new Date(startDate).toISOString());
    }
    if (endDate) {
      ordersRef = ordersRef.where('createdAt', '<=', new Date(endDate).toISOString());
    }

    // Get total count for pagination
    const totalSnapshot = await ordersRef.get();
    const totalCount = totalSnapshot.size;

    // Apply pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const offset = (pageNum - 1) * limitNum;

    // Get paginated orders
    const ordersSnapshot = await ordersRef
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limitNum)
      .get();

    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
};

/**
 * Get Single Order by ID
 */
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const orderDoc = await db.collection('orders').doc(id).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const orderData = orderDoc.data();

    // Check if order belongs to user
    if (orderData.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.status(200).json({
      success: true,
      data: { id: orderDoc.id, ...orderData },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order', 
      error: error.message 
    });
  }
};

/**
 * Update Order Status
 * Admin only - updates order status (pending, processing, shipped, delivered)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    // Check if order exists
    const orderDoc = await db.collection('orders').doc(id).get();
    
    if (!orderDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Update order status
    await db.collection('orders').doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated',
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating order', 
      error: error.message 
    });
  }
};

/**
 * Get Order Statistics
 * Returns order statistics for the authenticated user
 */
const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get all orders for user
    const ordersSnapshot = await db.collection('orders')
      .where('userId', '==', userId)
      .get();

    let totalOrders = 0;
    let totalSpent = 0;
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      totalOrders++;
      totalSpent += order.total || 0;
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status]++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        averageOrderValue: totalOrders > 0 ? parseFloat((totalSpent / totalOrders).toFixed(2)) : 0,
        statusCounts
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};
module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
};
