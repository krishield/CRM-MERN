@echo off
cd /d "%~dp0"

if not exist ".git" (
    echo This folder wasn't set up with git, so it can't auto-update.
    echo Download the latest ZIP from GitHub instead, or ask Shubham to help switch to a git-based setup.
    pause
    exit /b 1
)

echo Checking for updates...
git pull
if errorlevel 1 (
    echo.
    echo Update failed. Scroll up to see the error, or send it to Shubham.
    pause
    exit /b 1
)

echo.
echo Reinstalling anything that changed...
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
echo   Update complete!
echo   Double-click start-app.bat to run the app.
echo ============================================
pause
exit /b 0

:fail
echo.
echo Something went wrong reinstalling dependencies. Scroll up to see the error.
pause
exit /b 1
