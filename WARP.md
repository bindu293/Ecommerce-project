# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with npm workspaces: backend (Node/Express/Firestore) and frontend (React/Vite/Material-UI).
- Auth via Firebase Authentication on the client; backend verifies tokens.
- AI features via OpenAI (recommendations, product text). Emails via Nodemailer (SMTP).

Key commands
- Install all deps (root installs workspaces):
  - npm install
- Run both apps in dev (concurrently):
  - npm start
- Run a single workspace:
  - Backend: npm run dev -w backend
  - Frontend: npm run dev -w frontend
- Build:
  - All (frontend build only; backend is Node runtime): npm run build
  - Frontend only: npm run build -w frontend
- Seed sample data into Firestore:
  - npm run seed
- Preview production frontend build:
  - npm run preview -w frontend
- Start backend in “prod” mode (no watcher):
  - npm run start -w backend
- Lint/tests:
  - No linter or test runner configured in this repo at present.

Environment setup
- Copy env samples and fill values:
  - Frontend: copy frontend/.env.example to frontend/.env and set:
    - VITE_API_BASE_URL (e.g., http://localhost:5000)
    - VITE_FIREBASE_* (API key, project, etc.)
  - Backend: variables are documented in .env.example (at repo root). Create backend/.env with at least:
    - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (multiline key supported),
    - OPENAI_API_KEY,
    - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL,
    - BASE_URL (e.g., http://localhost:5000)

Ports and URLs
- Frontend dev runs on http://localhost:5173 (see frontend/vite.config.js).
- Backend base URL defaults to BASE_URL in env (example shows http://localhost:5000).

High-level architecture
- Root
  - package.json defines workspaces and orchestration scripts (dev/build/seed).
- Backend (Node/Express)
  - Intended layering: src/controllers, src/routes, src/services, src/models, src/middlewares (directories present).
  - Data: Firestore via Firebase Admin SDK. The seeding script (backend/scripts/seed.js) batches upserts into a products collection.
  - Public API surface (see backend/README.md):
    - Health: GET /api/health
    - Products: GET /api/products, GET /api/products/:id; admin CRUD via POST/PUT/DELETE
    - Cart (auth): GET /api/cart, PUT /api/cart
    - Orders: POST /api/orders/checkout (auth), GET /api/orders/mine (auth); admin list/update
    - AI: POST /api/ai/recommendations
  - Auth: frontend obtains Firebase ID token; backend is expected to verify Bearer token for auth routes.
- Frontend (React/Vite/MUI)
  - SPA with React Router v6; uses Axios to call backend at VITE_API_BASE_URL.
  - Firebase client SDK handles authentication; tokens are sent as Bearer headers.

Workflow tips specific to this repo
- Use npm workspaces with -w to target a package (backend/frontend) for any command.
- Seed before testing product flows: npm run seed populates Firestore from backend/sample-data/products.json.
- OpenAI-backed endpoints require OPENAI_API_KEY set in backend env before use.

Important excerpts from README.md
- Quick start: copy env samples, npm install (root), npm run seed, npm start.
- For deeper details, see backend/README.md and frontend/README.md.
