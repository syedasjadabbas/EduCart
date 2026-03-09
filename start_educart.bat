@echo off
echo Starting EduCart Development Environment...

:: Kill existing node processes to free ports
echo Cleaning up existing sessions...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

:: Start Backend
echo Starting Backend (Port 5000)...
cd /d "e:\WEBS & APPS\educart\backend"
start /b node server.js

:: Start Frontend
echo Starting Frontend (Port 5173)...
cd /d "e:\WEBS & APPS\educart\frontend"
start /b node ./node_modules/vite/bin/vite.js --port 5173

:: Wait for start
echo Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

:: Open browser
echo Launching browser...
start http://localhost:5173

echo.
echo --- EduCart is now running! ---
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Keep this terminal open to see logs, or close it after use.
pause
