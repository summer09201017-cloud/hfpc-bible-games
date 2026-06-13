@echo off
REM HFPC Bible Games hub launcher. English-only (Chinese breaks .bat parsing on Windows).
setlocal enableextensions
title HFPC Bible Games
cd /d "%~dp0"

echo ============================================
echo    HFPC Bible Games  -  starting...
echo ============================================
echo.

REM ---- need Node.js ----
where node >nul 2>&1
if errorlevel 1 (
  echo  Node.js not found. Install it from https://nodejs.org then run this again.
  echo.
  pause
  exit /b 1
)

echo  *** Keep THIS window open. Close it to stop the server. ***
echo  (A browser tab opens automatically in a few seconds.)
echo.

REM serve.mjs picks a free port and opens the browser. No npm install needed (zero deps).
call node scripts/serve.mjs .

echo.
echo  Server stopped.
pause
exit /b 0
