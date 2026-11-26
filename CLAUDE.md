# Frontend — React

## Structure

```
food-ordering-app-frontend/
├── package.json                       # npm (no yarn)
├── public/index.html
└── src/
    ├── FoodOrderingApp.js             # Router + ScrollToTop
    ├── screens/                       # Page-level components
    │   ├── home/ checkout/ details/ profile/ login/
    │   ├── admin/                     # Admin dashboard
    │   ├── owner/                     # Restaurant owner portal
    │   ├── marketing/                 # /for-restaurants landing
    │   ├── invite/                    # /invite/:token claim page
    │   ├── order/                     # Order tracking
    │   └── favorites/                 # Favorites
    ├── common/                        # Shared components
    │   ├── header/ footer/ notification/ layout/
    │   └── utils/
    │       ├── Config.js              # API endpoints registry
    │       ├── AuthGuard.js           # isLoggedIn, getRole, requireRole
    │       └── ApiHelper.js           # Fetch wrapper
    └── theme/
        ├── brand.js                   # App name, tagline, Google Client ID
        └── theme.js                   # MUI createTheme
```

## Tech Stack

| Component | Version |
|-----------|---------|
| React | 18.2.0 |
| MUI | v5 (5.15.x) |
| react-router-dom | 6.x |
| Node | 22 |
| Package manager | npm (no yarn) |

## Styling

**MUI `sx` prop only** — no CSS files, no makeStyles, no inline styles, no
styled-components.

- **Font:** Poppins (Google Fonts) 400/500/600/700
- **Primary:** coral-red `#E23744`
- **Secondary:** amber `#FF9800`
- **Branding:** configurable via `src/theme/brand.js`
- **Theme:** `src/theme/theme.js` (MUI `createTheme`)

## Build & Run

```bash
# Install
npm install

# Dev server
npm start

# Production build
npx react-scripts build

# Or use the restart script
./restart.sh
```

App at `http://localhost:3000` · Requires backend at `http://localhost:8080/api/`
