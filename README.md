# Food Ordering App — Frontend

A React single-page application for browsing restaurants, managing a shopping cart, and placing food orders. Built with React 18, MUI v5, and React Router v6.

## Quick Start

```bash
./restart.sh
```

This kills any existing frontend on port 3000, installs dependencies, and starts the dev server at `http://localhost:3000`.

## Prerequisites

- **Node.js 18+** (tested with v22)
- **npm 8+**
- Backend API running at `http://localhost:8080/api/` (see the backend README)

## Getting Started

**Option 1 — Restart script** (recommended):
```bash
./restart.sh
```

**Option 2 — Manual:**
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open `http://localhost:3000` in your browser.

The app expects the backend API at `http://localhost:8080/api/`. Make sure the backend is running before starting the frontend.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the dev server on port 3000 with hot reload |
| `npm run build` | Create a production build in the `build/` folder |
| `npm test` | Run tests in interactive watch mode |

## Project Structure

```
src/
├── index.js                    Entry point
├── FoodOrderingApp.js          Route definitions
├── common/
│   ├── header/Header.js        App bar with search, login/signup modal, user menu
│   ├── notification/           Snackbar notifications
│   ├── home/HomeRCard.js       Restaurant card component
│   ├── details/                Restaurant detail components (info, menu, cart)
│   ├── checkout/               Checkout components (addresses, payment, order summary)
│   ├── order/CartItem.js       Cart item row
│   └── utils/
│       ├── Config.js           API endpoint configuration
│       └── ApiHelper.js        Fetch wrapper and helpers
└── screens/
    ├── home/Home.js            Home page — restaurant grid with search
    ├── details/Details.js      Restaurant menu page with cart
    ├── checkout/Checkout.js    Checkout stepper (address → payment → confirm)
    └── profile/Profile.js      Profile page (stub)
```

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Browse restaurants, search by name, category filter |
| `/restaurant/:id` | Details | View menu, add items to cart, rate restaurant |
| `/checkout` | Checkout | Address → payment → coupon → place order |
| `/profile` | Profile | Order history, addresses, settings |
| `/login` | Login | Google SSO + phone/email/password login |
| `/admin` | Admin | Dashboard, restaurants (CRUD + approve), users, orders |
| `/my-restaurant` | Owner Portal | Manage own restaurants + menu items |
| `/for-restaurants` | Partner Landing | Marketing page for restaurant owners |
| `/invite/:token` | Invite | Claim restaurant ownership via admin invite link |

## Features

- **Google SSO + Email/Phone Login** — Dedicated `/login` page with Google Sign-In and password fallback
- **Role-Based Access** — CUSTOMER, RESTAURANT_OWNER, DRIVER, ADMIN roles with route guards
- **Admin Dashboard** — Stats, restaurant management (create/approve/suspend), user roles, orders
- **Restaurant Owner Portal** — Create restaurant, manage menu, view orders
- **Invite Links** — Admin generates link, owner claims restaurant ownership
- **Restaurant Rating** — MUI Rating component, logged-in users only
- **Coupon Support** — Apply/remove coupons at checkout
- **Restaurant Search** — Real-time search by restaurant name
- **Shopping Cart** — Add/remove items, quantity controls, running total
- **Checkout Flow** — Stepper: address → payment → coupon → confirm order
- **Responsive Layout** — MUI sx prop, Poppins font, coral-red theme

## API Configuration

The backend URL is configured via environment variable:

```bash
REACT_APP_API_URL=http://localhost:8080   # default
```

Set it in a `.env` file or export before running. See `src/common/utils/Config.js` for all endpoints.
