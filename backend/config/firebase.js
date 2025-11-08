// Firebase Admin SDK Configuration
// Initializes Firebase Admin for backend operations (Firestore, Auth)

const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with service account credentials
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize the app only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

// Export Firestore and Auth instances
const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
