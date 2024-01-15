import request from "../utils/httpRequest";

const getNonce = async (account: string) => {
  try {
    const res = await request.get(`user/nonce?userAddress=${account}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

const loginAuthen = async (body: any) => {
  try {
    const res = await request.post(`authentication`, body);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

const profileInfor = async () => {
  try {
    const res = await request.get(`user/user-info`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const updateUserInfor = async (body: UserInterface) => {
  try {
    const res = await request.patch(`user/user-info`, body);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const uploadFile = async (params: any) => {
  try {
    const formData = new FormData();
    if (params.avatar) {
      formData.append("avatar", params.avatar);
    }
    if (params.cover) {
      formData.append("cover", params.cover);
    }
    const res = await request.post("upload", formData);
    return res.data;
  } catch (error) {}
};
export { getNonce, loginAuthen, profileInfor, updateUserInfor, uploadFile };
