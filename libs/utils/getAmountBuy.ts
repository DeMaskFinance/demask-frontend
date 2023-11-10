import abiRouter from "@/abi/abiRouter.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getAmountBuy = async (
  wallet: string,
  tokenAddress: string,
  nftAddress: string,
  idNFT: string,
  amountNFT: string,
  rpc:string,
  routerAddress:string,
) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(routerAddress, abiRouter, provider);
  try {
    const amountAFee = await contract.getAmountBuy(tokenAddress,nftAddress,idNFT,amountNFT);
    console.log(amountAFee);
    
    return amountAFee;
  } catch (error) {
    console.error(error);
  }
};
export default getAmountBuy;
