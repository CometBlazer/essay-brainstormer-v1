import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
      {
        hostname: 'res.cloudinary.com',
        // pathname: '/dqdasxxho/image/upload/**',
      },
    ],
  },
};

export default nextConfig;
