import axios from "axios";
import request from "../utils/httpRequest";

const swapAPI = async (
  tokenAddress: string,
  chainId: string | string[],
  nftAddress: string,
  idNFT: string
) => {
  try {
    const res = await request.get(
      `reserveDML?nftAddress=${nftAddress}&tokenAddress=${tokenAddress}&id=${idNFT}&chainId=${chainId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const swapChartAPI = async (
  tokenAddress: string,
  chainId: string | string[],
  nftAddress: string,
  idNFT: string
) => {
  try {
    const res = await request.get(
      `DML-chart?nftAddress=${nftAddress}&tokenAddress=${tokenAddress}&id=${idNFT}&chainId=${chainId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export {swapAPI,swapChartAPI}
