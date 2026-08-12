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
6. **First time only:** the app shows a setup screen asking you to choose a username and password — pick something simple, write it down. This only happens once; after that it goes straight to the normal login screen.

### Everyday use (after the one-time setup above)

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
Backend on `http://localhost:8000`, frontend on `http://localhost:4000`.

`server/.env` (MONGO_URI, JWT_SECRET) is created automatically on first server start if it doesn't exist yet — no manual setup needed.

On first load, the app asks you to create a username/password. This is stored in MongoDB, not in a file.

## Notes

- Customer IDs are sequential (`KD001`, `KD002`, ...), assigned automatically.
- `server/.env` and `frontend/.env` are gitignored — each machine gets its own (`server/.env` auto-created on first run; `frontend/.env` needs the one manual line above).
- Forgot the login password? Run `node server/scripts/reset-admin.js` — it clears the saved username/password, and the setup screen will appear again on next load.
