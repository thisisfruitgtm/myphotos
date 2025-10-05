# MyPhoto - Photographer Portfolio Installer (Windows)

Write-Host "🎨 MyPhoto - Photographer Portfolio Installer" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "   Visit: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green

# Check if npm is installed
$npmVersion = npm --version 2>$null
if (-not $npmVersion) {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    
    # Generate random session secret
    $sessionSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    
    # Update .env file
    (Get-Content .env) -replace 'change-this-to-a-random-secret-minimum-32-characters', $sessionSecret | Set-Content .env
    
    Write-Host "✅ .env file created with secure session secret" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env file already exists, skipping..." -ForegroundColor Yellow
}
Write-Host ""

# Create uploads directory
Write-Host "📁 Creating uploads directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path public\uploads | Out-Null
New-Item -ItemType File -Force -Path public\uploads\.gitkeep | Out-Null
Write-Host "✅ Uploads directory created" -ForegroundColor Green
Write-Host ""

# Setup database
Write-Host "🗄️  Setting up database..." -ForegroundColor Cyan
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to setup database" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Database setup complete" -ForegroundColor Green
Write-Host ""

# Create first user
Write-Host "👤 Create your first user account" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "You'll need to enter:" -ForegroundColor Yellow
Write-Host "  • Your full name (shown in dashboard)" -ForegroundColor Yellow
Write-Host "  • Username (for login)" -ForegroundColor Yellow
Write-Host "  • Password (minimum 8 characters)" -ForegroundColor Yellow
Write-Host ""
npm run create-user

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create user" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  Public Gallery: http://localhost:3000" -ForegroundColor Yellow
Write-Host "  Admin Login:    http://localhost:3000/login" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 After first login, you can enable biometric authentication" -ForegroundColor Cyan
Write-Host "   (Face ID / Touch ID) for faster access!" -ForegroundColor Cyan
Write-Host ""
