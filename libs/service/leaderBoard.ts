import request from "../utils/httpRequest";

const leaderBoardAPI = async (
  chainId: string | string[],
  page: number,
  account: string
) => {
  try {
    const res = await request.get(
      `top-point-list?userAddress=${account}&chainId=${chainId}&seasonNumber=0&page=${page}&limit=10`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export { leaderBoardAPI };
