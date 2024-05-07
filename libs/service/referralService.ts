import request from "../utils/httpRequest";

const referralInfor = async (account: string) => {
  try {
    const res = await request.get(`referral-info?userAddress=${account}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export { referralInfor };
