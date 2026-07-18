@echo off
cd /d "%~dp0"

if not exist server\.env (
    echo First time running this? Double-click setup.bat first.
    pause
    exit /b 1
)

echo Starting KD CRM...
echo When ready, it will open at http://localhost:4000
echo Close this window to stop the app.
echo.

call npm start
