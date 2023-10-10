import request from "../utils/httpRequest";

export const categoryAPI = async (url: any) => {
  try {
    const res = await request.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
