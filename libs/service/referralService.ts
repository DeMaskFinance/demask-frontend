import request from "../utils/httpRequest";

const referralInfor = async (account: string) => {
  try {
    const res = await request.get(`referral-info?userAddress=${account}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const referralApply = async (account: string, code: string) => {
  try {
    const res = await request.post(
      `apply-ref?userAddress=${account}&referralCode=${code}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const referralHistoryUser = async (
  account: string,
  chain: string,
  page: number
) => {
  try {
    const res = await request.get(
      `user-point-history-list?chainId=${chain}&userAddress=${account}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const referralPointUser = async (
  account: string,
  chain: string,
  page: number
) => {
  try {
    const res = await request.get(
      `user-point?userAddress=${account}&chainId=${chain}&page=${page}&seasonNumber=`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const referralTopUser = async (account: string, chain: string) => {
  try {
    const res = await request.get(
      `top-point-referral-code-list?chainId=${chain}&userAddress=${account}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const referralLeaderboardUser = async (account: string, page: number) => {
  try {
    const res = await request.get(
      `top-referral-code-list?userAddress=${account}&page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const referralStaticUser = async (account: string, chain: string) => {
  try {
    const res = await request.get(
      `user-referral-stats?userAddress=${account}&seasonNumber=0&chainId=${chain}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export {
  referralInfor,
  referralApply,
  referralHistoryUser,
  referralPointUser,
  referralTopUser,
  referralLeaderboardUser,
  referralStaticUser,
};
