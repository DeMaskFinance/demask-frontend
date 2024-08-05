import request from "../utils/httpRequest";

export const categoryAPI = async (url: string) => {
  try {
    const res = await request.get(url);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
