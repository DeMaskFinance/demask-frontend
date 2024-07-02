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
const collectionListAllERC = async (
  type: string,
  contractAddress: string | string[],
  chainId: string | string[],
  page: number,
  limit: number
) => {
  try {
    const res = await request.get(
      `all-nft-list-from-collection?chainId=${chainId}&type=${type}&contractAddress=${contractAddress}&page=${page}&limit=${limit}`
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
const topCollectionService = async (chainId: string | string[]) => {
  try {
    const res = await request.get(
      `top-collection-list?chainId=${chainId}&sortField=TVL&sortOrder=asc&page=1&limit=4`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const createCollection = async (
  nonce: string,
  body: {
    category: string[];
  }
) => {
  try {
    const res = await request.post(
      `add-collection-category?nonce=${nonce}`,
      body
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const collectionTypeCategory = async (
  label: string,
  chainId: string | string[],
  page: number,
  limit: number
) => {
  try {
    const res = await request.get(
      `items/${label}?chainId=${chainId}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

const collectionListBuy = async (
  contractAddress: string | string[],
  chainId: string | string[]
) => {
  try {
    const res = await request.get(
      `NFT-list-from-collection?type=erc721&contractAddress=${contractAddress}&chainId=${chainId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const fetchDataBuyNFTs = async (
  collectionAddress: string,
  chain: string | string[]
) => {
  const data = await collectionListBuy(collectionAddress, chain);
  return data.data;
};
const collectionListSell = async (
  userAddress: string,
  contractAddress: string | string[],
  chainId: string | string[]
) => {
  try {
    const res = await request.get(
      `NFT-list-from-collection?type=erc721&contractAddress=${contractAddress}&userAddress=${userAddress}&chainId=${chainId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const fetchDataSellNFTs = async (
  collectionAddress: string,
  chain: string | string[],
  account: string
) => {
  const data = await collectionListSell(account, collectionAddress, chain);
  return data.data;
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
  collectionAddress: string,
  chainID: string
) => {
  try {
    const res = await request.patch(
      `edit-collection?contractAddress=${collectionAddress}&chainId=${chainID}`,
      body
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const uploadFileCollection = async (params: any) => {
  try {
    const formData = new FormData();
    if (params.avatar) {
      formData.append("avatar", params.avatar);
    }

    if (params.banner) {
      formData.append("banner", params.banner);
    }
    if (params.featureImage) {
      formData.append("featureImage", params.featureImage);
    }
    const res = await request.postForm(
      `upload-collection?chainId=${params.chainId}&contractAddress=${params.collectionAddress}`,
      formData
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const collectionListUser = async (
  account: string,
  chainId: string | string[]
) => {
  try {
    const res = await request.get(
      `get-owner-collection?chainId=${chainId}&userAddress=${account}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const getSignature = async (
  dmlAddress: string,
  creatorEarning: string,
  royalty: number,
  chainId: string | string[],
  blockTime: number
) => {
  try {
    const res = await request.get(
      `signature?chainId=${chainId}&dmlAddress=${dmlAddress}&royaltyReceive=${creatorEarning}&royaltyPercent=${royalty}&blockTime=${blockTime}`
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
  updateCollection,
  uploadFileCollection,
  collectionListUser,
  fetchDataSellNFTs,
  fetchDataBuyNFTs,
  getSignature,
  collectionTypeCategory,
  createCollection,
  collectionListAllERC,
  topCollectionService,
};
