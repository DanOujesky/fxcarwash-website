# FX Carwash Website

Full-stack web application for a Czech car wash business — e-commerce platform with prepaid card management, Stripe payments, and admin dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Payments | Stripe |
| Auth | JWT (cookie-based) |
| Email | Resend (SMTP) |
| Card Terminals | Nayax API |
| Task Queues | BullMQ + Redis |
| Animations | Framer Motion |
| Maps | Google Maps API |
| Deployment | Vercel (frontend) + Docker (backend) |

## Project Structure

```
fxcarwash-website/
├── frontend/          # React Vite SPA
├── backend/           # Express REST API
├── shared/            # Shared Zod schemas (used by both)
└── package.json       # npm workspaces root
```

## Prerequisites

- Node.js 20+
- PostgreSQL database (or Neon account)
- Redis (for BullMQ queues)
- Stripe account
- Resend account (email)
- Nayax account (payment terminals)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

**`backend/.env`**
```env
DATABASE_URL=postgresql://user:password@host/db
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASS=your_resend_api_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NAYAX_TOKEN=...
NAYAX_BASE_URL=https://lynx.nayax.com
NAYAX_ACTOR_ID=...
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5001
VITE_ESHOP_ENABLED=true
VITE_ESHOP_PREVIEW_CODE=your_preview_code
VITE_GOOGLE_MAP_API_KEY=...
VITE_STRIPE_API_KEY=pk_test_...
```

### 3. Run database migrations

```bash
cd backend
npx prisma migrate dev
```

### 4. Start development servers

```bash
# Frontend (port 3000)
cd frontend && npm run dev

# Backend (port 5001)
cd backend && npm run dev
```

## Scripts

### Frontend
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Backend
```bash
npm run dev       # Watch mode with tsx
npm run build     # Compile with tsup
npm run start     # Run compiled server
```

## Features

### Authentication
- JWT-based auth with cookie storage
- Email verification and password reset via codes
- Rate limiting on auth endpoints
- Roles: `USER`, `ADMIN`

### E-commerce
- Shopping cart with item quantity management
- Stripe Checkout integration
- Order tracking (PENDING → PAID → SHIPPED)
- Invoice generation via email

### Prepaid Card Management
- Order new physical cards
- Add credit to existing cards
- Card status tracking (IN_STOCK, ASSIGNED, BLOCKED, LOST)
- Nayax payment terminal integration
- Waitlist system for card requests
- Transaction history (CreditLog)

### Admin Dashboard
- Order and revenue statistics
- Card inventory management
- News/blog content management
- Image uploads (Multer)
- User management with discount levels

### Business Features
- Czech company info support (IČO, DIČ)
- Address autocomplete
- Delivery address management
- Email notifications for all order states

### Security
- Helmet.js security headers
- CORS with origin validation
- Request validation via Zod schemas (shared package)
- Password requirements enforced on both ends

## Database Models

| Model | Description |
|---|---|
| User | Accounts with profile, company info, discount level |
| Order | Orders with status, items, delivery info |
| OrderItem | Line items per order |
| Product | Product catalog (NEW_CARD, ADD_CREDIT) |
| Card | Physical cards with credit balance and status |
| CreditLog | Transaction history for card credits |
| News | Blog/news posts |
| PendingCheckout | Stripe session tracking |
| CardWaitlist | Waitlist for card requests |

## API Routes

| Prefix | Description |
|---|---|
| `POST /auth/*` | Register, login, logout, password reset |
| `GET /auth/me` | Current user |
| `POST /payment/create-checkout-session` | Stripe checkout |
| `GET /payment/order-by-session/:id` | Order lookup |
| `GET/POST /news` | News CRUD |
| `GET/POST /nayax/*` | Nayax card/terminal operations |
| `GET/POST /waitlist/*` | Card waitlist |
| `GET/POST /admin/*` | Admin operations |
| `POST /contact` | Contact form |
| `POST /api/webhook` | Stripe webhooks |

## Feature Flags

| Variable | Description |
|---|---|
| `VITE_ESHOP_ENABLED` | Toggle the entire shop section |
| `VITE_ESHOP_PREVIEW_CODE` | Allow preview access to shop behind the gate |

## Deployment

### Frontend — Vercel
`frontend/vercel.json` rewrites all routes to `index.html` for SPA routing.

```bash
cd frontend && npm run build
# deploy dist/ to Vercel
```

### Backend — Docker
```bash
cd backend
docker build -t fxcarwash-backend .
docker run -p 5001:5001 --env-file .env fxcarwash-backend
```

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/o-nas` | About |
| `/novinky` | News |
| `/nabidka` | Offer |
| `/firmy` | Corporate customers |
| `/kontakt` | Contact |
| `/prihlaseni` | Login |
| `/registrace` | Register |
| `/kosik` | Cart |
| `/doprava` | Delivery |
| `/souhrn` | Order overview |
| `/dobit-kartu` | Add credit |
| `/objednat-kartu` | Order new card |
| `/moje-karty` | My cards |
| `/profil` | Profile |
| `/admin` | Admin dashboard |
