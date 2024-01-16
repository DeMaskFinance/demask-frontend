const { Domain } = require("domain");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "demask.infura-ipfs.io",
      "api.demask.finance",
      "file.demask.finance",
    ],
  },
  env: {
    NEXT_PUBLIC_APP_PORT: process.env.NEXT_PUBLIC_APP_PORT,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: `/swap/${process.env.NEXT_PUBLIC_CREATOR_Zksync}/${process.env.NEXT_PUBLIC_NATIVE_ADDRESS_Zksync}/${process.env.NEXT_PUBLIC_IDNFT_Zksync}`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
