// Database Seeding Script
// Run this script to populate Firestore with sample products
// Usage: node scripts/seedDatabase.js

require('dotenv').config();
const { db } = require('../config/firebase');
const sampleProducts = require('../utils/sampleData');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Add sample products
    console.log('Adding sample products...');
    for (const product of sampleProducts) {
      const productData = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await db.collection('products').add(productData);
      console.log(`✅ Added: ${product.name} (ID: ${docRef.id})`);
    }

    console.log(`\n✨ Successfully added ${sampleProducts.length} products!`);
    console.log('\n🎉 Database seeding completed!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
