import { constants, TypedData } from "starknet";
import {
  BlastIcon,
  EtherIcon,
  MonadIcon,
  SepoliaIcon,
} from "../../components/Icons";
interface NetworkItem {
  name: string;
  logo: any;
  chain: string;
  disable?: boolean;
}
const version = "Version 0.2.0";
const tokenGoerli = [
  {
    name: "Goerli",
    symbol: "ETH",
    address: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_Goerli,
    logo: EtherIcon,
    symbolNative: "ETH",
  },
];

const tokenBlast = [
  {
    name: "Blast Testnet",
    symbol: "ETH",
    address: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_BLAST,
    logo: BlastIcon,
    symbolNative: "WETH",
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

const PORT = process.env.NEXT_PUBLIC_APP_PORT;

let network: NetworkItem[] = [];

if (PORT === "3000") {
  network = [
    {
      name: "Sepolia Testnet",
      logo: SepoliaIcon,
      chain: "11155111",
    },
    {
      name: "Monad Devnet",
      logo: MonadIcon,
      chain: "1",
      disable: true,
    },
  ];
} else if (PORT === "1307") {
  network = [
    {
      name: "Blast Testnet",
      logo: BlastIcon,
      chain: "168587773",
    },
  ];
}
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
const myTypedData: TypedData = {
  domain: {
    name: "Demask Finance",
    chainId: constants.StarknetChainId.SN_SEPOLIA,
    version: "0.2.0",
  },
  types: {
    StarkNetDomain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "felt" },
      { name: "version", type: "string" },
    ],
    Message: [{ name: "message", type: "felt" }],
  },
  primaryType: "Message",
  message: { message: 1234 },
};
export {
  activeNFTPercent,
  amountNFT,
  Category,
  mediaType,
  network,
  SEPOLIA_DEMASK,
  tokenBlast,
  tokenGoerli,
  tokenSepolia,
  validCollectionInput,
  validNFTsInput,
  version,
  myTypedData,
};
