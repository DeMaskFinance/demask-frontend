import abiErc20 from "@/abi/abiErc20.json";

import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getInforDML = async (dmlToken: string) => {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
  const contract = new ethers.Contract(dmlToken, abiErc20, provider);
  try {
    const reserves = await contract.getReserves();
    const decimals = await contract.decimals();
    const idNFT = await contract.id();
    const nftAddress = await contract.nft();
    const reserveNFT = await contract.reservenft();
    const reserveToken = await contract.reservetoken();
    const tokenAddress = await contract.token();
    return {reserves,decimals,idNFT,nftAddress,reserveNFT,reserveToken,tokenAddress};
  } catch (error) {
    console.error(error);
  }
};
export default getInforDML;
