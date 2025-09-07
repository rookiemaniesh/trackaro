@echo off
REM Trackaro Backend - Render Deployment Script for Windows
REM This script helps deploy the backend to Render

echo 🚀 Trackaro Backend - Render Deployment Script
echo =============================================
echo.

REM Check if Render CLI is installed
echo [INFO] Checking Render CLI installation...
render --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Render CLI is not installed!
    echo Please install it using: npm install -g @render/cli
    pause
    exit /b 1
)
echo [SUCCESS] Render CLI is installed
echo.

REM Check if user is logged in to Render
echo [INFO] Checking Render authentication...
render auth whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not logged in to Render. Please login first:
    echo render auth login
    pause
    exit /b 1
)
echo [SUCCESS] Logged in to Render
echo.

REM Check if project is linked
echo [INFO] Checking if project is linked to Render...
if not exist ".render\project.json" (
    echo [WARNING] Project not linked to Render. Please link it first:
    echo render link
    pause
    exit /b 1
)
echo [SUCCESS] Project is linked to Render
echo.

REM Deploy to Render
echo [INFO] Deploying to Render...
echo [INFO] Deploying application...
render deploy
if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed!
    pause
    exit /b 1
)

echo [SUCCESS] Deployment completed!
echo.

echo [INFO] Waiting for deployment to complete...
timeout /t 15 /nobreak >nul

REM Test deployment
echo [INFO] Testing deployment...
render services list | findstr "trackaro-backend" > temp_url.txt
if %errorlevel% neq 0 (
    echo [WARNING] Could not get deployment URL from Render CLI
    echo Please check your Render dashboard for the service URL
) else (
    set /p url=<temp_url.txt
    echo [INFO] Testing health endpoint: %url%/health
    curl -f -s "%url%/health" >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Health check failed!
        echo Please check the deployment logs in Render dashboard
        del temp_url.txt
        pause
        exit /b 1
    ) else (
        echo [SUCCESS] Health check passed!
    )
    del temp_url.txt
)

echo.
echo [SUCCESS] Render deployment completed successfully!
echo.
echo Your API is now available. Check the URL above.
echo.
echo Next steps:
echo 1. Update your frontend with the new API URL
echo 2. Test all endpoints to ensure everything works
echo 3. Monitor logs in Render dashboard
echo 4. Set up monitoring and alerts
echo.
pause
