import request from "../utils/httpRequest";

export const nftsUserService = async (
  account: string,
  chainId:string|string[],
  page: number
) => {
  try {
    const res = await request.get(
      `profile/${account}?chainId=${chainId}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
