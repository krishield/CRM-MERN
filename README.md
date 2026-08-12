# KD CRM

Local customer/repair-order CRM for the shop.

## Windows install (for the shop PC)

1. **Install Node.js** — download from [nodejs.org](https://nodejs.org/) (the "LTS" button), run the installer, keep clicking Next.
2. **Install MongoDB** — download "MongoDB Community Server" from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community), run the installer, keep "Install MongoDB as a Service" checked (it's the default) so it starts automatically.
3. **Get this project.** Two options:
   - **Recommended (supports easy updates later):** install [Git for Windows](https://git-scm.com/download/win) (keep defaults during install), then open Command Prompt, `cd` to where you want it (e.g. `cd Desktop`), and run:
     ```
     git clone https://github.com/krishield/CRM-MERN.git
     ```
   - **Simpler, but no easy updates:** on the GitHub page, green "Code" button → "Download ZIP" → unzip it somewhere (e.g. Desktop).
4. **Install dependencies.** Open Command Prompt in the project folder and run:
     ```
     npm install
     cd server
     npm install
     cd ../frontend
     npm install
     cd ..
     ```
5. **Double-click `start-app.bat`** to run the app. It opens at [http://localhost:4000](http://localhost:4000) in your browser.
6. **Login** with the default credentials:
   - Username: `admin`
   - Password: `9595`

   These come from `server/.env` (auto-created on first server start). To change them, edit `ADMIN_USER`/`ADMIN_PASS_HASH` in `server/.env` — generate a new hash with:
     ```
     cd server
     node scripts/generate-password-hash.js "your-new-password"
     ```
   Paste the printed hash into `ADMIN_PASS_HASH`, restart the app.

### Everyday use

Just double-click `start-app.bat`. That's it — MongoDB runs automatically in the background (it's a Windows Service, starts on its own when the PC boots), so `start-app.bat` only starts the app itself.

Leave the black window open while using the app; closing it stops the app. Your customer data is saved on the PC and is not affected by starting, stopping, or restarting the app or the computer.

### Getting updates

If you cloned with `git` (see step 3 above), pull and reinstall any time:
```
git pull
npm install
cd server && npm install && cd ..
cd frontend && npm install && cd ..
```
Then start the app as usual. This doesn't touch your data or login.

If you used the ZIP download instead, download a fresh ZIP and copy the files over (not `.env`, not `node_modules`) instead.

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

Create `frontend/.env`:
```
PORT=4000
```

Run:
```bash
npm start
```
Backend on `http://localhost:5000`, frontend on `http://localhost:4000`.

`server/.env` is created automatically on first server start if it doesn't exist, with default login `admin`/`9595`. To set your own password instead, generate a hash first:
```bash
cd server && node scripts/generate-password-hash.js 'your-password' && cd ..
```
Then create `server/.env` yourself (copy `server/.env.example`) with that hash in `ADMIN_PASS_HASH`.

## Notes

- Customer IDs are sequential (`KD001`, `KD002`, ...), assigned automatically.
- `server/.env` and `frontend/.env` are gitignored — each machine gets its own (`server/.env` auto-created with default `admin`/`9595` on first run; `frontend/.env` needs the one manual line above).
- Forgot the password? Delete `server/.env` and restart the app — it regenerates with the default `admin`/`9595` login.
