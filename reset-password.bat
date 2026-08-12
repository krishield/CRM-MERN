@echo off
cd /d "%~dp0"

if not exist server\node_modules (
    echo Dependencies not installed yet. Double-click install.bat first.
    pause
    exit /b 1
)

cd server
node scripts/reset-password.js
cd ..

echo.
echo Restart the app (start-app.bat) and log in with the credentials above.
pause
