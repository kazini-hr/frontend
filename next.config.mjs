/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      { hostname: 'api.dicebear.com' },
      { hostname: 'images.pexels.com' },
      {
        protocol: 'https',
        hostname: 'api.kazinihr.co.ke',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure source maps are enabled
  productionBrowserSourceMaps: true,

  // Add rewrites for API proxy
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `https://api.kazinihr.co.ke/:path*`, // Proxy to Backend
      }
    ]
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
};

export default nextConfig;
