# CRM Revamp — Design

## Context
Local shop CRM (MERN-ish: React CRA + Express/Mongoose). Used by one shop, single instance. Current state has real bugs, dead code, mixed/duplicate dependencies, and no real authentication (hardcoded creds checked client-side only, server routes unprotected).

## Goals
- Fix broken/buggy backend logic.
- Add real authentication (server-enforced).
- Rebuild Orders as a proper feature (currently broken/dead code).
- Clean up dependencies and unused files.
- Repaint UI with consistent MUI v5 theme (same pages/routes, better visuals).

## Non-goals
- No framework migration (stays CRA + Express + Mongoose).
- No new features beyond fixing Orders.
- No deployment/infra changes.

## Backend

### Database
- Drop `mongoose-auto-increment` (unmaintained, breaks on newer mongoose). Use Mongo's default `_id`.
- `Customer` schema: proper types — `status` as enum (`pending`, `checked`, `completed`), `cost`/`totalAmount`/`advanceAmount` as `Number`, `date` as `Date`.
- New `Order` schema (separate from Customer): fields for product details, amounts, customer reference, status, timestamps.

### Auth
- `.env`: `MONGO_URI`, `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASS_HASH`.
- `POST /login`: bcrypt-compare against `ADMIN_PASS_HASH`, issue JWT (short expiry, e.g. 8h).
- `authMiddleware.js`: verifies JWT from `Authorization: Bearer <token>` header. Applied to all customer/order routes except `/login`.

### Controllers/Routes
- Fix `changeStatus`: use `request.body.status` (was referencing undefined `newStatus`).
- Fix `getOrders`/`addOrder`: real Mongoose calls against `Order` model (current code wrongly imports Customer model as `Order` and has a controller that calls itself via axios).
- Split `routes/route.js` into `customerRoutes.js`, `orderRoutes.js`, `authRoutes.js`, mounted in `index.js`.
- Remove duplicate `router.put('/:id', ...)` route collision (currently `editCustomer` and `changeStatus` both bind to same path/verb — only one ever fires).

## Frontend

### Auth flow
- Login page posts to `/login`, stores JWT (localStorage).
- Axios instance (`services/api.js`) attaches `Authorization` header from stored token; on `401` response, clear token and redirect to `/login`.
- `PrivateRoute` wrapper in `App.js` guards all routes except `/login`.

### UI
- Drop `@material-ui/core` v4 and `material-ui-search-bar` (unmaintained, duplicate of MUI v5). Unify on `@mui/material` + `@mui/icons-material`.
- Consistent theme: single `createTheme()` with defined primary/secondary colors, applied via `ThemeProvider` in `index.js`.
- Consistent `AppBar` + nav in `NavBar.jsx`, consistent spacing/typography across pages (AddCustomer, AllCustomers, Pending/Checked/Completed, EditCustomer, CustomerDetail, Orders, AllOrders).
- Wire `Orders.jsx`/`AllOrders.jsx` to the real order API.
- Remove unused images: `bg-1.jpg`, `bg-2.png`, `bg3.png`, `bg4.png`, `1.ico`, `2.png`, `IMG_2530.ico.PNG`, `pngegg.png` (keep only assets the new UI references).

## Repo cleanup
- Root `package.json`: remove duplicated frontend/server deps — keep only `concurrently` + start script.
- Remove `.DS_Store` files; add `.gitignore` (`node_modules`, `.env`, `.DS_Store`).
- Fix or remove `start-app.bat` (currently just `npm start` with no directory context — non-functional as-is).

## Testing
- No existing test coverage beyond CRA's default `App.test.js` (untouched, not meaningful).
- Manual verification: run server + frontend, exercise login, add/edit/delete customer, status changes, add/list orders, confirm protected routes reject requests without a valid token.
