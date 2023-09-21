import {
  MaticIcon,
  USDCIcon,
  USDTIcon,
  PolygonIcon,
  BscIcon,
  EtherIcon,
} from "../../components/Icons";
const tokenMatic = [
  {
    name: "Polygon",
    symbol: "MATIC",
    address: process.env.NEXT_PUBLIC_NATIVE_ADDRESS,
    logo: MaticIcon,
    symbolNative: "WETH",
  },
  {
    name: "Tether",
    symbol: "USDT",
    address: process.env.NEXT_PUBLIC_USDT,
    logo: USDTIcon,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: process.env.NEXT_PUBLIC_USDC,
    logo: USDCIcon,
  },
];
const tokenBsc = [
  {
    name: "Smart Chain",
    symbol: "BNB",
    address: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_BSC,
    logo: BscIcon,
    symbolNative: "WBNB"
  },
  {
    name: "Tether",
    symbol: "USDT",
    address: process.env.NEXT_PUBLIC_USDT_BSC,
    logo: USDTIcon,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: process.env.NEXT_PUBLIC_USDC_BSC,
    logo: USDCIcon,
  },
];
const BSC_DEMASK = {
  RPC: process.env.NEXT_PUBLIC_RPC_BSC,
  REFERRAL: process.env.NEXT_PUBLIC_REFERRAL_BSC,
  FACTORY: process.env.NEXT_PUBLIC_FACTORY_BSC,
  ROUTER: process.env.NEXT_PUBLIC_ROUTER_BSC,
  CREATOR: process.env.NEXT_PUBLIC_CREATOR_BSC,
  DEMASKTOKEN: process.env.NEXT_PUBLIC_DEMASKTOKEN_BSC,
  WETH: process.env.NEXT_PUBLIC_WETH_BSC,
  NATIVE_ADDRESS: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_BSC,
  IDNFT: process.env.NEXT_PUBLIC_IDNFT_BSC,
  USDT: process.env.NEXT_PUBLIC_USDT_BSC,
  USDC: process.env.NEXT_PUBLIC_USDC_BSC,
};
const MUMBAI_DEMASK = {
  RPC: process.env.NEXT_PUBLIC_RPC,
  REFERRAL: process.env.NEXT_PUBLIC_REFERRAL,
  FACTORY: process.env.NEXT_PUBLIC_FACTORY,
  ROUTER: process.env.NEXT_PUBLIC_ROUTER,
  CREATOR: process.env.NEXT_PUBLIC_CREATOR,
  DEMASKTOKEN: process.env.NEXT_PUBLIC_DEMASKTOKEN,
  WETH: process.env.NEXT_PUBLIC_WETH,
  NATIVE_ADDRESS: process.env.NEXT_PUBLIC_NATIVE_ADDRESS,
  IDNFT: process.env.NEXT_PUBLIC_IDNFT,
  USDT: process.env.NEXT_PUBLIC_USDT,
  USDC: process.env.NEXT_PUBLIC_USDC,
};
const network = [
  {
    name: "Ethereum",
    logo: EtherIcon,
    chain: "1",
  },
  {
    name: "Polygon",
    logo: PolygonIcon,
    chain: "80001",
  },
  {
    name: "BNB Smart Chain",
    logo: BscIcon,
    chain: "97",
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
const rpcMumbai = [
  {
    id: 1,
    url: "https://polygon-mumbai-bor.publicnode.com",
  },
];
const mediaType = {
  image: [".png", ".jpg", ".jpeg", ".svg", ".gif", ".tiff", ".xml", ".webp"],
  video: [".mp4", ".quicktime"],
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
  tokenMatic,
  amountNFT,
  rpcMumbai,
  mediaType,
  network,
  BSC_DEMASK,
  MUMBAI_DEMASK,
  tokenBsc,
  Category
};
