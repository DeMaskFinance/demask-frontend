import {
  MaticIcon,
  USDCIcon,
  USDTIcon,
  PolygonIcon,
  BscIcon,
  EtherIcon,
  ZkSyncIcon
} from "../../components/Icons";
interface NetworkItem {
  name: string;
  logo: any;
  chain: string;
  disable?: boolean;
}
const version ="Version 0.1";
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
const tokenzkSync = [
  {
    name: "zkSync Era Testnet",
    symbol: "ETH",
    address: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_Zksync,
    logo: ZkSyncIcon,
    symbolNative: "WETH"
  },
  // {
  //   name: "Tether",
  //   symbol: "USDT",
  //   address: process.env.NEXT_PUBLIC_USDT_Zksync,
  //   logo: USDTIcon,
  // },
  // {
  //   name: "USD Coin",
  //   symbol: "USDC",
  //   address: process.env.NEXT_PUBLIC_USDC_Zksync,
  //   logo: USDCIcon,
  // },
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
  urltxHash:"https://testnet.bscscan.com/tx/",
  chainName:"BNB Smart Chain Testnet",
  NAME:"BNB Smart Chain Testnet",
  CURRENCY:"tBNB"
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
  urltxHash:"https://mumbai.polygonscan.com/tx/",
  chainName: "Mumbai",
  NAME:"MUMBAI",
  CURRENCY:"MATIC",
};
const Zksync_DEMASK = {
  RPC: process.env.NEXT_PUBLIC_RPC_Zksync,
  REFERRAL: process.env.NEXT_PUBLIC_REFERRAL_Zksync,
  FACTORY: process.env.NEXT_PUBLIC_FACTORY_Zksync,
  ROUTER: process.env.NEXT_PUBLIC_ROUTER_Zksync,
  CREATOR: process.env.NEXT_PUBLIC_CREATOR_Zksync,
  DEMASKTOKEN: process.env.NEXT_PUBLIC_DEMASKTOKEN_Zksync,
  WETH: process.env.NEXT_PUBLIC_WETH_Zksync,
  NATIVE_ADDRESS: process.env.NEXT_PUBLIC_NATIVE_ADDRESS_Zksync,
  IDNFT: process.env.NEXT_PUBLIC_IDNFT_Zksync,
  USDT: process.env.NEXT_PUBLIC_USDT_Zksync,
  USDC: process.env.NEXT_PUBLIC_USDC_Zksync,
  urltxHash:"https://goerli.explorer.zksync.io/tx/",
  chainName:"zkSync Era Testnet",
  NAME:"zkSync Era Testnet",
  CURRENCY:"ETH"
};
const PORT = process.env.NEXT_PUBLIC_APP_PORT;

let network: NetworkItem[] = [];

if (PORT === '3000') {
  network = [
    {
      name: "zkSync Era Testnet",
      logo: ZkSyncIcon,
      chain: "280",
    },
    {
      name: "Ethereum",
      logo: EtherIcon,
      chain: "1",
      disable: true,
    },
  ];
} else if (PORT === '1307') {
  network = [
    {
      name: "Polygon",
      logo: PolygonIcon,
      chain: "80001",
    },
    {
      name: "BNB Smart Chain",
      logo: BscIcon,
      chain: "97",
    }
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
  video: [".mp4", ".quicktime",".m4v"],
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
  mediaType,
  network,
  BSC_DEMASK,
  MUMBAI_DEMASK,
  Zksync_DEMASK,
  tokenBsc,
  tokenzkSync,
  Category,
  version
};
