/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@buildora/tokens",
    "@buildora/utils",
    "@buildora/hooks",
    "@buildora/animations",
    "@buildora/components"
  ],
  experimental: {
    optimizePackageImports: ["framer-motion"]
  }
};

module.exports = nextConfig;
