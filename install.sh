#!/bin/bash

echo "🎨 MyPhoto - Photographer Portfolio Installer"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate random session secret
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/change-this-to-a-random-secret-minimum-32-characters/$SESSION_SECRET/" .env
    else
        # Linux
        sed -i "s/change-this-to-a-random-secret-minimum-32-characters/$SESSION_SECRET/" .env
    fi
    
    echo "✅ .env file created with secure session secret"
else
    echo "ℹ️  .env file already exists, skipping..."
fi
echo ""

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p public/uploads
touch public/uploads/.gitkeep
echo "✅ Uploads directory created"
echo ""

# Setup database
echo "🗄️  Setting up database..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Failed to setup database"
    exit 1
fi

echo "✅ Database setup complete"
echo ""

# Create first user
echo "👤 Create your first user account"
echo "=================================="
echo "You'll need to enter:"
echo "  • Your full name (shown in dashboard)"
echo "  • Username (for login)"
echo "  • Password (minimum 8 characters)"
echo ""
npm run create-user

if [ $? -ne 0 ]; then
    echo "❌ Failed to create user"
    exit 1
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "URLs:"
echo "  Public Gallery: http://localhost:3000"
echo "  Admin Login:    http://localhost:3000/login"
echo ""
echo "📱 After first login, you can enable biometric authentication"
echo "   (Face ID / Touch ID) for faster access!"
echo ""
