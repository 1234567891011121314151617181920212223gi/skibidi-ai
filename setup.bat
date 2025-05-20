@echo off
echo ====================================
echo       SkibidiAI Setup Script
echo ====================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    echo Please install npm and try again
    echo.
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo [2/4] Installing Next.js...
call npm install next

echo [3/4] Installing React...
call npm install react react-dom

echo [4/4] Setting up development environment...
echo Creating .env.local file...
(
echo NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
echo NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
) > .env.local

echo.
echo ====================================
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Update the .env.local file with your Firebase credentials
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo ====================================
echo.

pause