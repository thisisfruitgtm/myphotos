# 📸 MyPhoto - Photographer Portfolio Web App

A modern, open-source photographer portfolio web application built with Next.js, featuring Instagram-style photo galleries, category management, and secure photo uploads with EXIF data extraction.

## ✨ Features

- 🔐 **Secure Authentication** - Login with username/password OR biometric (Face ID/Touch ID)
- 👤 **User Profiles** - Set your full name during setup
- 📱 **WebAuthn/Passkeys** - Modern biometric authentication support
- 📁 **Category Management** - Organize photos into categories with optional password protection
- 🖼️ **Instagram-style Gallery** - Beautiful, responsive photo grid layout
- 📤 **Smart Upload** - Automatic image compression with sharp quality preservation
- 📍 **Location Display** - Extracts and displays GPS data from EXIF
- 📷 **Camera Info** - Shows camera, lens, aperture, shutter speed, ISO, and more
- 🔒 **Password Protection** - Protect individual photos or entire categories
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🚀 **Fast & Lightweight** - Built on Next.js 14 with App Router
- 💾 **SQLite Database** - Easy setup with Prisma ORM (PostgreSQL ready)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Database:** Prisma + SQLite (PostgreSQL compatible)
- **Authentication:** Custom session-based auth with bcryptjs
- **Image Processing:** Sharp (compression + EXIF extraction)
- **Icons:** Lucide React

## 📋 Requirements

- Node.js 18 or higher
- npm or yarn

## 🚀 Quick Start

### Option 1: Automated Installation (Recommended)

#### Linux/macOS:
```bash
chmod +x install.sh
./install.sh
```

#### Windows:
```powershell
.\install.ps1
```

### Option 2: Manual Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/myphoto.git
cd myphoto
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and set a secure `SESSION_SECRET`:
```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="your-secure-random-secret-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Setup database**
```bash
npx prisma db push
```

5. **Create your first user**
```bash
npm run create-user
```

Enter your:
- Full name (displayed in dashboard)
- Username (for login)
- Password (minimum 8 characters)

6. **Start the development server**
```bash
npm run dev
```

Visit:
- **Public Gallery:** [http://localhost:3000](http://localhost:3000) 
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

### 📱 Enable Biometric Login (Optional)

After your first login, you'll see a prompt to enable Face ID/Touch ID:
1. Click "Enable Now"
2. Follow your device's biometric prompt
3. Next time, just click "Use Face ID / Touch ID" on login page!

### 🔑 Forgot Your Password?

If you forget your password, simply run:

```bash
npm run reset-password
```

This will guide you through resetting your password securely. All existing sessions will be invalidated for security.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run create-user` - Create a new user account
- `npm run reset-password` - Reset your password if forgotten

## 🗄️ Database

By default, MyPhoto uses SQLite for easy setup. To use PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update your `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/myphoto"
```

3. Run migrations:
```bash
npx prisma db push
```

## 🔒 Security Features

- **Password Hashing:** Bcrypt with salt rounds
- **Session-based Auth:** Secure HTTP-only cookies
- **Password Protection:** Protect categories and individual photos
- **Input Validation:** Server-side validation on all endpoints
- **CSRF Protection:** Built-in Next.js protection
- **SQL Injection Protection:** Prisma ORM parameterized queries

## 📸 Image Upload

Images are automatically:
- Compressed with Sharp (85% quality, mozjpeg)
- Rotated based on EXIF orientation
- EXIF data extracted (GPS, camera info, etc.)
- Stored with unique filenames
- Metadata saved to database

Supported formats: JPEG, PNG, WebP, GIF

## 🌍 EXIF Location Data

Photos with GPS coordinates will:
- Show a map pin indicator
- Display coordinates in photo details
- Link to Google Maps for location viewing

## 📁 Project Structure

```
myphoto/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Prisma client
│   ├── image.ts          # Image processing
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── public/               # Static files
│   └── uploads/          # Uploaded images
└── scripts/              # Utility scripts
    └── create-user.ts    # User creation script
```

## 🎨 Customization

### Styling
All styles use Tailwind CSS. Customize colors in `tailwind.config.ts` and `app/globals.css`.

### Image Quality
Adjust compression in `lib/image.ts`:
```typescript
.jpeg({ quality: 85, mozjpeg: true })
```

### Session Duration
Change session expiry in `lib/auth.ts`:
```typescript
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
```

## 🚀 Deployment

### Coolify (Recommended for Self-Hosting)

Coolify is a self-hosted platform that makes deployment easy. Perfect for photographers who want full control!

#### Prerequisites
- A Coolify instance running (visit [coolify.io](https://coolify.io) for setup)
- A domain name (optional but recommended)

#### Step-by-Step Deployment

1. **Create New Application in Coolify**
   - Go to your Coolify dashboard
   - Click "New Resource" → "Application"
   - Choose "Public Repository" or connect your Git repo

2. **Configure Build Settings**
   - **Build Pack:** Nixpacks (auto-detected)
   - **Build Command:** Leave empty (auto-detected)
   - **Start Command:** Leave empty (auto-detected)
   - **Port:** `3000`

3. **Set Environment Variables**
   
   Go to "Environment Variables" and add:

   ```bash
   # Database (use PostgreSQL in production)
   DATABASE_URL=postgresql://user:password@postgres:5432/myphoto
   
   # Generate a secure random secret (32+ characters)
   SESSION_SECRET=your-super-secret-random-string-here-min-32-chars
   
   # Your domain
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXT_PUBLIC_RP_ID=yourdomain.com
   
   # Node environment
   NODE_ENV=production
   ```

   **To generate secure SESSION_SECRET:**
   ```bash
   openssl rand -hex 32
   ```

4. **Add PostgreSQL Database**
   - In Coolify, create a new PostgreSQL database
   - Name it `myphoto-db`
   - Copy the connection URL
   - Update `DATABASE_URL` in environment variables

5. **Update Database Schema**
   
   Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from sqlite
     url      = env("DATABASE_URL")
   }
   ```

6. **Deploy**
   - Click "Deploy" in Coolify
   - Wait for build to complete
   - Visit your domain!

7. **First-Time Setup**
   - Visit `https://yourdomain.com`
   - Click "Get Started"
   - Create your account
   - Start uploading photos!

#### Coolify Tips

- **Automatic Deploys:** Enable webhook for auto-deploy on Git push
- **SSL Certificate:** Coolify handles Let's Encrypt automatically
- **Persistent Storage:** Coolify automatically handles volumes for uploads
- **Backups:** Use Coolify's backup feature for database snapshots
- **Custom Domain:** Add your domain in Coolify's domain settings

#### Troubleshooting Coolify

**Build fails:**
```bash
# Check if prisma generate runs in build
# Add to package.json scripts:
"build": "prisma generate && next build"
```

**Database connection fails:**
- Check `DATABASE_URL` format
- Ensure PostgreSQL service is running
- Verify network connectivity between services

**Uploads not persisting:**
- Check Coolify volume settings
- Ensure `/app/public/uploads` is mounted

### Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variables (same as Coolify)
4. Add Vercel Postgres or external PostgreSQL
5. Deploy!

**Note:** Vercel has file upload limitations. Coolify recommended for photo uploads.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose with PostgreSQL:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myphoto
      - SESSION_SECRET=${SESSION_SECRET}
      - NEXT_PUBLIC_APP_URL=${APP_URL}
      - NEXT_PUBLIC_RP_ID=${RP_ID}
    volumes:
      - ./public/uploads:/app/public/uploads
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myphoto
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Additional Documentation

- **[Deployment Guide](DEPLOYMENT.md)** - Detailed deployment instructions for Coolify, Vercel, Docker, and VPS
- **[Security Guide](SECURITY.md)** - Security best practices and features
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues

Found a bug? Have a feature request? Please open an issue on GitHub.

## 💖 Support

If you find this project helpful, please give it a ⭐️ on GitHub!

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ by photographers, for photographers.
