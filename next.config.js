/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Bind to all interfaces for mobile hotspot access
  serverRuntimeConfig: {
    hostname: '0.0.0.0'
  }
};

module.exports = nextConfig;
