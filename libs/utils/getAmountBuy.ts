import abiRouter from "@/abi/abiRouter.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getAmountBuy = async (
  wallet: string,
  tokenAddress: string,
  nftAddress: string,
  idNFT: string,
  amountNFT: string
) => {
  const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai-bor.publicnode.com');
  const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
  const contract = new ethers.Contract(routerAddress, abiRouter, provider);
  try {
    const amountAFee = await contract.getAmountBuy(tokenAddress,nftAddress,idNFT,amountNFT);
    return amountAFee[0].toString()
  } catch (error) {
    console.error(error);
  }
};
export default getAmountBuy;
