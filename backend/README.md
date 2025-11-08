# Backend

Run
- Copy `.env.example` to `.env`
- From repo root: `npm install`
- Seed data: `npm run seed`
- Start dev (both apps): `npm start`

API
- GET /api/health
- GET /api/products, GET /api/products/:id
- POST /api/products (admin), PUT /api/products/:id (admin), DELETE /api/products/:id (admin)
- GET /api/cart (auth), PUT /api/cart (auth)
- POST /api/orders/checkout (auth)
- GET /api/orders/mine (auth)
- GET /api/orders (admin), PUT /api/orders/:id/status (admin)
- POST /api/ai/recommendations
