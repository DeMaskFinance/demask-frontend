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
  try {
    const res = await request.get(
      `refresh-metadata?chainId=${chainId}&nftAddress=${nftAddress}&nftID=${nftID}&type=${type}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const getMetadata = async (
  chainId: string | string[],
  nftAddress: string,
  nftID: string,
  tokenAddress: string,
  version: string
) => {
  try {
    const res = await request.get(
      `metadata?chainId=${chainId}&nftAddress=${nftAddress}&id=${nftID}&tokenAddress=${tokenAddress}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

const getInfoPool = async ({
  chainId,
  nftAddress,
  type,
  nftID,
}: {
  chainId: string | string[];
  nftAddress: string;
  type: string;
  nftID: string;
}) => {
  try {
    const res = await request.get(
      `pool-list-from-address?chainId=${chainId}&type=${type}&contractAddress=${nftAddress}&nftID=${nftID}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export { NFTTopService, refreshNFTService, getMetadata, getInfoPool };
