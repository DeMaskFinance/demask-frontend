import request from "../util/httpRequest";

export const staticInfo = async () => {
  try {
    const res = await request.get(`total?chainId=0x534e5f5345504f4c4941`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
