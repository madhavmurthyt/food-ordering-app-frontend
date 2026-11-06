# Food Ordering App — Frontend

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React (Class Components) | 16.13.1 |
| UI Library | Material-UI (v4) | 4.11.0 |
| Routing | react-router-dom | 5.2.0 |
| Modal | react-modal | 3.11.2 |
| Icons | Material-UI Icons + Font Awesome 4 | 4.9.1 / 4.7.0 |
| Validation | email-validator | 2.0.4 |
| Build Tool | Create React App (react-scripts) | 5.0.1 |
| Node | v22 | (currently installed) |

## Project Structure

```
food-ordering-app-frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── package.json
└── src/
    ├── index.js                      Entry point, renders Router + FoodOrderingApp
    ├── index.css                     Global styles
    ├── FoodOrderingApp.js            Route definitions (/, /restaurant/:id, /checkout, /profile)
    ├── serviceWorker.js              Service worker (unregistered)
    ├── common/
    │   ├── header/
    │   │   ├── Header.js             AppBar with logo, search, login/signup modal, user menu
    │   │   └── Header.css
    │   ├── notification/
    │   │   └── Notification.js       Snackbar notification component
    │   ├── home/
    │   │   └── HomeRCard.js          Restaurant card for home page grid
    │   ├── details/
    │   │   ├── DetailsRCard.js       Restaurant info card (name, rating, photo, address)
    │   │   ├── DetailsMenuCard.js    Category-wise menu items with add-to-cart
    │   │   └── DetailsCartCard.js    Shopping cart sidebar with quantity controls
    │   ├── checkout/
    │   │   ├── AddressesGrid.js      Address selection grid (existing addresses)
    │   │   ├── SaveAddressForm.js    New address form with state dropdown
    │   │   ├── PaymentOptions.js     Payment method radio buttons
    │   │   └── OrderSummaryCard.js   Order summary with place-order button
    │   ├── order/
    │   │   └── CartItem.js           Individual cart item row
    │   └── utils/
    │       ├── Config.js             API endpoint configuration (base URL + endpoint URIs)
    │       └── ApiHelper.js          Fetch wrapper (CallApi), endpoint URI builder, header builder
    └── screens/
        ├── home/
        │   ├── Home.js               Home page: restaurant list grid with search
        │   └── Home.css
        ├── details/
        │   ├── Details.js            Restaurant detail page: menu + cart
        │   └── Details.css
        ├── checkout/
        │   ├── Checkout.js           Checkout stepper: delivery → payment → confirm
        │   └── Checkout.css
        └── profile/
            ├── Profile.js            Stub — only renders header + "Profile page" text
            └── Profile.css
```

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | Home | Restaurant listing with search |
| `/restaurant/:restaurantId` | Details | Restaurant menu + shopping cart |
| `/checkout` | Checkout | Address → payment → order confirmation stepper |
| `/profile` | Profile | Stub page (not implemented) |

## Functional Flow

### 1. Home Page (`/`)
- Fetches all restaurants from `GET /api/restaurant` on mount
- Displays restaurant cards in a responsive grid (4/3/2/1 columns based on screen width)
- Each card shows: photo, name, categories, rating, avg price
- Search bar calls `GET /api/restaurant/name/{query}` on every keystroke
- Clicking a card navigates to `/restaurant/{id}`

### 2. Login / Signup (Header Modal)
- Login button in header opens a modal with LOGIN and SIGNUP tabs
- **Login**: contact number + password → `POST /api/customer/login` with Basic auth
  - On success: stores `access-token`, `uuid`, `first-name` in `sessionStorage`
  - Header switches to show user name with dropdown menu
- **Signup**: first name, last name, email, password, contact → `POST /api/customer/signup`
  - Client-side validation: email format, password strength, 10-digit contact
  - On success: shows "Registered successfully" and switches to login tab
- **Logout**: clears `sessionStorage`, resets login state

### 3. Restaurant Details (`/restaurant/:restaurantId`)
- Fetches restaurant details from `GET /api/restaurant/{id}`
- Displays restaurant info card (photo, name, locality, rating, avg price, categories)
- Menu organized by categories, each item shows name, type (VEG/NON_VEG icon), price, add button
- Cart sidebar shows added items with +/- quantity controls, total amount, checkout button
- Cart state managed in component state (not persisted)
- Checkout requires login + at least 1 item in cart

### 4. Checkout (`/checkout`)
- Redirects to `/` if no order data in location state
- Two-step stepper: Delivery → Payment
- **Step 1 — Delivery**: Two tabs:
  - Existing Addresses: `GET /api/address/customer` displayed in selectable grid
  - New Address: form with flat/locality/city/pincode/state fields → `POST /api/address`
  - States loaded from `GET /api/states`
- **Step 2 — Payment**: `GET /api/payment` displayed as radio buttons
- After both steps, order summary shows restaurant name, items, quantities, total
- Place Order → `POST /api/order` with address, payment, restaurant, items, bill
- On success: shows order ID, redirects to home after 3 seconds

### 5. Profile (`/profile`)
- Stub page — only header + "Profile page" text
- Not wired to any API

## API Configuration

```javascript
endpointPrefix: "http://localhost:8080"
// Also hardcoded in FoodOrderingApp.js as baseUrl: "http://localhost:8080/api/"
// Also hardcoded in Home.js as "http://localhost:8080/api/restaurant"
```

## Session Management

- Uses `sessionStorage` (browser tab scoped)
- Stored keys: `access-token`, `uuid`, `first-name`
- Auth header: `Bearer <access-token>` for protected endpoints
- Login check: `sessionStorage.getItem("access-token") !== null`
- No server-side logout call on browser logout (only clears local storage)

## Responsive Design

- Uses Material-UI `useMediaQuery` hooks passed as HOC props
- Breakpoints: XS (≤650px), SM (≤1000px), M (≤1350px)
- Layout adapts: card grid columns, toolbar direction, section widths
