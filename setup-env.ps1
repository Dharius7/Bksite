# Setup Environment Files Script
# This script creates necessary .env files if they don't exist

Write-Host "Setting up environment files..." -ForegroundColor Green

# Create backend .env file
$backendEnvPath = "backend\nodejs\.env"
if (-not (Test-Path $backendEnvPath)) {
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    $backendEnvContent = @"
PORT=5000
JWT_SECRET=coral-credit-bank-secret-key-change-in-production-2024
MONGODB_URI=mongodb://localhost:27017/coral-credit-bank
NODE_ENV=development
"@
    Set-Content -Path $backendEnvPath -Value $backendEnvContent
    Write-Host "✓ Backend .env file created!" -ForegroundColor Green
} else {
    Write-Host "✓ Backend .env file already exists" -ForegroundColor Green
}

# Create frontend .env.local file
$frontendEnvPath = ".env.local"
if (-not (Test-Path $frontendEnvPath)) {
    Write-Host "Creating frontend .env.local file..." -ForegroundColor Yellow
    $frontendEnvContent = @"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
"@
    Set-Content -Path $frontendEnvPath -Value $frontendEnvContent
    Write-Host "✓ Frontend .env.local file created!" -ForegroundColor Green
} else {
    Write-Host "✓ Frontend .env.local file already exists" -ForegroundColor Green
}

Write-Host "`nEnvironment setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MongoDB is running"
Write-Host "2. Run: cd backend/nodejs && npm run seed"
Write-Host "3. Start backend: cd backend/nodejs && npm run dev"
Write-Host "4. Start frontend: npm run dev"
