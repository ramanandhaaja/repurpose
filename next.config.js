/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Increase the body size limit to 5MB
      bodySizeLimit: '50mb',
    },
  },
}

module.exports = nextConfig
