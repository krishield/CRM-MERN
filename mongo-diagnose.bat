@echo off
setlocal

set "MONGO_DIR=C:\Program Files\MongoDB\Server\8.3"
set "OUT=%~dp0mongo-diagnose-result.txt"

echo Checking MongoDB install... > "%OUT%"
echo. >> "%OUT%"

if not exist "%MONGO_DIR%\bin\mongod.exe" (
    echo mongod.exe NOT FOUND at %MONGO_DIR%\bin\mongod.exe >> "%OUT%"
    echo Check what version folder actually exists under: >> "%OUT%"
    dir "C:\Program Files\MongoDB\Server\" >> "%OUT%" 2>&1
    goto :end
)
echo mongod.exe found: OK >> "%OUT%"

if not exist "%MONGO_DIR%\bin\mongod.cfg" (
    echo mongod.cfg NOT FOUND >> "%OUT%"
    goto :end
)
echo mongod.cfg found: OK >> "%OUT%"
echo. >> "%OUT%"
echo --- mongod.cfg contents --- >> "%OUT%"
type "%MONGO_DIR%\bin\mongod.cfg" >> "%OUT%"
echo. >> "%OUT%"

echo. >> "%OUT%"
echo --- data folder --- >> "%OUT%"
if exist "%MONGO_DIR%\data" (
    echo data folder exists: OK >> "%OUT%"
) else (
    echo data folder MISSING at %MONGO_DIR%\data >> "%OUT%"
)

echo. >> "%OUT%"
echo --- log folder --- >> "%OUT%"
if exist "%MONGO_DIR%\log" (
    echo log folder exists: OK >> "%OUT%"
) else (
    echo log folder MISSING at %MONGO_DIR%\log >> "%OUT%"
)

echo. >> "%OUT%"
echo --- port 27017 check --- >> "%OUT%"
netstat -an | find "27017" >> "%OUT%"
if errorlevel 1 echo Nothing listening on 27017 yet >> "%OUT%"

echo. >> "%OUT%"
echo --- trying to start mongod directly (10 second test) --- >> "%OUT%"
start "" /B "%MONGO_DIR%\bin\mongod.exe" --config "%MONGO_DIR%\bin\mongod.cfg" >> "%OUT%" 2>&1
timeout /t 5 >nul
netstat -an | find "27017" >> "%OUT%"
taskkill /IM mongod.exe /F >nul 2>&1

:end
echo. >> "%OUT%"
echo Done. Open mongo-diagnose-result.txt next to this file and send its contents. >> "%OUT%"
type "%OUT%"
pause
