/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: false,
  },
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  // Base path for GitHub Pages (if using custom domain, remove this)
  // basePath: process.env.NODE_ENV === 'production' ? '/wellness-agent-saas' : '',
  // Asset prefix for GitHub Pages
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/wellness-agent-saas/' : '',
  // Disable server-side features for static export
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

module.exports = nextConfig;
