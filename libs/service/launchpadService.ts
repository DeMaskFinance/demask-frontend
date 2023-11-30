import request from "../utils/httpRequest";

export const LaunchPadAPI = async (
  tokenAddress: string,
  chainId:string,
  account:string,
) => {
  try {
    console.log({
      tokenAddress,
      chainId,
    });
    
    const res = await request.get(
      `launchpad-detail?chainId=${chainId}&launchpad=${tokenAddress}&userAddress=${account}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
