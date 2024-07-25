const { Domain } = require("domain");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // webpack: (config, { isServer }) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback, // The rest of your fallbacks if necessary
  //     fs: false,
  //     crypto: "crypto-browserify",
  //   };

  //   // Push new rules to the module in the webpack config
  //   // if (!isServer) {
  //   //   config.module.rules.push({
  //   //     test: /\.css$/,
  //   //     include: /node_modules/,
  //   //     use: ["style-loader", "css-loader"],
  //   //   });
  //   //   config.module.rules.push({
  //   //     test: /\.css$/,
  //   //     exclude: /node_modules/,
  //   //     use: ["style-loader", "css-loader"],
  //   //   });
  //   // }

  //   return config;
  // },
  images: {
    domains: [
      "demask.infura-ipfs.io",
      "api.demask.finance",
      "file.demask.finance",
      "metadata.degods.com",
      "cf-ipfs.com",
      "1b21fea1b71e52bc8b81e22b5a53a188.ipfscdn.io",
      "",
      "ipfs",
      "ipfs.io"
    ],
    unoptimized: true,
  }, 
  env: {
    NEXT_PUBLIC_APP_PORT: process.env.NEXT_PUBLIC_APP_PORT,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: `/explorer`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
