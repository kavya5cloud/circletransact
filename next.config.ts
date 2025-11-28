import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: false,

  allowedDevOrigins: [
    "preview-chat-99cf719c-4389-40a8-afdf-058f0eca66eb.space.z.ai"
  ],

  // 👇 Add this to silence Turbopack/Webpack conflict
  turbopack: {},
};

export default nextConfig;
