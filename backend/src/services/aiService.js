// AI Service
// Integrates Firebase AI for product recommendations and descriptions

/**
 * Get Product Recommendations
 * Uses simple collaborative filtering based on categories and user history
 * In production, integrate with Firebase Vertex AI or custom ML model
 */
const getProductRecommendations = async (allProducts, userData, currentProductId, limit = 6) => {
  try {
    let recommendations = [];

    // If viewing a specific product, recommend similar items from same category
    if (currentProductId) {
      const currentProduct = allProducts.find(p => p.id === currentProductId);
      
      if (currentProduct) {
        // Get products from same category
        recommendations = allProducts.filter(p => 
          p.id !== currentProductId && 
          p.category === currentProduct.category &&
          p.stock > 0
        );
      }
    }

    // Add recommendations based on browsing history
    if (userData?.browsing_history && userData.browsing_history.length > 0) {
      const browsedCategories = allProducts
        .filter(p => userData.browsing_history.includes(p.id))
        .map(p => p.category);

      const categoryRecommendations = allProducts.filter(p => 
        browsedCategories.includes(p.category) && 
        !userData.browsing_history.includes(p.id) &&
        p.stock > 0
      );

      recommendations = [...recommendations, ...categoryRecommendations];
    }

    // Add popular products (by rating)
    const popularProducts = allProducts
      .filter(p => p.stock > 0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));

    recommendations = [...recommendations, ...popularProducts];

    // Remove duplicates
    const uniqueRecommendations = Array.from(
      new Map(recommendations.map(item => [item.id, item])).values()
    );

    // Limit results
    return uniqueRecommendations.slice(0, limit);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Return random products as fallback
    return allProducts.filter(p => p.stock > 0).slice(0, limit);
  }
};

/**
 * Generate Product Description
 * Creates SEO-friendly, engaging product descriptions
 * In production, integrate with Firebase Vertex AI or OpenAI API
 */
const generateProductDescription = async (name, category, shortDescription = '') => {
  try {
    // Simple template-based generation
    // In production, use Firebase Vertex AI or OpenAI for better results
    
    const templates = {
      electronics: `Discover the ${name}, a premium ${category} product designed for modern living. ${shortDescription} This innovative device combines cutting-edge technology with user-friendly features, making it perfect for tech enthusiasts and everyday users alike. Experience superior performance, sleek design, and reliable functionality that exceeds expectations.`,
      
      clothing: `Elevate your style with the ${name}, a must-have addition to your ${category} collection. ${shortDescription} Crafted with attention to detail and quality materials, this piece offers both comfort and sophistication. Perfect for any occasion, it brings versatility and elegance to your wardrobe.`,
      
      home: `Transform your living space with the ${name}, an exceptional ${category} item. ${shortDescription} Designed to enhance your home's aesthetic while providing practical functionality, this product combines quality craftsmanship with timeless design. Make your house a home with this carefully selected piece.`,
      
      beauty: `Indulge in luxury with the ${name}, a premium ${category} product. ${shortDescription} Formulated with high-quality ingredients and backed by expertise, this beauty essential delivers visible results. Treat yourself to the care you deserve with this exceptional addition to your beauty routine.`,
      
      default: `Introducing the ${name}, an outstanding ${category} product. ${shortDescription} This carefully crafted item combines quality, functionality, and value to meet your needs. With attention to detail and customer satisfaction in mind, it's designed to exceed your expectations and deliver lasting satisfaction.`
    };

    // Select template based on category
    const categoryLower = category.toLowerCase();
    let description = templates.default;

    for (const [key, template] of Object.entries(templates)) {
      if (categoryLower.includes(key)) {
        description = template;
        break;
      }
    }

    return description;
  } catch (error) {
    console.error('Error generating description:', error);
    return `${name} - A quality ${category} product. ${shortDescription}`;
  }
};

/**
 * Note: For production implementation with Firebase Vertex AI
 * 
 * const { VertexAI } = require('@google-cloud/vertexai');
 * 
 * const vertexAI = new VertexAI({
 *   project: process.env.FIREBASE_PROJECT_ID,
 *   location: 'us-central1',
 * });
 * 
 * const model = vertexAI.preview.getGenerativeModel({
 *   model: 'gemini-pro',
 * });
 * 
 * const result = await model.generateContent({
 *   contents: [{ role: 'user', parts: [{ text: prompt }] }],
 * });
 */

module.exports = {
  getProductRecommendations,
  generateProductDescription,
};
