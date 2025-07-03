/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "wallpapers.com",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Add this configuration to fix Prisma in Vercel deployment
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "prisma", "@prisma/client"];
    }
    return config;
  },
};

export default nextConfig;
