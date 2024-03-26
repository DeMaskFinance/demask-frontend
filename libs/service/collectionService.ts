import request from "../utils/httpRequest";

const collectionListERC1155 = async (
  type: string,
  contractAddress: string | string[],
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
  chainId: string | string[]
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
const collectionListBuy = async (
  contractAddress: string | string[],
  chainId: string | string[],
  page: number,
  limit: number
) => {
  try {
    const res = await request.get(
      `NFT-list-from-collection?type=erc721&contractAddress=${contractAddress}&chainId=${chainId}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const collectionListSell = async (
  userAddress: string,
  contractAddress: string | string[],
  chainId: string | string[],
  page: number,
  limit: number
) => {
  try {
    const res = await request.get(
      `NFT-list-from-collection?type=erc721&contractAddress=${contractAddress}&userAddress=${userAddress}&chainId=${chainId}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const collectionListUserService = async (
  account: string,
  chainId: string | string[],
  type: string,
  category: string,
  search: string,
  page: number,
  limit: number
) => {
  try {
    const res = await request.get(
      `NFT-collection-list?userAddress=${account}&chainId=${chainId}&type=${type}&category=${category}&search=${search}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const updateCollection = async (
  body: CollectionInterface,
  collectionAddress: string
) => {
  try {
    const res = await request.patch(
      `edit-collection?contractAddress=${collectionAddress}`,
      body
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export {
  collectionDetail,
  collectionListERC1155,
  collectionListBuy,
  collectionListSell,
  collectionListUserService,
  updateCollection
};
