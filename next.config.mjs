/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: 'api.dicebear.com' }],
  },
  // Ensure source maps are enabled
  productionBrowserSourceMaps: true,
};

export default nextConfig;
