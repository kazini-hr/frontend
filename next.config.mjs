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
};

export default nextConfig;
