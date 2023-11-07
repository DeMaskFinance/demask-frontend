import request from "../utils/httpRequest";

export const LaunchPadAPI = async (
  tokenAddress: string,
  nftAddress: string,
  idNFT: string,
  chainId:string,
  account?: string
) => {
  try {
    const res = await request.get(
      `launchpad-detail?chainId=${chainId}&id=${idNFT}&nftAddress=${nftAddress}&tokenAddress=${tokenAddress}&userAddress=${account}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
