const { Domain } = require("domain");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "demask.infura-ipfs.io",
      "api.demask.finance",
      "file.demask.finance",
      "metadata.degods.com",
      "cf-ipfs.com",
      "1b21fea1b71e52bc8b81e22b5a53a188.ipfscdn.io",
      "",
      "ipfs"
    ],
  },
  env: {
    NEXT_PUBLIC_APP_PORT: process.env.NEXT_PUBLIC_APP_PORT,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: `/swap`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
