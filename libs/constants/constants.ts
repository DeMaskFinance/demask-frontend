import { EtherIcon, MonadIcon } from "../../components/Icons";
interface NetworkItem {
  name: string;
  logo: any;
  chain: string;
  type: string;
  disable?: boolean;
}
const version = "Version 0.2.0";

const tokenSepolia = [
  {
    name: "Sepolia Testnet",
    symbol: "MON",
    address: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_SEPOLIA,
    logo: EtherIcon,
    symbolNative: "MON",
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
  CURRENCY: "MON",
};

const MONAD_DEMASK = {
  urltxHash: "https://testnet.monadexplorer.com/",
  chainName: "Monad Testnet",
  NAME: "Monad Testnet",
  CURRENCY: "MON",
  CHAIN_ID: 10143,
  RPC: "https://testnet-rpc.monad.xyz",
};

let network: NetworkItem[] = [
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
  MONAD_DEMASK,
  network,
  SEPOLIA_DEMASK,
  tokenSepolia,
  validCollectionInput,
  validNFTsInput,
  version,
};
