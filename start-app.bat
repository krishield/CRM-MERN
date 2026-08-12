@echo off
cd /d "%~dp0"

if not exist server\.env (
    echo First time running this? Double-click setup.bat first.
    pause
    exit /b 1
)

if not exist node_modules (
    echo Dependencies not installed yet. Double-click setup.bat first.
    pause
    exit /b 1
)

if not exist server\node_modules (
    echo Server dependencies not installed yet. Double-click setup.bat first.
    pause
    exit /b 1
)

if not exist frontend\node_modules (
    echo Frontend dependencies not installed yet. Double-click setup.bat first.
    pause
    exit /b 1
)

where mongod >nul 2>nul
if errorlevel 1 (
    echo MongoDB does not seem to be installed or is not on PATH.
    echo Install "MongoDB Community Server" from https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo Starting KD CRM...
echo When ready, it will open at http://localhost:4000
echo Close this window to stop the app.
echo.

call npm start
if errorlevel 1 (
    echo.
    echo App exited with an error. Scroll up to see what went wrong.
    pause
    exit /b 1
)

echo.
echo App stopped.
pause
