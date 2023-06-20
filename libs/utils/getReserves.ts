import abiErc20 from "@/abi/abiErc20.json";

import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getReserves = async (dmlToken: string, wallet: string) => {
  const providerChoice = getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(dmlToken, abiErc20, signer);
  try {
    const reserves = await contract.getReserves();
    return reserves;
  } catch (error) {
    console.error(error);
  }
};
export default getReserves;
