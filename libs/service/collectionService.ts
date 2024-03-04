import request from "../utils/httpRequest";

const collectionListERC1155 = async (
  type: string,
  contractAddress: string,
  chainId: string | string[],
  page: number,
  limit: number
) => {
  try {
    const res = await request.get(
      `NFT-list-from-collection?type=${type}&contractAddress=${contractAddress}&chainId=${chainId}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const collectionDetail = async (
  contractAddress: string | string[],
  chainId: string | string[],
) => {
  try {
    const res = await request.get(
      `NFT-collection/${contractAddress}?chainId=${chainId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export { collectionDetail, collectionListERC1155 };
