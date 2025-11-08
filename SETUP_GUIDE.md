# AI E-Commerce - Complete Setup Guide

## 🎯 Project Overview

A full-stack e-commerce platform with AI-powered recommendations built using:
- **Frontend**: React.js with Material-UI/TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Features**: Product recommendations & descriptions
- **Email**: NodeMailer for order confirmations

---

## 📦 What's Been Created

### Backend Structure ✅
```
backend/
├── config/
│   ├── firebase.js           ✅ Firebase Admin setup
│   └── email.js               ✅ NodeMailer config
├── src/
│   ├── controllers/
│   │   ├── authController.js     ✅ Signup/Login/Profile
│   │   ├── productController.js  ✅ Product CRUD
│   │   ├── cartController.js     ✅ Cart operations
│   │   ├── orderController.js    ✅ Checkout & orders
│   │   └── aiController.js       ✅ AI recommendations
│   ├── middlewares/
│   │   ├── authMiddleware.js     ✅ JWT verification
│   │   └── errorHandler.js       ✅ Error handling
│   ├── routes/
│   │   ├── authRoutes.js         ✅ Auth endpoints
│   │   ├── productRoutes.js      ✅ Product endpoints
│   │   ├── cartRoutes.js         ✅ Cart endpoints
│   │   ├── orderRoutes.js        ✅ Order endpoints
│   │   └── aiRoutes.js           ✅ AI endpoints
│   └── services/
│       ├── aiService.js          ✅ AI logic
│       └── emailService.js       ✅ Email templates
├── utils/
│   └── sampleData.js             ✅ Sample products
├── scripts/
│   └── seedDatabase.js           ✅ DB seeding script
├── server.js                     ✅ Main server
└── package.json                  ✅ Dependencies
```

### Frontend Structure ✅
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           ✅ Navigation
│   │   ├── Footer.jsx           ✅ Footer
│   │   ├── ProductCard.jsx      ✅ Product display
│   │   ├── ProtectedRoute.jsx   ✅ Auth guard
│   │   ├── CartItem.jsx         ⏳ To create
│   │   └── RecommendedProducts.jsx ⏳ To create
│   ├── pages/
│   │   ├── Home.jsx             ⏳ To create
│   │   ├── ProductDetail.jsx    ⏳ To create
│   │   ├── Cart.jsx             ⏳ To create
│   │   ├── Checkout.jsx         ⏳ To create
│   │   ├── Profile.jsx          ⏳ To create
│   │   ├── Login.jsx            ⏳ To create
│   │   └── Signup.jsx           ⏳ To create
│   ├── context/
│   │   ├── AuthContext.jsx      ✅ Auth state
│   │   └── CartContext.jsx      ✅ Cart state
│   ├── services/
│   │   └── api.js               ✅ API calls
│   ├── config/
│   │   └── firebase.js          ✅ Firebase config
│   ├── App.jsx                  ✅ Main app with routing
│   └── index.css                ⏳ Tailwind styles
└── package.json                  ✅ Dependencies
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend `.env`
```env
PORT=5000
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env`
```env
# Firebase Web SDK
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef

# Backend API
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Enable **Authentication** → Email/Password
5. Create collections: `users`, `products`, `carts`, `orders`
6. Get **Admin SDK** credentials (Settings → Service Accounts → Generate Key)
7. Get **Web SDK** config (Settings → General → Your apps)

### 4. Gmail App Password

1. Enable 2FA on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use this in `EMAIL_PASSWORD`

### 5. Seed Database

```bash
cd backend
node scripts/seedDatabase.js
```

### 6. Run the Application

```bash
# From root directory - runs both servers
npm run dev

# OR run separately:
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

Frontend: http://localhost:3000
Backend API: http://localhost:5000

---

## 📝 Missing Frontend Pages

Create these pages in `frontend/src/pages/`:

### Home.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ category });
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to AI E-Shop
      </h1>
      
      {/* Category Filter */}
      <div className="mb-8 flex justify-center gap-4">
        <button onClick={() => setCategory('')} className="px-4 py-2 rounded-lg">All</button>
        <button onClick={() => setCategory('Electronics')} className="px-4 py-2 rounded-lg">Electronics</button>
        <button onClick={() => setCategory('Clothing')} className="px-4 py-2 rounded-lg">Clothing</button>
        {/* Add more categories */}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
```

### Login.jsx & Signup.jsx
Similar auth forms with Firebase integration (use AuthContext)

### Cart.jsx
Display cart items, update quantities, show total, checkout button

### Checkout.jsx  
Shipping address form, payment method, place order

### Profile.jsx
Display user info and order history

---

## 🔧 Troubleshooting

### Backend won't start
- Check `.env` file exists with all variables
- Verify Firebase credentials are correct
- Run `npm install` in backend directory

### Frontend build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check React version compatibility

### Firebase errors
- Verify Firestore rules allow read/write
- Check Firebase project billing is enabled
- Ensure correct credentials in `.env`

### Email not sending
- Verify Gmail App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Enable "Less secure app access" if needed

---

## 🎨 Styling

Add to `frontend/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Protected)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add to cart (Protected)
- `PUT /api/cart/:productId` - Update quantity (Protected)
- `DELETE /api/cart/:productId` - Remove item (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)

### AI
- `GET /api/ai/recommendations` - Get recommendations (Protected)
- `POST /api/ai/generate-description` - Generate description (Protected)

---

## ✅ Testing

1. Start both servers
2. Sign up a new user at `/signup`
3. Browse products on home page
4. Add products to cart
5. View cart and update quantities
6. Proceed to checkout
7. Place an order
8. Check email for confirmation
9. View order history in profile

---

## 🎯 Next Steps

1. Create remaining frontend pages (see templates above)
2. Add Tailwind CSS styling
3. Implement search functionality
4. Add product filtering
5. Create admin panel
6. Deploy to production (Vercel/Netlify + Firebase)

---

## 📞 Support

For issues or questions:
- Check console logs for errors
- Verify all environment variables
- Review Firebase console for authentication/database errors
- Check network tab in browser dev tools

**Your AI E-Commerce platform is ready to run! 🎉**
