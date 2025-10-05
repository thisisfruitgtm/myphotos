# 🚀 Quick Start Guide

Get MyPhoto running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- Terminal/Command Prompt access

## Installation

### macOS/Linux

```bash
# Make installer executable
chmod +x install.sh

# Run installer
./install.sh
```

### Windows

```powershell
# Run installer
.\install.ps1
```

The installer will:
1. ✅ Check Node.js installation
2. 📦 Install dependencies
3. 📝 Create `.env` file with secure secrets
4. 📁 Setup upload directories
5. 🗄️ Initialize database
6. 👤 Create your first user account (full name, username, password)

## First Login

1. Start the development server:
```bash
npm run dev
```

2. Open your browser:
   - **Public Gallery:** [http://localhost:3000](http://localhost:3000)
   - **Admin Login:** [http://localhost:3000/login](http://localhost:3000/login)

3. Login with the credentials you created during installation

4. **Enable Biometric Login (Optional)**
   - After first login, you'll see a prompt
   - Click "Enable Now" 
   - Follow Face ID/Touch ID prompt
   - Next time, just click the biometric button to login!

## First Steps

1. **Create a Category**
   - Click "New Category"
   - Enter name (e.g., "Portraits", "Landscapes")
   - Optionally add password protection

2. **Upload Photos**
   - Click "Upload Photo"
   - Select image file
   - Add title and description
   - Choose category
   - Optionally add password protection

3. **View Gallery**
   - Photos appear in Instagram-style grid
   - Click any photo to see details, EXIF data, and location
   - Filter by category using the category buttons

## Tips

- **Biometric Login**: Works on devices with Face ID, Touch ID, or Windows Hello
- **EXIF Data**: Photos with GPS coordinates show a map pin icon
- **Password Protection**: Add passwords to categories or individual photos for privacy
- **Image Quality**: Images are automatically compressed while maintaining sharpness
- **Supported Formats**: JPEG, PNG, WebP, GIF
- **Multiple Devices**: Can register biometric login on multiple devices (Mac, phone, etc.)

## Forgot Your Password?

No problem! Run this command:

```bash
npm run reset-password
```

You'll be asked to:
1. Enter your username
2. Enter new password
3. Confirm new password

All your existing sessions will be logged out for security.

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Review the [Security Features](README.md#-security-features) section

---

Happy photographing! 📸
