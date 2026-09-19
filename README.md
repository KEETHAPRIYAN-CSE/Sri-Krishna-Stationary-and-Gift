# Sri Krishna Stationery and Gift — E-Commerce Web Platform

> **"Everything You Need, All in One Place!"**

A complete, production-quality full-stack e-commerce web application tailored specifically for **Sri Krishna Stationery and Gift**, Coimbatore. Built strictly following the traditional-modern visual identity from the store's reference branding (Deep Navy Blue, Teal, Turquoise, Gold, Warm Cream, and peacock motifs).

---

## Store Details

- **Store Name:** Sri Krishna Stationery and Gift
- **Address:** 2/363 Sri Kumaran Complex, Siruvani Main Road, Kalampalayam, Coimbatore - 641010, Tamil Nadu
- **Opening Hours:** 9:00 AM - 9:00 PM (All 7 Days)
- **Direct Orders & Support:** WhatsApp (`+91 98765 43210`)

---

## Departments & Catalog

1. **Stationery & Art Supplies:** Pens, Pencils, Notebooks, Record Books, Drawing Books, Erasers, Sharpeners, Geometry Boxes, Scales, Color Pencils, Sketch Pens, Markers, Files, Folders, Art Supplies, School Supplies, Office Supplies.
2. **Gifts & Toys:** Soft Toys, Teddy Bears, Metal Toys, Ceramic Toys, Plastic Toys, Handcrafted Wooden Toys.
3. **Slippers:** Men's, Women's, and Kids' everyday comfort footwear.
4. **Fancy Items & Cosmetics:** Earrings, Chains, Rings, Bangles, Stickers, Makeup Kits, Long-lasting Perfumes.

---

## Technology Stack

- **Frontend:**
  - React.js 18 + Vite
  - React Router DOM v6
  - Lucide React Icons
  - Custom Design Tokens CSS (Navy `#06244A`, Teal `#008C95`, Gold `#D9A441`, Cream `#FFFDF7`)
  - Context API (`CartContext`, `ToastContext`, `AuthContext`)
  - Axios HTTP Client
- **Backend:**
  - Node.js + Express.js REST API
  - Helmet (Security headers & CSP)
  - CORS with configurable origins
  - Express Rate Limit
  - Morgan Logger
- **Database & Storage:**
  - Firebase Firestore (NoSQL database with strict security rules)
  - Firebase Storage (Product media and user uploads)
  - Firebase Authentication (Email/password with server verification)
- **Payment Gateway:**
  - Razorpay Online Checkout (UPI, Cards, NetBanking, Google Pay, PhonePe)
  - Server-side order calculation (Never trusts client totals)
  - HMAC SHA256 Signature Verification

---

## Project Directory Structure

```
Sri-Krishna-Stationery-Gift/
├── .env.example
├── .gitignore
├── README.md
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── assets/
│   │       ├── logo.png
│   │       ├── flex-banner.png
│   │       ├── peacock-flourish.png
│   │       ├── banner-illustration.png
│   │       └── products/ (High-res product images)
│   └── src/
│       ├── components/
│       │   ├── common/ (Header, Navbar, Footer, PageBanner, FloatingWhatsApp)
│       │   └── product/ (ProductCard, FilterSidebar)
│       ├── context/ (CartContext, ToastContext)
│       ├── pages/ (Home, Shop, ProductDetails, Cart, Checkout, OrderConfirmation, Account, Offers, Contact)
│       ├── pages/admin/ (AdminLogin, AdminDashboard)
│       ├── styles/ (design-tokens.css, index.css)
│       ├── utils/ (demoProducts.js)
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── app.js
│   └── src/
│       ├── config/ (firebaseAdmin.js, razorpay.js)
│       ├── controllers/ (productController.js, orderController.js, paymentController.js)
│       ├── middleware/ (authMiddleware.js, adminMiddleware.js)
│       ├── routes/ (productRoutes.js, orderRoutes.js, paymentRoutes.js, adminRoutes.js)
│       └── utils/ (demoProductsData.js)
│
└── firebase/
    ├── firestore.rules (Production security rules)
    └── storage.rules (Media upload security rules)
```

---

## Local Setup & Execution

### Prerequisites
- Node.js (v18, v20, or v22 LTS)
- npm (v9+)

### 1. Environment Configuration
Copy the provided `.env.example` into both `frontend/.env` and `backend/.env`:
```bash
# In project root:
cp .env.example frontend/.env
cp .env.example backend/.env
```

### 2. Install & Run Backend Server
```bash
cd backend
npm install
npm run dev   # Starts API server on http://localhost:5000
```
- Health Check: `http://localhost:5000/api/health`
- Products API: `http://localhost:5000/api/products`

### 3. Install & Run Frontend Storefront
```bash
cd ../frontend
npm install
npm run dev   # Starts Vite development server on http://localhost:5173
```
Open `http://localhost:5173` in your browser to view the live website.

### 4. Build for Production
```bash
# Frontend build
cd frontend
npm run build

# Validates and creates optimized bundle in frontend/dist/
```

---

## Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project named `sri-krishna-stationery`.
2. Enable **Authentication** (Email/Password provider).
3. Enable **Firestore Database** in production mode.
4. Deploy the security rules from `firebase/firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```
5. Deploy the storage rules from `firebase/storage.rules`:
   ```bash
   firebase deploy --only storage
   ```
6. Download your Firebase Admin private key JSON from **Project Settings > Service Accounts**, and set `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL` in `backend/.env`.

---

## Razorpay Payment Setup

1. Sign up or log in to the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Generate API Keys in **Settings > API Keys** (Test mode for development).
3. Add `RAZORPAY_KEY_ID` to both `frontend/.env` and `backend/.env`.
4. Add `RAZORPAY_KEY_SECRET` **only** to `backend/.env` (Never expose Razorpay secret keys in frontend React code).
5. For webhooks, point `https://your-backend.com/api/payment/webhook` with `payment.captured` event enabled.

---

## Admin Portal & Demo Credentials

- **Admin Login URL:** `http://localhost:5173/admin/login`
- **Pre-filled Demo Credentials:**
  - Email: `admin@srikrishnastationery.com`
  - Password: `KrishnaAdmin2026!`
- **Admin Dashboard Capabilities:**
  - **Overview KPIs:** Real-time metrics (Total Revenue, Total Orders, Active Catalog, Total Stock Units, Low Stock Alerts, Today's Sales).
  - **Product Management (`/admin/products`):** Full CRUD, category filtering, search, image preview, soft delete (`active: false`) and restore.
  - **Inventory & Stock Audits (`/admin/inventory`):** Configurable low-stock alert thresholds, quick stock adjustment modal with audit logging (reason, delta, previous/new stock).
  - **Order & Courier Management (`/admin/orders`):** Order status transitions (`PLACED` -> `CONFIRMED` -> `PACKED` -> `SHIPPED` -> `OUT_FOR_DELIVERY` -> `DELIVERED`), courier assignment modal (Courier name e.g. DTDC/TPC, AWB/tracking number, shipping date, expected delivery date, tracking link).
  - **Sales Analytics (`/admin/sales`):** Filters for Today, Week, Month, All-Time; Gross sales, discounts, shipping revenue, net revenue, and category breakdown.
  - **Dynamic Shipping Settings (`/admin/shipping`):** Configurable default shipping fee (e.g. ₹50) and free delivery threshold (e.g. ₹499) with real-time checkout binding.
  - **Product-Level Discounts (`/admin/discounts`):** Percentage and fixed amount discounts with backend price tamper protection.
  - **Activity Log (`/admin/settings`):** Audit trail of admin actions (stock changes, status updates, catalog edits).

---

## Store Policies & Terms

- **Strict No Return Policy:** All products sold by Sri Krishna Stationery & Gift are non-returnable.
- **Checkout Policy Confirmation:** Customers must explicitly acknowledge the No Return Policy and Terms & Conditions via checkbox before placing any order.
- **Dedicated Policy Page:** Available at `/terms` with comprehensive rules on product availability, inspection upon arrival, and customer support.

---

## WhatsApp Ordering System

In addition to Razorpay checkout, customers can place direct inquiries or orders through WhatsApp:
- **Product Card & Product Details:** Pre-filled WhatsApp message with product name, SKU, price, and inquiry text.
- **Cart Page:** Itemized list of all cart items, quantities, subtotal, shipping fee, and grand total.
- **Floating Launcher:** Quick store chat launcher accessible from every page.


---

## Production Deployment Guides

### Frontend (Vercel)
1. Push repository to GitHub.
2. Import project into Vercel and select root folder as `frontend`.
3. Set build command to `npm run build` and output directory to `dist`.
4. Add environment variables: `VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`.

### Backend (Render / Railway)
1. Select root directory as `backend`.
2. Set build command to `npm install` and start command to `npm start`.
3. Add environment variables: `PORT=5000`, `CLIENT_URL=https://your-vercel-domain.vercel.app`, Firebase Admin keys, and Razorpay keys.

---

## License & Store Rights
Copyright © 2026 Sri Krishna Stationery and Gift, Coimbatore. All rights reserved.
