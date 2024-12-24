import request from "../utils/httpRequest";
import { uploadToIpfs } from "./IPFSService";

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

const getStarknetMessage = async (account: string, chainStarknet: string) => {
  try {
    const res = await request.get(
      `user/starknet-message?chainId=${chainStarknet}&userAddress=${account}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
const authenStarknet = async (chainStarknet: string, body: any) => {
  try {
    const res = await request.post(
      `authentication/starknet?chainId=${chainStarknet}`,
      body
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export {
  getNonce,
  loginAuthen,
  profileInfor,
  updateUserInfor,
  getStarknetMessage,
  authenStarknet,
};
