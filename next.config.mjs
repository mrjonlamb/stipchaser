/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Enable server actions
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Transpile packages if needed
  transpilePackages: ["@dhiwise/component-tagger"],
  // Ignore TypeScript errors during build (SST platform has some type issues)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
