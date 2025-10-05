/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production', // Disable optimization in production for uploaded images
  },
  poweredByHeader: false,
  output: 'standalone',
};

export default nextConfig;
