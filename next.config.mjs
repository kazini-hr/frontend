/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'api.dicebear.com' },
      { hostname: 'images.pexels.com' },
    ],
  },
  // Ensure source maps are enabled
  productionBrowserSourceMaps: true,

  // Add rewrites for API proxy
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `${process.env.BACKEND_API_URL}/:path*`, // Proxy to Backend
      }
    ]
  }
};

export default nextConfig;
