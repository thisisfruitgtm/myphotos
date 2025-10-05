# 🚀 Deployment Guide

Comprehensive guide for deploying MyPhoto to production.

## Table of Contents
- [Coolify (Self-Hosted)](#coolify-self-hosted)
- [Vercel](#vercel)
- [Docker](#docker)
- [VPS (Manual)](#vps-manual)

---

## Coolify (Self-Hosted)

Coolify is perfect for photographers who want full control of their data.

### Prerequisites
- Coolify instance running ([coolify.io](https://coolify.io))
- Domain name (optional)
- Git repository

### Quick Setup

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/yourusername/myphoto.git
   cd myphoto
   ```

2. **Push to Your Git**
   ```bash
   git remote add origin your-git-url
   git push -u origin main
   ```

3. **Create App in Coolify**
   - Dashboard → New Resource → Application
   - Connect your Git repository
   - Branch: `main`

4. **Environment Variables**
   ```bash
   DATABASE_URL=postgresql://user:pass@postgres:5432/myphoto
   SESSION_SECRET=$(openssl rand -hex 32)
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXT_PUBLIC_RP_ID=yourdomain.com
   NODE_ENV=production
   ```

5. **Add PostgreSQL Database**
   - New Resource → Database → PostgreSQL
   - Name: `myphoto-db`
   - Copy connection URL to `DATABASE_URL`

6. **Update for PostgreSQL**
   
   In `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

7. **Deploy**
   - Click Deploy button
   - Wait for build
   - Visit your domain!

### Coolify Configuration

**Build Settings:**
- Build Pack: Nixpacks (auto)
- Port: 3000
- Start Command: (auto-detected)

**Persistent Storage:**
Coolify auto-handles volumes for `/app/public/uploads`

**Custom Domain:**
- Settings → Domains → Add Domain
- SSL auto-configured with Let's Encrypt

**Auto-Deploy:**
- Settings → Git → Enable Webhook
- Pushes to `main` auto-deploy

### Backup Strategy

**Database:**
```bash
# In Coolify server
coolify backup database myphoto-db
```

**Uploads:**
```bash
# Backup uploads directory
tar -czf uploads-backup.tar.gz /var/lib/coolify/volumes/myphoto/uploads
```

---

## Vercel

### Setup

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add SESSION_SECRET
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add NEXT_PUBLIC_RP_ID
   ```

5. **Add Database**
   - Use Vercel Postgres or
   - External PostgreSQL (recommended)

### Limitations

⚠️ Vercel has file size limits. For many photos, use Coolify or VPS.

---

## Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN mkdir -p public/uploads
RUN chown -R nextjs:nodejs public/uploads

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/myphoto
      SESSION_SECRET: ${SESSION_SECRET}
      NEXT_PUBLIC_APP_URL: ${APP_URL}
      NEXT_PUBLIC_RP_ID: ${RP_ID}
    volumes:
      - uploads:/app/public/uploads
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myphoto
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  uploads:
```

### Deploy

```bash
# Build and start
docker-compose up -d

# Check logs
docker-compose logs -f

# Run migrations
docker-compose exec app npx prisma db push

# Create user (if not using web signup)
docker-compose exec app npm run create-user
```

---

## VPS (Manual)

Deploy on any VPS (DigitalOcean, Linode, Hetzner, etc.)

### Prerequisites
- Ubuntu 22.04+ server
- Domain pointed to server
- Root/sudo access

### Installation

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

2. **Install PostgreSQL**
   ```bash
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Setup Database**
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE DATABASE myphoto;
   CREATE USER myphotouser WITH PASSWORD 'securepassword';
   GRANT ALL PRIVILEGES ON DATABASE myphoto TO myphotouser;
   \q
   ```

4. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/myphoto.git
   cd myphoto
   ```

5. **Setup Environment**
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Update:
   ```
   DATABASE_URL="postgresql://myphotouser:securepassword@localhost:5432/myphoto"
   SESSION_SECRET="$(openssl rand -hex 32)"
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   NEXT_PUBLIC_RP_ID="yourdomain.com"
   ```

6. **Install & Build**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run build
   ```

7. **Setup PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "myphoto" -- start
   pm2 save
   pm2 startup
   ```

8. **Setup Nginx**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/myphoto
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/myphoto /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Setup SSL with Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

10. **Create First User**
    ```bash
    npm run create-user
    ```

### Updates

```bash
cd /var/www/myphoto
git pull
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart myphoto
```

---

## Production Checklist

- [ ] Use PostgreSQL (not SQLite)
- [ ] Set strong `SESSION_SECRET`
- [ ] Configure HTTPS/SSL
- [ ] Setup backups
- [ ] Configure firewall
- [ ] Setup monitoring
- [ ] Test password reset
- [ ] Test photo uploads
- [ ] Test biometric login
- [ ] Configure domain
- [ ] Setup email (optional)

---

## Support

- [GitHub Issues](https://github.com/yourusername/myphoto/issues)
- [Documentation](./README.md)
- [Security](./SECURITY.md)
