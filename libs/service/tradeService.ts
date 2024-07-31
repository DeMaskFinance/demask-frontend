import request from "../utils/httpRequest";

const tradeChartAPI = async (
  dmlAddress: string,
  chainId: string | string[],
  typeERC: string,
  intervalTime: string
) => {
  try {
    const res = await request.get(
      `chart?chainId=${chainId}&dmlAddress=${dmlAddress}&type=${typeERC}&interval=${intervalTime}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
//ERC 1155
const erc1155TradingBuy = async (
  tokenAddress: string,
  chainId: string | string[],
  nftAddress: string,
  idNFT: string,
  amountNFT: string,
  slippage: number,
  version: string
) => {
  try {
    const res = await request.get(
      `erc1155-trading-buy?chainId=${chainId}&amountNFT=${amountNFT}&slippage=${slippage}&nftAddress=${nftAddress}&id=${idNFT}&tokenAddress=${tokenAddress}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const erc1155TradingSell = async (
  tokenAddress: string,
  chainId: string | string[],
  nftAddress: string,
  idNFT: string,
  amountNFT: string,
  slippage: number,
  version: string
) => {
  try {
    const res = await request.get(
      `erc1155-trading-sell?chainId=${chainId}&amountNFT=${amountNFT}&slippage=${slippage}&nftAddress=${nftAddress}&id=${idNFT}&tokenAddress=${tokenAddress}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const erc1155TradingAdd = async (
  tokenAddress: string,
  chainId: string | string[],
  nftAddress: string,
  idNFT: string,
  amountNFT: number,
  slippage: number,
  version: string
) => {
  try {
    const res = await request.get(
      `erc1155-trading-add?chainId=${chainId}&amountNFT=${amountNFT}&slippage=${slippage}&nftAddress=${nftAddress}&id=${idNFT}&tokenAddress=${tokenAddress}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const ercTradingRemove = async (
  dmlAddress: string,
  chainId: string | string[],
  amountLiquidity: number,
  account: string
) => {
  try {
    const res = await request.get(
      `trading-remove?chainId=${chainId}&amountLiquidity=${amountLiquidity}&dmlAddress=${dmlAddress}&userAddress=${account}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
//ERC721
const erc721TradingBuy = async (
  contractAddress: string,
  chainId: string | string[],
  amountNFT: number,
  slippage: number,
  version: string
) => {
  try {
    const res = await request.get(
      `erc721-trading-buy?chainId=${chainId}&amountNFT=${amountNFT}&slippage=${slippage}&contractAddress=${contractAddress}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const erc721TradingSell = async (
  contractAddress: string,
  chainId: string | string[],
  amountNFT: number,
  slippage: number,
  version: string
) => {
  try {
    const res = await request.get(
      `erc721-trading-sell?chainId=${chainId}&amountNFT=${amountNFT}&slippage=${slippage}&contractAddress=${contractAddress}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const erc721TradingAdd = async (
  contractAddress: string,
  chainId: string | string[],
  amountNFT: number,
  slippage: number,
  version: string
) => {
  try {
    const res = await request.get(
      `erc721-trading-add?chainId=${chainId}&amountNFT=${amountNFT}&slippage=${slippage}&contractAddress=${contractAddress}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export {
  tradeChartAPI,
  erc1155TradingBuy,
  erc1155TradingAdd,
  ercTradingRemove,
  erc1155TradingSell,
  erc721TradingBuy,
  erc721TradingSell,
  erc721TradingAdd,
};
