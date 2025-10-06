FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat su-exec
WORKDIR /app

# Copy only dependency files first for better caching
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Use cache mount for npm to speed up installs
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source files
COPY . .

# Generate Prisma Client (uses cached if schema unchanged)
RUN npx prisma generate

# Build Next.js with cache mount for faster rebuilds
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# Production image, copy all the files and run next
FROM base AS runner
RUN apk add --no-cache su-exec
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output (includes server.js, node_modules, etc)
COPY --from=builder /app/.next/standalone ./

# Copy static assets for Next.js
COPY --from=builder /app/.next/static ./.next/static

# Copy public directory for static files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma files for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create uploads directory with correct ownership BEFORE switching user
RUN mkdir -p public/uploads && \
    chown -R nextjs:nodejs public && \
    chmod -R 755 public/uploads

# Declare uploads as a volume for persistence
VOLUME ["/app/public/uploads"]

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use entrypoint to fix volume permissions at runtime, then switch to nextjs user
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["su-exec", "nextjs", "node", "server.js"]
