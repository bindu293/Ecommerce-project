// Authentication Controller
// Handles user signup, login, and authentication logic

const { auth, db } = require('../../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Signup
 * Creates a new user in Firebase Auth and Firestore
 */
const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email, password, and name' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      name: name,
      createdAt: new Date().toISOString(),
      role: 'customer',
      browsing_history: [],
      purchase_history: [],
    });

    // Generate JWT token
    const token = jwt.sign(
      { uid: userRecord.uid, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token: token,
        user: {
          uid: userRecord.uid,
          email: email,
          name: name,
        },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error creating user', 
      error: error.message 
    });
  }
};

/**
 * User Login
 * Authenticates user and returns JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Get user from Firebase Auth
    const userRecord = await auth.getUserByEmail(email);

    // Note: Firebase Admin SDK doesn't support password verification directly
    // In production, you should verify password using Firebase Client SDK on frontend
    // or implement custom password verification
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();

    // Generate JWT token
    const token = jwt.sign(
      { uid: userRecord.uid, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: token,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          name: userData?.name || userRecord.displayName,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error logging in', 
      error: error.message 
    });
  }
};

/**
 * Get Current User Profile
 * Returns the authenticated user's information
 */
const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      data: {
        uid: userData.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

module.exports = { signup, login, getProfile };
