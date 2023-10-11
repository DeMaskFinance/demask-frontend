const { Domain } = require("domain");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["demask.infura-ipfs.io", "api.demask.finance"],
  },
  env: {
    NEXT_PUBLIC_APP_PORT: process.env.NEXT_PUBLIC_APP_PORT
  },
};

module.exports = nextConfig;
