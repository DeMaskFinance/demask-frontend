import axios from "axios";
import request from "../utils/httpRequest";

export const swapAPI = async (
  tokenAddress: string,
  chainId: string | string[],
  nftAddress: string,
  idNFT: string
) => {
  try {
    const res = await request.get(
      `swap?chainId=${chainId}&nftAddress=${nftAddress}&tokenAddress=${tokenAddress}&id=${idNFT}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
