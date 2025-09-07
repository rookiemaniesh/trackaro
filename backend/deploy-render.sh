#!/bin/bash

# Trackaro Backend - Render Deployment Script
# This script helps deploy the backend to Render

set -e

echo "🚀 Trackaro Backend - Render Deployment Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Render CLI is installed
check_render_cli() {
    print_status "Checking Render CLI installation..."
    
    if ! command -v render &> /dev/null; then
        print_error "Render CLI is not installed!"
        echo "Please install it using: npm install -g @render/cli"
        exit 1
    fi
    
    print_success "Render CLI is installed"
}

# Check if user is logged in to Render
check_render_auth() {
    print_status "Checking Render authentication..."
    
    if ! render auth whoami &> /dev/null; then
        print_warning "Not logged in to Render. Please login first:"
        echo "render auth login"
        exit 1
    fi
    
    print_success "Logged in to Render"
}

# Check if project is linked
check_project_link() {
    print_status "Checking if project is linked to Render..."
    
    if [ ! -f ".render/project.json" ]; then
        print_warning "Project not linked to Render. Please link it first:"
        echo "render link"
        exit 1
    fi
    
    print_success "Project is linked to Render"
}

# Check environment variables
check_env_vars() {
    print_status "Checking required environment variables..."
    
    # List of required environment variables
    required_vars=(
        "JWT_SECRET"
        "SESSION_SECRET"
        "GOOGLE_CLIENT_ID"
        "GOOGLE_CLIENT_SECRET"
        "TELEGRAM_BOT_TOKEN"
        "TELEGRAM_BOT_USERNAME"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! render env list | grep -q "$var"; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        echo ""
        echo "Please set them using: render env set VARIABLE_NAME=value"
        exit 1
    fi
    
    print_success "All required environment variables are set"
}

# Generate secure secrets
generate_secrets() {
    print_status "Generating secure secrets..."
    
    # Generate JWT secret
    jwt_secret=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
    echo "JWT_SECRET=$jwt_secret"
    
    # Generate session secret
    session_secret=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo "SESSION_SECRET=$session_secret"
    
    print_success "Secure secrets generated (copy these to Render environment variables)"
}

# Deploy to Render
deploy() {
    print_status "Deploying to Render..."
    
    # Deploy the application
    print_status "Deploying application..."
    render deploy
    
    print_success "Deployment completed!"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Get the deployment URL
    url=$(render services list | grep "trackaro-backend" | awk '{print $3}')
    
    if [ -z "$url" ]; then
        print_warning "Could not get deployment URL from Render CLI"
        print_status "Please check your Render dashboard for the service URL"
        return
    fi
    
    print_status "Testing health endpoint: $url/health"
    
    # Test health endpoint
    if curl -f -s "$url/health" > /dev/null; then
        print_success "Health check passed!"
    else
        print_error "Health check failed!"
        echo "Please check the deployment logs in Render dashboard"
        exit 1
    fi
}

# Setup Telegram webhook
setup_telegram_webhook() {
    print_status "Setting up Telegram webhook..."
    
    # Get the deployment URL
    url=$(render services list | grep "trackaro-backend" | awk '{print $3}')
    
    if [ -z "$url" ]; then
        print_warning "Could not get deployment URL from Render CLI"
        print_status "Please check your Render dashboard for the service URL"
        return
    fi
    
    webhook_url="$url/api/telegram/webhook"
    
    # Get Telegram bot token
    bot_token=$(render env list | grep "TELEGRAM_BOT_TOKEN" | cut -d'=' -f2)
    
    if [ -z "$bot_token" ]; then
        print_error "TELEGRAM_BOT_TOKEN not found in Render environment variables"
        exit 1
    fi
    
    # Set webhook
    print_status "Setting webhook URL: $webhook_url"
    
    response=$(curl -s -X POST "https://api.telegram.org/bot$bot_token/setWebhook" \
        -H "Content-Type: application/json" \
        -d "{\"url\": \"$webhook_url\"}")
    
    if echo "$response" | grep -q '"ok":true'; then
        print_success "Telegram webhook set successfully!"
    else
        print_error "Failed to set Telegram webhook:"
        echo "$response"
        exit 1
    fi
}

# Main deployment flow
main() {
    echo ""
    print_status "Starting Render deployment process..."
    echo ""
    
    # Pre-deployment checks
    check_render_cli
    check_render_auth
    check_project_link
    check_env_vars
    
    echo ""
    print_status "Pre-deployment checks passed!"
    echo ""
    
    # Deploy
    deploy
    
    echo ""
    print_status "Waiting for deployment to complete..."
    sleep 15
    
    # Test deployment
    test_deployment
    
    echo ""
    print_status "Deployment successful! 🎉"
    echo ""
    
    # Setup Telegram webhook
    read -p "Do you want to setup Telegram webhook? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_telegram_webhook
    fi
    
    echo ""
    print_success "Render deployment completed successfully!"
    echo ""
    echo "Your API is now available at:"
    render services list | grep "trackaro-backend"
    echo ""
    echo "Next steps:"
    echo "1. Update your frontend with the new API URL"
    echo "2. Test all endpoints to ensure everything works"
    echo "3. Monitor logs in Render dashboard"
    echo "4. Set up monitoring and alerts"
}

# Handle command line arguments
case "${1:-}" in
    "generate-secrets")
        generate_secrets
        ;;
    "deploy")
        deploy
        ;;
    "test")
        test_deployment
        ;;
    "webhook")
        setup_telegram_webhook
        ;;
    "check")
        check_render_cli
        check_render_auth
        check_project_link
        check_env_vars
        print_success "All checks passed!"
        ;;
    *)
        main
        ;;
esac
