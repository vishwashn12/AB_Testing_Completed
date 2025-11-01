# Monorepo Setup Script for Windows PowerShell
# Run this script after restructuring to set up the new monorepo

Write-Host "================================" -ForegroundColor Cyan
Write-Host "A/B Testing Platform - Monorepo Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18 or higher from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install root dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "Root dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Install workspace dependencies
Write-Host "Installing workspace dependencies..." -ForegroundColor Yellow
npm install --workspaces

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install workspace dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "Workspace dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Copy environment files if they exist
Write-Host "Checking for environment files..." -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    Write-Host "Copying backend .env file..." -ForegroundColor Yellow
    Copy-Item "backend\.env" "apps\backend\.env"
    Write-Host "Backend .env copied!" -ForegroundColor Green
} else {
    Write-Host "No backend .env found. Please create apps\backend\.env from .env.example" -ForegroundColor Yellow
}

if (Test-Path "frontend\.env") {
    Write-Host "Copying frontend .env file..." -ForegroundColor Yellow
    Copy-Item "frontend\.env" "apps\frontend\.env"
    Write-Host "Frontend .env copied!" -ForegroundColor Green
} else {
    Write-Host "No frontend .env found. Please create apps\frontend\.env from .env.example" -ForegroundColor Yellow
}

Write-Host ""

# Success message
Write-Host "================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  npm run dev           - Run both frontend and backend" -ForegroundColor White
Write-Host "  npm run dev:backend   - Run backend only" -ForegroundColor White
Write-Host "  npm run dev:frontend  - Run frontend only" -ForegroundColor White
Write-Host "  npm run build         - Build both applications" -ForegroundColor White
Write-Host "  npm test              - Run all tests" -ForegroundColor White
Write-Host "  npm run lint          - Lint all code" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review MIGRATION_GUIDE.md for detailed information" -ForegroundColor White
Write-Host "  2. Create .env files in apps/backend and apps/frontend" -ForegroundColor White
Write-Host "  3. Run 'npm run dev' to start development" -ForegroundColor White
Write-Host ""
