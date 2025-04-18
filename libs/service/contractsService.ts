import request from "../utils/httpRequest";
const contractService = async (chainId: string | string[], version: string) => {
  try {
    const res = await request.get(
      `contract?chainId=${chainId}&version=${version}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

const getPaymentTokens = async (chainId: string | string[]) => {
  try {
    const res = await request.get(`payment-token?chainId=${chainId}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export { contractService, getPaymentTokens };
