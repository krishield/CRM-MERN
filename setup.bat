@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================
echo   KD CRM - First time setup
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed.
    echo Download and install it from: https://nodejs.org/  (choose the LTS version)
    echo Then run this setup.bat again.
    pause
    exit /b 1
)

where mongod >nul 2>nul
if errorlevel 1 (
    echo MongoDB does not seem to be installed.
    echo Download and install "MongoDB Community Server" from:
    echo   https://www.mongodb.com/try/download/community
    echo During install, keep "Install MongoDB as a Service" checked ^(default^) so it starts automatically.
    echo Then run this setup.bat again.
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
if exist server\.env (
    echo server\.env already exists, keeping it as-is.
) else (
    echo Setting up your login...
    set /p ADMIN_USER="Choose a username [kd]: "
    if "!ADMIN_USER!"=="" set ADMIN_USER=kd

    set /p ADMIN_PASS="Choose a password [9595]: "
    if "!ADMIN_PASS!"=="" set ADMIN_PASS=9595

    for /f "delims=" %%H in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%H
    for /f "delims=" %%P in ('node server\scripts\generate-password-hash.js "!ADMIN_PASS!"') do set PASS_HASH=%%P

    (
        echo MONGO_URI=mongodb://localhost:27017/crm
        echo JWT_SECRET=!JWT_SECRET!
        echo ADMIN_USER=!ADMIN_USER!
        echo ADMIN_PASS_HASH=!PASS_HASH!
    ) > server\.env

    echo.
    echo Saved. Your login is:
    echo   Username: !ADMIN_USER!
    echo   Password: !ADMIN_PASS!
    echo Write this down - it is not shown again.
)

if exist frontend\.env (
    echo frontend\.env already exists, keeping it as-is.
) else (
    echo PORT=4000> frontend\.env
)

echo.
echo ============================================
echo   Setup complete!
echo   Double-click start-app.bat to run the app.
echo ============================================
pause
exit /b 0

:fail
echo.
echo Something went wrong during install. Scroll up to see the error.
pause
exit /b 1
