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
};

export default nextConfig;
