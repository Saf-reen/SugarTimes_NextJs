/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ VERY IMPORTANT

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
    unoptimized: true, // ✅ REQUIRED for static export
  },
};

module.exports = nextConfig;