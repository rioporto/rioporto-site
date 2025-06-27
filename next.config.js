/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Force clean build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig