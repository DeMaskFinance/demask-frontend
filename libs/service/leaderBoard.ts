import request from "../utils/httpRequest";

const leaderBoardAPI = async (chainId: string | string[], page: number) => {
  try {
    const res = await request.get(
      `volume-user-list?chainId=${chainId}&page=${page}&limit=10`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export { leaderBoardAPI };
