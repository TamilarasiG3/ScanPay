# ScanPay - Small Shop Billing System

A complete full-stack QR-based billing app for small shops.

## Features
- Secure admin signup/login using JWT.
- Product CRUD (name, price, stock).
- Shop QR code generation.
- Customer shopping page from QR link.
- Stripe test-mode online payment checkout.
- Order confirmation and payment verification.
- Real-time order refresh on admin dashboard via Socket.IO.
- Mobile + desktop responsive React UI.

## Folder Structure

```
ScanPay/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

## Local Run Instructions

### 1) Prerequisites
- Node.js 18+
- MongoDB Atlas database
- Stripe account (test mode key)

### 2) Backend Setup
```bash
cd backend
cp .env.example .env
# Fill .env values
npm install
npm run dev
```

### 3) Frontend Setup
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL to backend URL
npm install
npm run dev
```

### 4) Open App
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## Stripe Test Payment
Use Stripe test card on checkout:
- Card: `4242 4242 4242 4242`
- Any future expiry, any CVC, any ZIP.

## API Highlights
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/products` (admin)
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `GET /api/shops/:shopSlug` (customer)
- `GET /api/shops/admin/qr` (admin)
- `POST /api/orders/checkout-session`
- `GET /api/orders/confirm/:sessionId`
- `GET /api/orders/admin` (admin)

## Deployment (Free Tier)

### Option A: Render (backend) + Vercel (frontend)

#### Backend on Render
1. Push repo to GitHub.
2. Create new Render Web Service from `backend` folder.
3. Add env vars from `backend/.env.example`.
4. Set build command: `npm install`.
5. Set start command: `npm start`.
6. Copy backend URL (e.g. `https://scanpay-api.onrender.com`).

#### Frontend on Vercel
1. Import repo in Vercel.
2. Set project root to `frontend`.
3. Set env var `VITE_API_URL` to Render backend URL.
4. Deploy.

### Option B: Railway
- Deploy backend service from `backend` and set environment variables.
- Deploy frontend from `frontend` or connect with Vercel.

## MongoDB Atlas Setup
1. Create free cluster.
2. Create DB user and password.
3. Whitelist IP (`0.0.0.0/0` for testing only).
4. Copy connection string into `MONGODB_URI`.

## Notes
- For production, add Stripe webhooks and server-side signature verification for strongest payment confirmation.
- You can extend to Razorpay/Paytm by adding similar checkout + verification endpoints.
