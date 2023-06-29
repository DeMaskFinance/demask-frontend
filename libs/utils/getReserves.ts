import abiErc20 from "@/abi/abiErc20.json";

import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getReserves = async (dmlToken: string) => {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
  const contract = new ethers.Contract(dmlToken, abiErc20, provider);
  try {
    const reserves = await contract.getReserves();
    return reserves;
  } catch (error) {
    console.error(error);
  }
};
export default getReserves;
