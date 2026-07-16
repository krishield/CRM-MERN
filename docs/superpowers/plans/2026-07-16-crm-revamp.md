# CRM Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken backend logic, add real server-enforced auth, rebuild the Orders feature properly, clean up dependencies/dead files, and repaint the UI on a consistent MUI v5 theme — same routes/features, working correctly.

**Architecture:** Express/Mongoose backend split into `routes/` + `controllers/` + `middleware/`, JWT auth guarding all data routes. React CRA frontend keeps its page structure but drops duplicate UI libraries, adds an authenticated axios client and route guard, and gets a shared MUI theme.

**Tech Stack:** Node/Express, Mongoose, MongoDB, JWT (`jsonwebtoken`), `bcryptjs`, React 18, React Router 6, MUI v5, styled-components, axios.

---

## Reference: current bugs found (fixed by this plan)

- `server/controllers/customer-controller.js`: `changeStatus` reads `newStatus` which is never defined (should be `request.body.status`) → route always 500s.
- `server/routes/route.js`: `router.put('/:id', editCustomer)` and `router.put('/:id', changeStatus)` both bind PUT `/:id` — the second silently wins, so `editCustomer` never runs via routing (Express takes the first match, actually — meaning `changeStatus` is dead code currently; either way it's a bug that both are stacked on the same path).
- `server/controllers/order-controller.js`: imports `Customer` model as `Order` (no real Order schema exists). `getOrders` controller ignores `(request, response)` and instead calls `axios.get` on itself — this function was copy-pasted from the frontend service file and put in the backend by mistake. Route `GET /allOrders` is broken.
- `server/controllers/customer-controller.js` `loginForm`: uses `jwt.sign` but `jsonwebtoken` is never imported, and credentials are hardcoded in source.
- No auth middleware — every route is open to anyone who can reach the server, regardless of login.
- `frontend/src/component/Login.jsx`: login check happens entirely client-side against hardcoded strings; never calls the server.
- `frontend/src/component/Pending.jsx`: contains a leftover "Rajpurohit Matrimony" landing page (copy-pasted from an unrelated project) instead of the pending-customers list. The `/pending` route currently renders this placeholder.
- `frontend/src/component/NavBar.jsx`: tab labels don't match their destinations (`"Login"` links to `/checked`, `"Register"` links to `/orders`, no links to `/all`, `/login`, or `/Allorders`).
- `Orders.jsx`/`AllOrders.jsx` read orders by filtering the **customers** collection for magic status strings (`'Pending-Order'`, `'Complete-Order'`) — there's no real Order collection.
- Mixed UI libraries: `@material-ui/core` v4 (`Chip`, `Paper`, `Tooltip`, `AppBar`, `Toolbar`, `Grid`, `Box`) used alongside `@mui/material` v5 throughout. `material-ui-search-bar` is unmaintained and only wraps a text field.
- `server/schema/customer-schema.js` uses `mongoose-auto-increment`, which is unmaintained and requires the deprecated callback-style API — silently broken/no-ops on modern mongoose in many setups.
- Root `package.json` duplicates all of `frontend/package.json`'s dependencies for no reason (nothing at the root imports them).
- Unused images (`bg-1.jpg`, `bg-2.png`, `bg3.png`, `bg4.png`, `1.ico`, `2.png`, `IMG_2530.ico.PNG`, `pngegg.png`) are not referenced by any component.
- `start-app.bat` is just `npm start` — doesn't `cd` anywhere, so it doesn't actually start both server and frontend the way the root `npm start` script does.
- No `.gitignore`, `.DS_Store` files committed, repo isn't even git-initialized yet.

---

## File Structure

**Backend — new/changed:**
- `server/.env` (new, gitignored) — `MONGO_URI`, `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASS_HASH`
- `server/.env.example` (new, committed) — same keys, placeholder values
- `server/db.js` (modify) — read `MONGO_URI` from env
- `server/schema/customer-schema.js` (modify) — typed fields, drop auto-increment
- `server/schema/order-schema.js` (new) — real Order model
- `server/middleware/auth-middleware.js` (new) — JWT verification
- `server/controllers/auth-controller.js` (new) — login, replaces `loginForm` in customer-controller
- `server/controllers/customer-controller.js` (modify) — drop `loginForm`, fix `changeStatus`
- `server/controllers/order-controller.js` (modify) — real Order CRUD
- `server/routes/auth-routes.js` (new)
- `server/routes/customer-routes.js` (new, replaces part of `route.js`)
- `server/routes/order-routes.js` (new, replaces part of `route.js`)
- `server/routes/route.js` (delete — replaced by the three files above)
- `server/index.js` (modify) — mount new routers, load `.env`
- `server/package.json` (modify) — add `jsonwebtoken`, `bcryptjs`, remove `mongoose-auto-increment`
- `server/scripts/generate-password-hash.js` (new) — one-off CLI to hash a password into `.env`

**Frontend — new/changed:**
- `frontend/src/services/apiClient.js` (new) — shared axios instance with auth header + 401 handling
- `frontend/src/services/api.js` (modify) — use `apiClient`, add order endpoints matching new backend
- `frontend/src/component/PrivateRoute.jsx` (new) — route guard
- `frontend/src/component/Login.jsx` (modify) — real server call
- `frontend/src/component/NavBar.jsx` (modify) — correct labels/links, MUI v5 only, logout button
- `frontend/src/component/Pending.jsx` (rewrite) — real pending-customers list (same pattern as Checked/Completed)
- `frontend/src/component/Checked.jsx`, `Completed.jsx`, `AllCustomers.jsx`, `CustomerDetail.jsx`, `EditCustomer.jsx`, `Orders.jsx`, `AllOrders.jsx` (modify) — drop `@material-ui/core` v4 imports, use MUI v5 equivalents, wire Orders pages to real order API
- `frontend/src/theme.js` (new) — shared MUI theme
- `frontend/src/index.js` (modify) — wrap app in `ThemeProvider`
- `frontend/src/App.js` (modify) — wrap protected routes in `PrivateRoute`
- `frontend/package.json` (modify) — remove `@material-ui/core`, `material-ui-search-bar`
- Delete: `frontend/src/bg-1.jpg`, `bg-2.png`, `bg3.png`, `bg4.png`, `frontend/public/1.ico`, `2.png`, `IMG_2530.ico.PNG`, `pngegg.png`

**Repo root:**
- `package.json` (modify) — strip duplicated deps, keep `concurrently` + scripts
- `.gitignore` (new)
- `start-app.bat` (modify) — actually `cd` and run both, or delete if `npm start` from root is the intended entrypoint (keeping it, fixed, since shop PC likely double-clicks it)
- Delete `.DS_Store`, `frontend/.DS_Store`

---

## Task 1: Git init + gitignore + remove junk

**Files:**
- Create: `.gitignore`
- Delete: `.DS_Store`, `frontend/.DS_Store`

- [ ] **Step 1: Init git (repo currently has no `.git`)**

```bash
git init
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
.env
.DS_Store
build/
```

- [ ] **Step 3: Remove committed junk files from disk**

```bash
rm -f .DS_Store frontend/.DS_Store
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git add -A -- ':!node_modules' ':!*/node_modules'
git commit -m "chore: init git, add gitignore, drop .DS_Store files"
```

---

## Task 2: Backend env config + db.js

**Files:**
- Create: `server/.env.example`
- Modify: `server/db.js`

- [ ] **Step 1: Create `server/.env.example`**

```
MONGO_URI=mongodb://localhost:27017/crm
JWT_SECRET=change-me-to-a-long-random-string
ADMIN_USER=ssc
ADMIN_PASS_HASH=
```

- [ ] **Step 2: Create real `server/.env` (gitignored) by copying the example**

```bash
cp server/.env.example server/.env
```

- [ ] **Step 3: Rewrite `server/db.js` to read `MONGO_URI` from env**

```javascript
import mongoose from "mongoose";

const Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("error connecting Database", error);
    }
}

export default Connection;
```

- [ ] **Step 4: Commit**

```bash
git add server/.env.example server/db.js
git commit -m "fix: read mongo connection string from env instead of hardcoded localhost/admin db"
```

---

## Task 3: Customer schema — drop auto-increment, add types

**Files:**
- Modify: `server/schema/customer-schema.js`

- [ ] **Step 1: Rewrite the schema**

```javascript
import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    device: String,
    brand: String,
    name: String,
    mobile: String,
    problem: String,
    cost: Number,
    note: String,
    date: String,
    time: String,
    status: {
        type: String,
        enum: ['pending', 'checked', 'completed', 'repaired', 'not-repaired'],
        default: 'pending',
    },
    time2: String,
}, { timestamps: true });

const Customer = mongoose.model('customer', customerSchema);

export default Customer;
```

Note: `date`/`time` stay `String` because the frontend already formats them as localized display strings (`AddCustomer.jsx`) before sending — changing to `Date` would require also changing that formatting logic, which is out of scope for this plan.

- [ ] **Step 2: Remove `mongoose-auto-increment` from `server/package.json` dependencies, add nothing else here**

Edit `server/package.json`, delete the line:
```
"mongoose-auto-increment": "^5.0.1",
```

- [ ] **Step 3: Reinstall server deps**

```bash
cd server && npm install && cd ..
```

- [ ] **Step 4: Commit**

```bash
git add server/schema/customer-schema.js server/package.json server/package-lock.json
git commit -m "fix: drop unmaintained mongoose-auto-increment, use default _id, type status/cost fields"
```

---

## Task 4: Order schema

**Files:**
- Create: `server/schema/order-schema.js`

- [ ] **Step 1: Create the schema**

```javascript
import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    name: String,
    mobile: String,
    productDetails: String,
    totalAmount: Number,
    advanceAmount: Number,
    note: String,
    date: String,
    time: String,
    status: {
        type: String,
        enum: ['pending', 'complete'],
        default: 'pending',
    },
}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);

export default Order;
```

- [ ] **Step 2: Commit**

```bash
git add server/schema/order-schema.js
git commit -m "feat: add real Order schema (orders were incorrectly stored in the customer collection)"
```

---

## Task 5: Auth — bcrypt hash script, middleware, controller, routes

**Files:**
- Create: `server/scripts/generate-password-hash.js`
- Create: `server/middleware/auth-middleware.js`
- Create: `server/controllers/auth-controller.js`
- Create: `server/routes/auth-routes.js`
- Modify: `server/package.json` (add `jsonwebtoken`, `bcryptjs`)

- [ ] **Step 1: Add auth deps**

```bash
cd server && npm install jsonwebtoken bcryptjs && cd ..
```

- [ ] **Step 2: Create `server/scripts/generate-password-hash.js`**

```javascript
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
    console.log("Usage: node scripts/generate-password-hash.js <password>");
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

- [ ] **Step 3: Generate a real hash and put it in `server/.env`**

```bash
cd server && node scripts/generate-password-hash.js 'your-real-shop-password' && cd ..
```

Copy the printed hash into `server/.env` as `ADMIN_PASS_HASH=<hash>`. Set `ADMIN_USER` to whatever username the shop should use.

- [ ] **Step 4: Create `server/middleware/auth-middleware.js`**

```javascript
import jwt from "jsonwebtoken";

const authMiddleware = (request, response, next) => {
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return response.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        response.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default authMiddleware;
```

- [ ] **Step 5: Create `server/controllers/auth-controller.js`**

```javascript
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (request, response) => {
    try {
        const { username, password } = request.body;

        const validUser = username === process.env.ADMIN_USER;
        const validPassword = validUser && await bcrypt.compare(password, process.env.ADMIN_PASS_HASH);

        if (!validPassword) {
            return response.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' });
        response.json({ token });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internal server error' });
    }
};
```

- [ ] **Step 6: Create `server/routes/auth-routes.js`**

```javascript
import express from "express";
import { login } from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/login', login);

export default router;
```

- [ ] **Step 7: Remove `loginForm` from `server/controllers/customer-controller.js`**

Delete the entire `export const loginForm = ...` block (it's replaced by `auth-controller.js`).

- [ ] **Step 8: Commit**

```bash
git add server/scripts server/middleware server/controllers/auth-controller.js server/routes/auth-routes.js server/controllers/customer-controller.js server/package.json server/package-lock.json server/.env.example
git commit -m "feat: real server-side login with bcrypt + JWT, replacing hardcoded client-side check"
```

---

## Task 6: Fix customer controller, split routes, wire auth middleware

**Files:**
- Modify: `server/controllers/customer-controller.js`
- Create: `server/routes/customer-routes.js`
- Create: `server/routes/order-routes.js`
- Modify: `server/controllers/order-controller.js`
- Delete: `server/routes/route.js`
- Modify: `server/index.js`

- [ ] **Step 1: Fix `changeStatus` and clean up `server/controllers/customer-controller.js`**

Full file:

```javascript
import Customer from '../schema/customer-schema.js'

export const addCustomer = async (request, response) => {
    const customer = request.body;
    const newCustomer = new Customer(customer);

    try {
        await newCustomer.save();
        response.status(201).json(newCustomer);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const getCustomers = async (request, response) => {
    try {
        const customers = await Customer.find({});
        response.status(200).json(customers);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const getCustomer = async (request, response) => {
    try {
        const customer = await Customer.findById(request.params.id);
        response.status(200).json(customer);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const editCustomer = async (request, response) => {
    const customer = request.body;
    try {
        const updated = await Customer.findByIdAndUpdate(request.params.id, customer, { new: true });
        response.status(200).json(updated);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const deleteCustomer = async (request, response) => {
    try {
        await Customer.deleteOne({ _id: request.params.id })
        response.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const changeStatus = async (request, response) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            request.params.id,
            { status: request.body.status, time2: request.body.time2 },
            { new: true }
        );
        response.status(200).json(customer);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}
```

- [ ] **Step 2: Rewrite `server/controllers/order-controller.js`**

```javascript
import Order from '../schema/order-schema.js'

export const addOrder = async (request, response) => {
    const order = request.body;
    const newOrder = new Order(order);

    try {
        await newOrder.save();
        response.status(201).json(newOrder);
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}

export const getOrders = async (request, response) => {
    try {
        const orders = await Order.find({});
        response.status(200).json(orders);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const changeOrderStatus = async (request, response) => {
    try {
        const order = await Order.findByIdAndUpdate(
            request.params.id,
            { status: request.body.status },
            { new: true }
        );
        response.status(200).json(order);
    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}

export const deleteOrder = async (request, response) => {
    try {
        await Order.deleteOne({ _id: request.params.id })
        response.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        response.status(409).json({ message: error.message })
    }
}
```

- [ ] **Step 3: Create `server/routes/customer-routes.js`**

```javascript
import express from "express";
import authMiddleware from '../middleware/auth-middleware.js';
import { addCustomer, getCustomers, getCustomer, editCustomer, deleteCustomer, changeStatus } from '../controllers/customer-controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/add', addCustomer);
router.get('/allCustomer', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', editCustomer);
router.delete('/:id', deleteCustomer);
router.patch('/:id/status', changeStatus);

export default router;
```

- [ ] **Step 4: Create `server/routes/order-routes.js`**

```javascript
import express from "express";
import authMiddleware from '../middleware/auth-middleware.js';
import { addOrder, getOrders, changeOrderStatus, deleteOrder } from '../controllers/order-controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/addOrder', addOrder);
router.get('/allOrders', getOrders);
router.patch('/order/:id/status', changeOrderStatus);
router.delete('/order/:id', deleteOrder);

export default router;
```

- [ ] **Step 5: Delete `server/routes/route.js`**

```bash
rm server/routes/route.js
```

- [ ] **Step 6: Rewrite `server/index.js`**

```javascript
import express from "express";
import dotenv from "dotenv";
import Connection from "./db.js";
import authRoutes from "./routes/auth-routes.js";
import customerRoutes from "./routes/customer-routes.js";
import orderRoutes from "./routes/order-routes.js";
import cors from 'cors'
import bodyParser from "body-parser";

dotenv.config();

const app = express()

app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

app.use('/', authRoutes);
app.use('/', customerRoutes);
app.use('/', orderRoutes);

const PORT = process.env.PORT || 8000;

Connection();

app.listen(PORT, () => console.log(`server running on ${PORT}`));
```

Note: `PUT /:id` previously handled both edit and status-change on the same path (a routing bug — only one could ever fire). This plan splits them: `PUT /:id` is edit-only, status changes moved to `PATCH /:id/status`. The frontend's `changeStatus` API call (Task 9) is updated to match.

- [ ] **Step 7: Verify server boots**

```bash
cd server && npm start
```

Expected: `server running on 8000` and `Database connected successfully` printed, no crash. Stop with Ctrl+C.

- [ ] **Step 8: Commit**

```bash
git add server/controllers server/routes server/index.js
git rm server/routes/route.js 2>/dev/null || true
git commit -m "fix: split routes by resource, fix changeStatus bug, real Order CRUD, require auth on all data routes"
```

---

## Task 7: Root package.json + start-app.bat cleanup

**Files:**
- Modify: `package.json`
- Modify: `start-app.bat`

- [ ] **Step 1: Rewrite root `package.json`**

```json
{
    "name": "revamp-crm",
    "version": "1.0.0",
    "private": true,
    "scripts": {
        "start": "concurrently \"npm run server\" \"npm run frontend\"",
        "server": "cd server && npm start",
        "frontend": "cd frontend && npm start"
    },
    "devDependencies": {
        "concurrently": "^8.0.1"
    }
}
```

- [ ] **Step 2: Reinstall root deps**

```bash
npm install
```

- [ ] **Step 3: Fix `start-app.bat` to actually run both services from repo root**

```bat
@echo off
cd /d "%~dp0"
call npm start
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json start-app.bat
git commit -m "chore: strip duplicated frontend/server deps from root package.json, fix start-app.bat"
```

---

## Task 8: Frontend auth client + PrivateRoute

**Files:**
- Create: `frontend/src/services/apiClient.js`
- Create: `frontend/src/component/PrivateRoute.jsx`

- [ ] **Step 1: Create `frontend/src/services/apiClient.js`**

```javascript
import axios from 'axios';

const URL = 'http://localhost:8000';

const apiClient = axios.create({ baseURL: URL });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
```

- [ ] **Step 2: Create `frontend/src/component/PrivateRoute.jsx`**

```javascript
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/services/apiClient.js frontend/src/component/PrivateRoute.jsx
git commit -m "feat: authenticated axios client + route guard for frontend"
```

---

## Task 9: Rewrite `frontend/src/services/api.js` to use apiClient + new routes

**Files:**
- Modify: `frontend/src/services/api.js`

- [ ] **Step 1: Full rewrite**

```javascript
import apiClient from './apiClient.js';

export const login = async (username, password) => {
    return await apiClient.post('/login', { username, password });
}

export const addCustomer = async (data) => {
    try {
        return await apiClient.post('/add', data)
    } catch (error) {
        console.log("error while calling add user API", error);
    }
}

export const getCustomers = async () => {
    try {
        return await apiClient.get('/allCustomer')
    } catch (error) {
        console.log("error while calling get AllUser API", error);
    }
}

export const getCustomer = async (id) => {
    try {
        return await apiClient.get(`/${id}`)
    } catch (error) {
        console.log("error while calling get user API", error);
    }
}

export const editCustomer = async (customer, id) => {
    try {
        return await apiClient.put(`/${id}`, customer)
    } catch (error) {
        console.log("error while calling edit API", error);
    }
}

export const deleteCustomer = async (id) => {
    try {
        return await apiClient.delete(`/${id}`)
    } catch (error) {
        console.log("error while calling delete API", error);
    }
}

export const changeStatus = async (id, newStatus, timeofdelivery) => {
    try {
        return await apiClient.patch(`/${id}/status`, { status: newStatus, time2: timeofdelivery });
    } catch (error) {
        console.log("error while calling change status API", error);
    }
}

export const addOrder = async (data) => {
    try {
        return await apiClient.post('/addOrder', data)
    } catch (error) {
        console.log("error while calling add order API", error);
    }
}

export const getOrders = async () => {
    try {
        return await apiClient.get('/allOrders');
    } catch (error) {
        console.log("error while calling get orders API", error);
    }
}

export const changeOrderStatus = async (id, newStatus) => {
    try {
        return await apiClient.patch(`/order/${id}/status`, { status: newStatus });
    } catch (error) {
        console.log("error while calling change order status API", error);
    }
}

export const deleteOrder = async (id) => {
    try {
        return await apiClient.delete(`/order/${id}`)
    } catch (error) {
        console.log("error while calling delete order API", error);
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/services/api.js
git commit -m "fix: point frontend API calls at split backend routes, add order status/delete endpoints"
```

---

## Task 10: Real Login page

**Files:**
- Modify: `frontend/src/component/Login.jsx`

- [ ] **Step 1: Rewrite to call the server and store the JWT**

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api.js';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.token);
      navigate('/all');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="login-title">Verify</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="login-input">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="login-input">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/component/Login.jsx
git commit -m "fix: login now authenticates against the server instead of a hardcoded client-side check"
```

---

## Task 11: MUI theme + wire into index.js

**Files:**
- Create: `frontend/src/theme.js`
- Modify: `frontend/src/index.js`

- [ ] **Step 1: Create `frontend/src/theme.js`**

```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#054F81' },
        secondary: { main: '#2E7D32' },
        background: { default: '#f5f7fa' },
    },
    shape: { borderRadius: 8 },
});

export default theme;
```

- [ ] **Step 2: Wrap app in `ThemeProvider` in `frontend/src/index.js`**

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/theme.js frontend/src/index.js
git commit -m "feat: add shared MUI theme, apply CssBaseline"
```

---

## Task 12: Rebuild NavBar on MUI v5 with correct links + logout

**Files:**
- Modify: `frontend/src/component/NavBar.jsx`

- [ ] **Step 1: Full rewrite**

```javascript
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Tabs, Tab, IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const tabs = [
  { label: 'Add Customer', to: '/' },
  { label: 'Pending', to: '/pending' },
  { label: 'Checked', to: '/checked' },
  { label: 'Completed', to: '/completed' },
  { label: 'All Customers', to: '/all' },
  { label: 'Orders', to: '/orders' },
  { label: 'All Orders', to: '/Allorders' },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = tabs.some(t => t.to === location.pathname) ? location.pathname : false;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Tabs
          value={currentTab}
          textColor="inherit"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map(tab => (
            <Tab key={tab.to} label={tab.label} value={tab.to} to={tab.to} component={NavLink} />
          ))}
        </Tabs>
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/component/NavBar.jsx
git commit -m "fix: rebuild NavBar with correct tab labels/links (previously mismatched), drop MUI v4, add logout"
```

---

## Task 13: Rewrite Pending.jsx (was a leftover unrelated placeholder page)

**Files:**
- Modify: `frontend/src/component/Pending.jsx`

- [ ] **Step 1: Rewrite to list pending customers, matching Checked.jsx's pattern**

```javascript
import { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Tooltip, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { getCustomers, changeStatus } from '../services/api.js';
import styled from 'styled-components';

const StyleTable = styled(Table)`
    width: 90%;
    margin: 50px auto 0 auto;
`;

const THead = styled(TableRow)`
    & > th {
        font-size: 18px;
        background-color: #054F81;
        color: #fff;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
    }
`;

const TBody = styled(TableRow)`
    & > td {
        font-size: 16px;
        text-align: center;
    }
`;

const Pending = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        const response = await getCustomers();
        setCustomers(response.data.filter(c => c.status === 'pending'));
    }

    const markChecked = async (id) => {
        await changeStatus(id, 'checked');
        loadPending();
    }

    return (
        <Paper>
            <StyleTable>
                <TableHead>
                    <THead>
                        <TableCell>Id</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Device</TableCell>
                        <TableCell>Problem</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Actions</TableCell>
                    </THead>
                </TableHead>
                <TableBody>
                    {customers.map(customer => (
                        <TBody key={customer._id}>
                            <TableCell>{customer._id}</TableCell>
                            <TableCell>{customer.date + ' @ ' + customer.time}</TableCell>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.mobile}</TableCell>
                            <TableCell>{customer.device}</TableCell>
                            <TableCell>{customer.problem}</TableCell>
                            <TableCell>{customer.cost}</TableCell>
                            <TableCell>
                                <Tooltip title="Mark as Checked">
                                    <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => markChecked(customer._id)}>
                                        Check
                                    </Button>
                                </Tooltip>
                                <Button variant="contained" color="info" component={Link} to={`/edit/${customer._id}`}>Edit</Button>
                            </TableCell>
                        </TBody>
                    ))}
                </TableBody>
            </StyleTable>
        </Paper>
    );
}

export default Pending;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/component/Pending.jsx
git commit -m "fix: replace leftover unrelated placeholder page with the actual pending-customers list"
```

---

## Task 14: Drop MUI v4 from Checked.jsx, Completed.jsx, AllCustomers.jsx, AllOrders.jsx, CustomerDetail.jsx, EditCustomer.jsx, AddCustomer.jsx, Orders.jsx

**Files:**
- Modify: `frontend/src/component/Checked.jsx`
- Modify: `frontend/src/component/Completed.jsx`
- Modify: `frontend/src/component/AllCustomers.jsx`
- Modify: `frontend/src/component/AllOrders.jsx`
- Modify: `frontend/src/component/CustomerDetail.jsx`
- Modify: `frontend/src/component/EditCustomer.jsx`
- Modify: `frontend/src/component/AddCustomer.jsx`
- Modify: `frontend/src/component/Orders.jsx`

Each of these currently imports at least one of `@material-ui/core`'s `Chip`, `Paper`, `Tooltip`, `Grid`, `Box`. All have MUI v5 equivalents with the same prop API.

- [ ] **Step 1: In each file, replace the v4 import lines with v5 equivalents**

Replace:
```javascript
import Chip from '@material-ui/core/Chip';
```
with (add to the existing `@mui/material` import list):
```javascript
import { Chip } from '@mui/material';
```

Same pattern for `Paper`, `Tooltip`, `Grid`, `Box` — remove the `@material-ui/core` import line and add the name to the existing `@mui/material` destructured import at the top of the file. (`@mui/material`'s `Chip`, `Paper`, `Tooltip`, `Grid`, `Box` accept the same props these files already use — `label`, `style`, `title`, `placement`, `container`/`item`/`xs`/`md`/`spacing`, `mt` — no other code in these files needs to change.)

- [ ] **Step 2: In `AllCustomers.jsx` and `AllOrders.jsx`, replace `material-ui-search-bar`'s `SearchBar` with a MUI `TextField`**

Replace:
```javascript
import SearchBar from 'material-ui-search-bar';
```
with:
```javascript
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
```

Replace the `<SearchBar ... />` usage with:
```javascript
<TextField
    value={searched}
    onChange={(e) => requestSearch(e.target.value)}
    placeholder="Search"
    variant="outlined"
    InputProps={{
        startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
        ),
    }}
    sx={{ width: '50%', margin: '50px auto 0 auto', display: 'block' }}
/>
```

Remove the now-unused `cancelSearch` function and its call sites (the plain `TextField` doesn't have a built-in cancel button; clearing the field to empty already shows all results via `requestSearch('')`).

- [ ] **Step 3: Verify no remaining `@material-ui/core` imports anywhere in `frontend/src`**

```bash
grep -rl "@material-ui/core" frontend/src || echo "none found"
```

Expected: `none found`.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/component
git commit -m "chore: unify on MUI v5, drop @material-ui/core v4 and material-ui-search-bar"
```

---

## Task 15: Wire Orders.jsx / AllOrders.jsx to the real Order API

**Files:**
- Modify: `frontend/src/component/Orders.jsx`
- Modify: `frontend/src/component/AllOrders.jsx`
- Modify: `frontend/src/component/AddCustomer.jsx`

- [ ] **Step 1: In `AddCustomer.jsx`, remove the `order.status='Pending-Order'` line (status now defaults server-side to `'pending'` per the new Order schema)**

Change:
```javascript
    const addOrderDetails = async () => {
        order.status='Pending-Order'
        await addOrder(order);
        nevigate('/orders')
    }
```
to:
```javascript
    const addOrderDetails = async () => {
        const currentTime = new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric'
        });
        const currentDate = new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric'
        });
        order.time = currentTime;
        order.date = currentDate;
        await addOrder(order);
        nevigate('/orders')
    }
```

- [ ] **Step 2: In `Orders.jsx`, replace `getCustomers`/status-string filtering with real order calls**

Change the import:
```javascript
import { getOrders, changeOrderStatus, deleteOrder } from '../services/api.js'
```

Change `getAllCustomers`:
```javascript
    const getAllCustomers = async () => {
        let response = await getOrders();
        const orders = response.data.filter(e => e.status === 'pending');
        setOrder(orders);
    }
```

Change `markChecked` call site (was `changeStatus(order._id, 'Complete-Order')`):
```javascript
onClick={() => markChecked(order._id, 'complete')}
```
and the function body:
```javascript
    const markChecked = async (id, newStatus) => {
        try {
            await changeOrderStatus(id, newStatus);
            getAllCustomers();
        } catch (error) {
            console.log('Error while marking order as complete', error);
        }
    }
```

Change `deleteCustomerDetails`:
```javascript
    const deleteOrderDetails = async (id) => {
        await deleteOrder(id);
        getAllCustomers();
    }
```
and update its call site from `deleteCustomerDetails(order._id)` to `deleteOrderDetails(order._id)`.

- [ ] **Step 3: In `AllOrders.jsx`, same swap**

Change the import:
```javascript
import { getOrders, deleteOrder } from '../services/api.js';
```

Change `getAllCustomers`:
```javascript
    const getAllCustomers = async () => {
        let response = await getOrders();
        setOrder(response.data);
        setOriginalCustomers(response.data);
    }
```

Change status Chip logic from `'Pending-Order'`/`'Complete-Order'` to `'pending'`/`'complete'`:
```javascript
backgroundColor: order.status === 'pending' ? 'Orange' :
    order.status === 'complete' ? 'green' : 'black',
```

Change `deleteCustomerDetails` to call `deleteOrder(id)` instead of `deleteCustomer(id)`, matching the rename in Step 2.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/component/Orders.jsx frontend/src/component/AllOrders.jsx frontend/src/component/AddCustomer.jsx
git commit -m "fix: wire Orders/AllOrders pages to the real Order collection instead of magic status strings on customers"
```

---

## Task 16: App.js — PrivateRoute wiring

**Files:**
- Modify: `frontend/src/App.js`

- [ ] **Step 1: Rewrite**

```javascript
import './App.css';

import NavBar from './component/NavBar.jsx';
import AddCustomer from './component/AddCustomer.jsx';
import Pending from './component/Pending.jsx';
import Checked from './component/Checked.jsx';
import AllCustomers from './component/AllCustomers.jsx';
import EditCustomer from './component/EditCustomer.jsx';
import Details from './component/CustomerDetail.jsx';
import Completed from './component/Completed.jsx';
import LoginForm from './component/Login.jsx'
import AllOrders from './component/AllOrders.jsx';
import Orders from './component/Orders.jsx';
import PrivateRoute from './component/PrivateRoute.jsx';

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/' element={<PrivateRoute><AddCustomer /></PrivateRoute>} />
          <Route path='/pending' element={<PrivateRoute><Pending /></PrivateRoute>} />
          <Route path='/checked' element={<PrivateRoute><Checked /></PrivateRoute>} />
          <Route path='/completed' element={<PrivateRoute><Completed /></PrivateRoute>} />
          <Route path='/all' element={<PrivateRoute><AllCustomers /></PrivateRoute>} />
          <Route path='/edit/:id' element={<PrivateRoute><EditCustomer /></PrivateRoute>} />
          <Route path='/info/:id' element={<PrivateRoute><Details /></PrivateRoute>} />
          <Route path='/Allorders' element={<PrivateRoute><AllOrders /></PrivateRoute>} />
          <Route path='/orders' element={<PrivateRoute><Orders /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/App.js
git commit -m "feat: guard all routes except /login behind PrivateRoute"
```

---

## Task 17: Frontend package.json cleanup + unused assets

**Files:**
- Modify: `frontend/package.json`
- Delete: `frontend/src/bg-1.jpg`, `bg-2.png`, `bg3.png`, `bg4.png`, `frontend/public/1.ico`, `2.png`, `IMG_2530.ico.PNG`, `pngegg.png`

- [ ] **Step 1: Confirm nothing references the images to be deleted**

```bash
grep -rl "bg-1.jpg\|bg-2.png\|bg3.png\|bg4.png\|1\.ico\|IMG_2530\|pngegg" frontend/src frontend/public/index.html frontend/public/manifest.json || echo "none found"
```

Expected: `none found`. (If any hits appear, remove that reference before deleting the file, or drop that file from the delete list.)

- [ ] **Step 2: Delete the files**

```bash
rm -f frontend/src/bg-1.jpg frontend/src/bg-2.png frontend/src/bg3.png frontend/src/bg4.png
rm -f frontend/public/1.ico frontend/public/2.png frontend/public/IMG_2530.ico.PNG frontend/public/pngegg.png
```

- [ ] **Step 3: Remove `@material-ui/core` and `material-ui-search-bar` from `frontend/package.json` dependencies**

Delete these two lines from `frontend/package.json`:
```
"@material-ui/core": "^4.12.4",
"@material-ui/icons": "^4.11.3",
"material-ui-search-bar": "^1.0.0",
```
(`@material-ui/icons` is also unused — confirm first: `grep -rl "@material-ui/icons" frontend/src` should print nothing, since `AllCustomers.jsx`/`Orders.jsx` already use `@mui/icons-material/Delete`.)

- [ ] **Step 4: Reinstall**

```bash
cd frontend && npm install && cd ..
```

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git add -u frontend/src frontend/public
git commit -m "chore: remove unused images and MUI v4 packages from frontend"
```

---

## Task 18: Manual end-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Start MongoDB locally (if not already running)**

```bash
mongod --dbpath /usr/local/var/mongodb 2>&1 &
```
(Skip if MongoDB already runs as a service.)

- [ ] **Step 2: Start the app**

```bash
npm start
```

Expected: server logs `server running on 8000` and `Database connected successfully`; frontend opens `http://localhost:3000`.

- [ ] **Step 3: Verify auth is enforced**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/allCustomer
```
Expected: `401` (no token).

- [ ] **Step 4: Manual browser walkthrough**

1. Visit `http://localhost:3000/all` while logged out → should redirect to `/login`.
2. Log in with the username/password set in Task 5 Step 3 → should redirect to `/all`.
3. Add a new customer via the `/` (Add Customer) page → appears under `/pending`.
4. On `/pending`, click "Check" → customer moves to `/checked`.
5. On `/checked`, mark complete → customer moves to `/completed`.
6. On `/completed`, mark repaired/not-repaired → status updates, visible on `/all`.
7. Edit a customer via `/edit/:id` → changes persist.
8. Delete a customer from `/all` → removed from list.
9. Add a new order via the `/` (Add Customer) page's order form → appears under `/orders`.
10. On `/orders`, mark complete → status updates, visible on `/Allorders`.
11. Delete an order → removed from list.
12. Click Logout in the nav bar → redirected to `/login`, and visiting `/all` again redirects back to `/login`.

- [ ] **Step 5: Record result**

If all steps pass, the revamp is functionally complete. If any step fails, fix before considering the plan done — do not mark this task complete on partial success.
