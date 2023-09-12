import {
  MaticIcon,
  USDCIcon,
  USDTIcon,
  PolygonIcon,
  BscIcon,
  EtherIcon,
} from "../../components/Icons";
const tokenDefault = [
  {
    name: "Polygon",
    symbol: "MATIC",
    address: "MATIC",
    logo: MaticIcon,
  },
  {
    name: "Tether",
    symbol: "USDT",
    address: "0x4A90D5aE01F03B650cdc8D3A94358F364D98d096",
    logo: USDTIcon,
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x8d03ae448B76C089EAEDa30aAABC9D2A9C55d2A1",
    logo: USDCIcon,
  },
];
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
  image: [".png", ".jpg", ".jpeg", ".svg", ".gif", ".tiff", ".xml",".webp"],
  video: [".mp4", ".quicktime"],
  audio: [".mp3", ".mpeg", ".aiff", ".x-m4a", ".vnd.wav", ".vnd.wave", "mpga"],
  pdf: [".application/pdf"],
};
export { tokenDefault, amountNFT, rpcMumbai, mediaType, network };
