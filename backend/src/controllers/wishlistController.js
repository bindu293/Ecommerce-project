// Wishlist Controller
// Handles wishlist operations (add, remove, get)

const { db } = require('../../config/firebase');

/**
 * Get User's Wishlist
 * Returns all products in user's wishlist
 */
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.uid;

    const wishlistDoc = await db.collection('wishlists').doc(userId).get();
    
    if (!wishlistDoc.exists) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const wishlistData = wishlistDoc.data();
    const productIds = wishlistData.productIds || [];

    // Get product details for each product ID
    const products = [];
    for (const productId of productIds) {
      const productDoc = await db.collection('products').doc(productId).get();
      if (productDoc.exists) {
        products.push({
          id: productDoc.id,
          ...productDoc.data(),
          addedToWishlist: wishlistData.addedAt?.[productId] || new Date().toISOString()
        });
      }
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

/**
 * Add Product to Wishlist
 */
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const wishlistRef = db.collection('wishlists').doc(userId);
    const wishlistDoc = await wishlistRef.get();

    if (wishlistDoc.exists) {
      const wishlistData = wishlistDoc.data();
      const productIds = wishlistData.productIds || [];
      const addedAt = wishlistData.addedAt || {};

      if (productIds.includes(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Product already in wishlist'
        });
      }

      // Add product to wishlist
      await wishlistRef.update({
        productIds: [...productIds, productId],
        addedAt: {
          ...addedAt,
          [productId]: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      });
    } else {
      // Create new wishlist
      await wishlistRef.set({
        userId,
        productIds: [productId],
        addedAt: {
          [productId]: new Date().toISOString()
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    });
  }
};

/**
 * Remove Product from Wishlist
 */
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const wishlistRef = db.collection('wishlists').doc(userId);
    const wishlistDoc = await wishlistRef.get();

    if (!wishlistDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    const wishlistData = wishlistDoc.data();
    const productIds = wishlistData.productIds || [];
    const addedAt = wishlistData.addedAt || {};

    if (!productIds.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    // Remove product from wishlist
    const updatedProductIds = productIds.filter(id => id !== productId);
    const updatedAddedAt = { ...addedAt };
    delete updatedAddedAt[productId];

    await wishlistRef.update({
      productIds: updatedProductIds,
      addedAt: updatedAddedAt,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    });
  }
};

/**
 * Check if Product is in Wishlist
 */
const isInWishlist = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const wishlistDoc = await db.collection('wishlists').doc(userId).get();
    
    if (!wishlistDoc.exists) {
      return res.status(200).json({
        success: true,
        isInWishlist: false
      });
    }

    const wishlistData = wishlistDoc.data();
    const productIds = wishlistData.productIds || [];

    res.status(200).json({
      success: true,
      isInWishlist: productIds.includes(productId)
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist',
      error: error.message
    });
  }
};

module.exports = {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist
};