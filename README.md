# Food Ordering App — Frontend

A React single-page application for browsing restaurants, managing a shopping cart, and placing food orders. Built with React 16, Material-UI v4, and React Router v5.

## Prerequisites

- **Node.js 18+** (tested with v22)
- **npm 8+**
- Backend API running at `http://localhost:8080/api/` (see the backend README)

## Getting Started

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
| `/` | Home | Browse all restaurants, search by name |
| `/restaurant/:id` | Details | View restaurant menu, add items to cart |
| `/checkout` | Checkout | Select address, payment method, place order |
| `/profile` | Profile | User profile (not yet implemented) |

## Features

- **Login/Signup** — Modal in the header with form validation (email, password strength, 10-digit contact)
- **Restaurant Search** — Real-time search by restaurant name
- **Shopping Cart** — Add/remove items, quantity controls, running total
- **Checkout Flow** — Stepper: select delivery address (or add new) → select payment → confirm order
- **Responsive Layout** — Adapts to mobile, tablet, and desktop screen widths

## API Configuration

The backend URL is configured in `src/common/utils/Config.js`:

```javascript
endpointPrefix: "http://localhost:8080"
```

To point to a different backend, update this value and the `baseUrl` in `src/FoodOrderingApp.js`.
