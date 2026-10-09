@echo off
setlocal
cd /d "%~dp0"
echo.
echo Marble Run Maker - Windows x64 build
echo ======================================
where node >nul 2>nul || (echo ERROR: Install Node.js 22 or newer.& exit /b 1)
where npm >nul 2>nul || (echo ERROR: npm is missing.& exit /b 1)
if exist package-lock.json (
  call npm ci --no-audit --no-fund
) else (
  call npm install --no-audit --no-fund
)
if errorlevel 1 exit /b 1
call npm run check
if errorlevel 1 exit /b 1
set CSC_IDENTITY_AUTO_DISCOVERY=false
call npm run dist:win
if errorlevel 1 exit /b 1
call node scripts\verify-windows-build.cjs
if errorlevel 1 exit /b 1
echo.
echo Windows installers and SHA256 checksums are in dist\
exit /b 0
