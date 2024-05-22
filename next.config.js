/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");
// import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
    ],
  },
};

module.exports = withPWA(withNextIntl(nextConfig));
// module.exports = withNextIntl(withPWA(nextConfig));
