@echo off
echo ====================================
echo       Skibidi Toilet Sigma
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

:: Check if node_modules exists and contains key dependencies
if exist "node_modules" (
    echo Checking existing installation...
    
    :: Check for key dependencies
    if exist "node_modules\react" (
        if exist "node_modules\next" (
            if exist "node_modules\firebase" (
                echo [INFO] Dependencies already installed!
                echo.
                echo Starting development server...
                call npm run dev
                pause
            )
        )
    )
)

echo [1/4] Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo [2/3] Installing React...
call npm install react react-dom

@REM echo [3/3] Setting up development environment...
@REM echo Creating .env.local file...
@REM if not exist ".env.local" (
@REM     (
@REM     echo NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
@REM     echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
@REM     echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
@REM     echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
@REM     echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
@REM     echo NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
@REM     ) > .env.local
@REM     echo Created new .env.local file
@REM ) else (
@REM     echo .env.local file already exists
@REM )

echo.
echo ====================================
echo Setup completed successfully!
echo.
echo Starting development server...
call npm run dev

echo.
pause