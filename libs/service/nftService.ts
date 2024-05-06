import request from "../utils/httpRequest";

const NFTTopService = async (chainId: string | string[]) => {
  try {
    const res = await request.get(`topNFT-list?chainId=${chainId}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const refreshNFTService = async (
  chainId: string | string[],
  nftAddress: string,
  nftID: string,
  type: string
) => {
  console.log({
    type,
    chainId,
    nftAddress,
    nftID,
  });
  try {
    const res = await request.get(
      `refresh-metadata?chainId=${chainId}&nftAddress=${nftAddress}&nftID=${nftID}&type=${type}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export { NFTTopService, refreshNFTService };
