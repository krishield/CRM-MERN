@echo off
cd /d "%~dp0"

echo ============================================
echo   KD CRM - Install
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed.
    echo Download and install it from: https://nodejs.org/  (choose the LTS version)
    echo Then run this install.bat again.
    pause
    exit /b 1
)

where mongod >nul 2>nul
if errorlevel 1 (
    echo MongoDB does not seem to be installed.
    echo Download and install "MongoDB Community Server" from:
    echo   https://www.mongodb.com/try/download/community
    echo During install, keep "Install MongoDB as a Service" checked ^(default^) so it starts automatically.
    echo Then run this install.bat again.
    pause
    exit /b 1
)

echo Installing dependencies, this can take a few minutes...
call npm install
if errorlevel 1 goto :fail

cd server
call npm install
if errorlevel 1 goto :fail
cd ..

cd frontend
call npm install
if errorlevel 1 goto :fail
cd ..

echo.
echo ============================================
echo   Install complete!
echo   Double-click start-app.bat to run the app.
echo   Default login: admin / 9595
echo ============================================
pause
exit /b 0

:fail
echo.
echo Something went wrong during install. Scroll up to see the error.
pause
exit /b 1
