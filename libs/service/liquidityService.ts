import request from "../utils/httpRequest";

const liquidityListAPI = async (
  accountUser: string,
  page: number,
  type: string,
  chainId: string | string[]
) => {
  try {
    const res = await request.get(
      `liquidity-list?chainId=${chainId}&userAddress=${accountUser.toLowerCase()}&type=${type}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const liquidityHistory = async (
  accountUser: string,
  dmlToken: string,
  page: number,
  chainId: string | string[]
) => {
  try {
    const res = await request.get(
      `liquidity-history?chainId=${chainId}&userAddress=${accountUser.toLocaleLowerCase()}&dmlAddress=${dmlToken.toLocaleLowerCase()}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const liquidityUser = async (
  accountUser: string,
  page: number,
  chainId: string | string[]
) => {
  try {
    const res = await request.get(
      `pool?chainId=${chainId}&userAddress=${accountUser.toLowerCase()}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const liquidityUserERC721 = async (
  collectionAddress: string,
  chainId: string | string[]
) => {
  try {
    const res = await request.get(
      `pool-info?chainId=${chainId}&type=erc721&collectionAddress=${collectionAddress}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export {
  liquidityListAPI,
  liquidityHistory,
  liquidityUser,
  liquidityUserERC721,
};
