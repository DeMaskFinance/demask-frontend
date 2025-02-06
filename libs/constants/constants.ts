import {
  EtherIcon,
  MonadIcon,
  SepoliaIcon,
  StarknetIcon,
} from "../../components/Icons";
interface NetworkItem {
  name: string;
  logo: any;
  chain: string;
  type: string;
  disable?: boolean;
}
const version = "Version 0.2.0";
const tokenStarknet = [
  {
    name: "Starknet",
    symbol: "STRK",
    address: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_Goerli,
    logo: StarknetIcon,
    symbolNative: "ETH",
  },
];

const tokenSepolia = [
  {
    name: "Sepolia Testnet",
    symbol: "ETH",
    address: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_SEPOLIA,
    logo: EtherIcon,
    symbolNative: "ETH",
  },
];
const activeNFTPercent = [
  { text: "25%", percent: 0.25 },
  { text: "50%", percent: 0.5 },
  { text: "75%", percent: 0.75 },
  { text: "MAX", percent: 1 },
];
const SEPOLIA_DEMASK = {
  IDNFT: process.env.NEXT_PUBLIC_IDNFT_SEPOLIA,
  urltxHash: "https://sepolia.etherscan.io/",
  chainName: "Sepolia Testnet",
  NAME: "Sepolia Testnet",
  CURRENCY: "ETH",
};

const MONAD_DEMASK = {
  urltxHash: "https://explorer.monad-testnet.category.xyz/",
  chainName: "Monad Testnet",
  NAME: "Monad Testnet",
  CURRENCY: "MON",
};

const STARKNET_DEMASK = {
  IDNFT: process.env.NEXT_PUBLIC_IDNFT_SEPOLIA,
  urltxHash: "https://sepolia.voyager.online/",
  chainName: "Starknet Devnet",
  NAME: "Starknet Devnet",
  CURRENCY: "ETH",
};
export const starknet = {
  addrETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  addrStarknet:
    "0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D",
  addrxASTR:
    "0x005EF67D8c38B82ba699F206Bf0dB59f1828087A710Bad48Cc4d51A2B0dA4C29", // xAstraly
  addrTESTCONTRACT:
    "0x6a109c64aefc6f0e337f8996baec2db09e209d12fd329843327a0f442e04d84", // sepolia testnet
  StarknetChainId: {
    SN_SEPOLIA: "0x534e5f5345504f4c4941",
    SN_MAIN: "0x534e5f4d41494e",
  },
};

let network: NetworkItem[] = [
  {
    name: "Sepolia Testnet",
    logo: SepoliaIcon,
    chain: "11155111",
    type: "EVM",
  },

  {
    name: "Monad Testnet",
    logo: MonadIcon,
    chain: "10143",
    type: "EVM",
  },
];

const amountNFT = [
  {
    id: 1,
    value: "1",
  },
  {
    id: 2,
    value: "2",
  },
  {
    id: 3,
    value: "5",
  },
  {
    id: 4,
    value: "10",
  },
  {
    id: 5,
    value: "CUSTOM",
  },
];
const mediaType = {
  image: [".png", ".jpg", ".jpeg", ".svg", ".gif", ".tiff", ".xml", ".webp"],
  video: [".mp4", ".quicktime", ".m4v"],
  audio: [".mp3", ".mpeg", ".aiff", ".x-m4a", ".vnd.wav", ".vnd.wave", "mpga"],
  pdf: [".application/pdf"],
};

let validNFTsInput = [
  "video/mp4",
  "video/x-msvideo",
  "video/x-matroska",
  "video/quicktime",
  "video/x-ms-wmv",
  "video/x-flv",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
  "audio/x-ms-wma",
  "application/pdf",
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/tiff",
];

let validCollectionInput = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
];
const Category = [
  {
    id: 1,
    value: "Art",
  },
  {
    id: 2,
    value: "Film",
  },
  {
    id: 3,
    value: "Music",
  },
  {
    id: 4,
    value: "Gaming",
  },
  {
    id: 5,
    value: "Memberships",
  },
];

export enum CommandWallet {
  wallet_watchAsset = "wallet_watchAsset",
  wallet_addStarknetChain = "wallet_addStarknetChain",
  wallet_switchStarknetChain = "wallet_switchStarknetChain",
}
export {
  activeNFTPercent,
  amountNFT,
  Category,
  mediaType,
  network,
  SEPOLIA_DEMASK,
  tokenStarknet,
  tokenSepolia,
  validCollectionInput,
  validNFTsInput,
  version,
  STARKNET_DEMASK,
  MONAD_DEMASK,
};
