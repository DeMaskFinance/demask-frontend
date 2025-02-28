import request from "../util/httpRequest";

export const staticInfo = async () => {
  try {
    const res = await request.get(`total?chainId=10143`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
