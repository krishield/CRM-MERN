# KD CRM

Local customer/repair-order CRM for the shop.

## Windows install (for the shop PC)

1. **Install Node.js** — download from [nodejs.org](https://nodejs.org/) (the "LTS" button), run the installer, keep clicking Next.
2. **Install MongoDB** — download "MongoDB Community Server" from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community), run the installer, keep "Install MongoDB as a Service" checked (it's the default) so it starts automatically.
3. **Download this project** — on the GitHub page, green "Code" button → "Download ZIP" → unzip it somewhere (e.g. Desktop).
4. **Double-click `setup.bat`** inside the unzipped folder. It installs everything and asks you to choose a username/password — pick something simple, write it down, it's shown once.
5. **Double-click `start-app.bat`** to run the app. It opens at [http://localhost:4000](http://localhost:4000) in your browser.

### Everyday use (after the one-time setup above)

Just double-click `start-app.bat`. That's it — MongoDB runs automatically in the background (it's a Windows Service, starts on its own when the PC boots), so `start-app.bat` only starts the app itself. No setup, no database work, nothing to configure again.

Leave the black window open while using the app; closing it stops the app. Your customer data is saved on the PC and is not affected by starting, stopping, or restarting the app or the computer.

Only re-run `setup.bat` if you deleted `server/.env` or want to change the login password.

## Mac / Linux setup (for development)

```bash
git clone https://github.com/krishield/CRM-MERN.git
cd CRM-MERN
npm install
cd server && npm install && cd ..
cd frontend && npm install && cd ..
```

Install MongoDB (macOS):
```bash
brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community
```

Create `server/.env` (copy `server/.env.example`, fill in real values):
```
MONGO_URI=mongodb://localhost:27017/crm
JWT_SECRET=<a long random string>
ADMIN_USER=<login username>
ADMIN_PASS_HASH=<bcrypt hash, generate below>
```
```bash
cd server && node scripts/generate-password-hash.js 'your-password' && cd ..
```
Paste the printed hash into `ADMIN_PASS_HASH`.

Create `frontend/.env`:
```
PORT=4000
```

Run:
```bash
npm start
```
Backend on `http://localhost:8000`, frontend on `http://localhost:4000`.

## Notes

- Customer IDs are sequential (`KD001`, `KD002`, ...), assigned automatically.
- `server/.env` and `frontend/.env` are gitignored — each machine needs its own (created by `setup.bat` on Windows, or manually on Mac/Linux, see above).
- Forgot the password? Delete `server/.env` and run `setup.bat` again (Windows) or repeat the manual steps (Mac/Linux) to set a new one.
