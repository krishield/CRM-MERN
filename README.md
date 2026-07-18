# KD CRM

Local customer/repair-order CRM for the shop. React frontend + Express/MongoDB backend.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Community](https://www.mongodb.com/try/download/community) running locally
  - macOS: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`

## Setup on a new machine

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/krishield/CRM-MERN.git
   cd CRM-MERN
   npm install
   cd server && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

2. Create `server/.env` (copy `server/.env.example` and fill in real values):
   ```
   MONGO_URI=mongodb://localhost:27017/crm
   JWT_SECRET=<a long random string>
   ADMIN_USER=<login username>
   ADMIN_PASS_HASH=<bcrypt hash, generate with the command below>
   ```
   Generate the password hash:
   ```bash
   cd server && node scripts/generate-password-hash.js 'your-password' && cd ..
   ```
   Paste the printed hash into `ADMIN_PASS_HASH`.

3. (Optional) Frontend runs on port 4000 by default via `frontend/.env` (`PORT=4000`). Change it there if needed.

4. Start MongoDB if it isn't already running:
   ```bash
   brew services start mongodb-community
   ```

## Running

From the repo root:
```bash
npm start
```
This runs backend (`http://localhost:8000`) and frontend (`http://localhost:4000`) together.

Or run them separately:
```bash
npm run server     # backend only, port 8000
npm run frontend    # frontend only, port 4000
```

On Windows, double-click `start-app.bat` (runs `npm start` from the repo root).

## Login

Use the username/password set up in `server/.env` during setup (step 2).

## Notes

- Customer IDs are sequential (`KD001`, `KD002`, ...), assigned automatically on add.
- `server/.env` and `frontend/.env` are gitignored — each machine needs its own copy (steps 2-3 above).
