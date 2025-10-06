#!/bin/sh
set -e

# Fix ownership of uploads directory if it's mounted as volume
if [ -d "/app/public/uploads" ]; then
  echo "Setting permissions for uploads directory..."
  chown -R nextjs:nodejs /app/public/uploads || true
  chmod -R 755 /app/public/uploads || true
fi

# Start the application
exec "$@"
