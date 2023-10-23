import request from "../utils/httpRequest";

const nftsUserService = async (
  account: string,
  chainId: string | string[],
  page: number
) => {
  try {
    const res = await request.get(
      `userInventory?userAddress=${account}&chainId=${chainId}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const poolsUserService = async (
  account: string,
  chainId: string | string[],
  page: number
) => {
  try {
    const res = await request.get(
      `userPool?chainId=${chainId}&userAddress=${account}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const historyUserService = async (
  account: string,
  chainId: string | string[],
  page: number
) => {
  try {
    const res = await request.get(
      `userHistory?userAddress=${account}&chainId=${chainId}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export { nftsUserService, poolsUserService, historyUserService };
