@echo off
echo This window should stay open. If it closes immediately, tell Shubham.
echo.
echo Current folder:
cd
echo.
echo Node.js check:
where node
node --version
echo.
echo npm check:
where npm
npm --version
echo.
echo MongoDB check:
where mongod
echo.
echo Done checking. Press any key to close.
pause
