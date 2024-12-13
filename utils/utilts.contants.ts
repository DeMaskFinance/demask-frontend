const ACCESS_TOKEN = "ACCESS_TOKEN";
const REFRESH_TOKEN = "REFRESH_TOKEN";

const WALLET_CONNECT = "WALLET_CONNECT";
const IPFS_GATEWAY = "https://cf-ipfs.com/ipfs/";

const FILL_BLANK = "Do not leave it blank";
const FORMAT_UPLOAD = `Recommended size: 300px x 300px,\nMax size: 2MB\nFile types: JPG,PNG,SVG or GIF`;

const MY_CART = "MY_CART";
const UNIT_REM = 0.0625;
const CHAIN_ID = "CHAIN_ID";

const ENVINROMENT_STUDIO = "ENVINROMENT_STUDIO";
const ENVINROMENT_API = "ENVINROMENT_API";
const ENVINROMENT_ASSETS = "ENVINROMENT_ASSETS";
const ENVINROMENT_RPC = "ENVINROMENT_RPC";

const HEADER_PLACEHOLDER = "Search Collections,Items and accounts";
const FAILED_PLACEHOLDER = "Transaction Failed !";
const NONE_NAME = "Untitled";

const PREVENT_ANCHOR = "preventAnchor";

const ENVINROMENTS = {
  main_openmark: {
    API: "https://api.openmark.io",
    ASSETS: "https://assets.openmark.io",
    rpcUrls: "https://fraa-flashbox-2787-rpc.a.stagenet.tanssi.network",
    STUDIO: "https://studio.openmark.io",
  },

  dev_openmark: {
    API: "https://test-api.openmark.io",
    ASSETS: "https://test-assets.openmark.io",
    rpcUrls: "https://fraa-flashbox-2787-rpc.a.stagenet.tanssi.network",
    STUDIO: "https://test-api.openmark.io",
  },

  main_starknet: {
    API: "https://starknet-sepolia-api.openmark.io",
    ASSETS: "https://starknet-sepolia-assets.openmark.io",
    rpcUrls: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    STUDIO: "https://test-api.openmark.io",
  },

  testnet_nibiru: {
    API: "https://nibiru-testnet-api.openmark.io",
    ASSETS: "https://nibiru-testnet-assets.openmark.io",
    rpcUrls: "https://evm-rpc.testnet-1.nibiru.fi",
    STUDIO: "https://studio.openmark.io",
  },

  dev_nibiru: {
    API: "https://test-api.openmark.io",
    ASSETS: "https://test-assets.openmark.io",
    rpcUrls: "https://evm-rpc.testnet-1.nibiru.fi",
    STUDIO: "https://test-api.openmark.io",
  },
};

const NFT_NAME = (name?: string, tokenId?: string) => {
  return name || `#${tokenId}`;
};

const RANDOM_CHARACTER = () => {
  return (Math.random() + 1).toString(6).substring(7);
};

const FORMAT_THROW = (url: string, argument: Record<string, any>) => {
  for (const [key, value] of Object.entries(argument)) {
    if (!value) {
      if (process.env.NODE_ENV === "development") {
        return `you need pass conditional ${key} to do this in ${url}`;
      }

      return `you need pass conditional ${key} to do this`;
    }
  }
};

const decodeURIString = (argument: string | string[] | undefined) => {
  return decodeURIComponent(String(argument?.toString()));
};

const GENERATE_PERCENT_MAX = (number: number) => {
  return number >= 99.9 && number <= 100.9;
};

export default {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  WALLET_CONNECT,
  IPFS_GATEWAY,
  FILL_BLANK,
  FORMAT_UPLOAD,
  MY_CART,
  UNIT_REM,
  CHAIN_ID,
  ENVINROMENT_STUDIO,
  ENVINROMENT_API,
  ENVINROMENT_ASSETS,
  ENVINROMENT_RPC,
  HEADER_PLACEHOLDER,
  FAILED_PLACEHOLDER,
  NONE_NAME,
  PREVENT_ANCHOR,
  ENVINROMENTS,

  // callback
  NFT_NAME,
  RANDOM_CHARACTER,
  FORMAT_THROW,
  decodeURIString,
  GENERATE_PERCENT_MAX,
};
