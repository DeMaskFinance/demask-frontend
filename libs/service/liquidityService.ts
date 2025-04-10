import request from "../utils/httpRequest";

const liquidityUserListAPI = async (
  accountUser: string,
  page: number,
  type: string,
  chainId: string | string[],
  version: string
) => {
  try {
    const res = await request.get(
      `liquidity-list?chainId=${chainId}&userAddress=${accountUser.toLowerCase()}&type=${type}&version=${version}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const liquidityListAPI = async (
  page: number,
  type: string,
  chainId: string | string[],
  version: string
) => {
  try {
    const res = await request.get(
      `all-pool-list?chainId=${chainId}&type=${type}&page=${page}&version=${version}&limit=20`
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
  chainId: string | string[],
  action: string
) => {
  try {
    const res = await request.get(
      `liquidity-history?chainId=${chainId}&userAddress=${accountUser.toLocaleLowerCase()}&dmlAddress=${dmlToken.toLocaleLowerCase()}&page=${page}&action=${action}`
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
const poolUserInfor = async (
  chainId: string | string[],
  accountUser: string,
  version: string
) => {
  try {
    const res = await request.get(
      `user-total-pool-info?chainId=${chainId}&userAddress=${accountUser}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const liquidityUserERC721 = async (
  collectionAddress: string,
  tokenAddress: string,
  chainId: string | string[]
) => {
  try {
    const res = await request.get(
      `pool-info?chainId=${chainId}&tokenAddress=${tokenAddress}&type=erc721&collectionAddress=${collectionAddress}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export {
  liquidityUserListAPI,
  liquidityHistory,
  liquidityUser,
  liquidityUserERC721,
  liquidityListAPI,
  poolUserInfor,
};
