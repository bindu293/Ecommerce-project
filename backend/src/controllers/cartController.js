// Cart Controller
// Manages shopping cart operations (add, update, remove items)

const { db } = require('../../config/firebase');

/**
 * Get User's Cart
 * Returns all items in the authenticated user's cart
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Get cart document for user
    const cartDoc = await db.collection('carts').doc(userId).get();

    if (!cartDoc.exists) {
      return res.status(200).json({
        success: true,
        data: {
          userId,
          items: [],
          total: 0,
        },
      });
    }

    const cartData = cartDoc.data();
    
    // Calculate total
    const total = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json({
      success: true,
      data: {
        userId,
        items: cartData.items,
        total: total.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching cart', 
      error: error.message 
    });
  }
};

/**
 * Add Item to Cart
 * Adds a new item or updates quantity if already exists
 */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required' 
      });
    }

    // Get product details
    const productDoc = await db.collection('products').doc(productId).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const productData = productDoc.data();

    // Check stock availability
    if (productData.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock' 
      });
    }

    // Get or create cart
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    let cartItems = [];
    if (cartDoc.exists) {
      cartItems = cartDoc.data().items || [];
    }

    // Check if item already in cart
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      // Update quantity
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cartItems.push({
        productId,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        quantity,
      });
    }

    // Save cart
    await cartRef.set({
      userId,
      items: cartItems,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: { items: cartItems },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding to cart', 
      error: error.message 
    });
  }
};

/**
 * Update Cart Item Quantity
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate input
    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid quantity is required' 
      });
    }

    // Get cart
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    let cartItems = cartDoc.data().items || [];
    
    // Find and update item
    const itemIndex = cartItems.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    cartItems[itemIndex].quantity = quantity;

    // Save cart
    await cartRef.update({
      items: cartItems,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: { items: cartItems },
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating cart', 
      error: error.message 
    });
  }
};

/**
 * Remove Item from Cart
 */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.params;

    // Get cart
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    let cartItems = cartDoc.data().items || [];
    
    // Filter out the item
    cartItems = cartItems.filter(item => item.productId !== productId);

    // Save cart
    await cartRef.update({
      items: cartItems,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { items: cartItems },
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing from cart', 
      error: error.message 
    });
  }
};

/**
 * Clear Cart
 * Removes all items from cart
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.uid;

    await db.collection('carts').doc(userId).set({
      userId,
      items: [],
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error clearing cart', 
      error: error.message 
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
