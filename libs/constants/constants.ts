import {
  BlastIcon,
  EtherIcon,
  MonadIcon,
  ZkSyncIcon,
} from "../../components/Icons";
interface NetworkItem {
  name: string;
  logo: any;
  chain: string;
  disable?: boolean;
}
const version = "Version 0.1.8";
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
const activeNFTPercent = [
  { text: "25%", percent: 0.25 },
  { text: "50%", percent: 0.5 },
  { text: "75%", percent: 0.75 },
  { text: "MAX", percent: 1 },
];
const BLAST_DEMASK = {
  RPC: process.env.NEXT_PUBLIC_RPC_BLAST,
  REFERRAL: process.env.NEXT_PUBLIC_REFERRAL_BLAST,
  FACTORY: process.env.NEXT_PUBLIC_FACTORY_BLAST,
  FACTORY_721: process.env.NEXT_PUBLIC_FACTORY_721_BLAST,
  ROUTER: process.env.NEXT_PUBLIC_ROUTER_BLAST,
  ROUTER_721: process.env.NEXT_PUBLIC_ROUTER_721_BLAST,
  CREATOR: process.env.NEXT_PUBLIC_CREATOR_BLAST,
  WETH: process.env.NEXT_PUBLIC_WETH_BLAST,
  NATIVE_ADDRESS: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_BLAST,
  IDNFT: process.env.NEXT_PUBLIC_IDNFT_BLAST,
  CREATE_COLLECTION: process.env.NEXT_PUBLIC_CREATE_COLLECTION_BLAST,
  urltxHash: "https://testnet.blastscan.io/",
  chainName: "Blast Testnet",
  NAME: "Blast Testnet",
  CURRENCY: "ETH",
};
const Goerli_DEMASK = {
  RPC: process.env.NEXT_PUBLIC_RPC_Goerli,
  REFERRAL: process.env.NEXT_PUBLIC_REFERRAL_Goerli,
  FACTORY: process.env.NEXT_PUBLIC_FACTORY_Goerli,
  FACTORY_721: process.env.NEXT_PUBLIC_FACTORY_721_Goerli,
  ROUTER: process.env.NEXT_PUBLIC_ROUTER_Goerli,
  ROUTER_721: process.env.NEXT_PUBLIC_ROUTER_721_Goerli,
  CREATOR: process.env.NEXT_PUBLIC_CREATOR_Goerli,
  WETH: process.env.NEXT_PUBLIC_WETH_Goerli,
  NATIVE_ADDRESS: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_Goerli,
  IDNFT: process.env.NEXT_PUBLIC_IDNFT_Goerli,
  USDT: process.env.NEXT_PUBLIC_USDT_Goerli,
  USDC: process.env.NEXT_PUBLIC_USDC_Goerli,
  ROYALTY: process.env.NEXT_PUBLIC_ROYALTY_ENGINE_Goerli,
  urltxHash: "https://goerli.etherscan.io/",
  chainName: "Goerli Testnet",
  NAME: "Goerli Testnet",
  CURRENCY: "ETH",
};
const PORT = process.env.NEXT_PUBLIC_APP_PORT;

let network: NetworkItem[] = [];

if (PORT === "3000") {
  network = [
    {
      name: "Blast Testnet",
      logo: BlastIcon,
      chain: "168587773",
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
export {
  activeNFTPercent,
  amountNFT,
  BLAST_DEMASK,
  Category,
  Goerli_DEMASK,
  mediaType,
  network,
  tokenBlast,
  tokenGoerli,
  version,
};
