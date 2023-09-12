const { Domain } = require("domain");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["demask.infura-ipfs.io", "api.demask.finance"],
  },
};

module.exports = nextConfig;
