import  abiRouter721  from '@/abi/erc721/abiRouter.json';
import abiRouter from "@/abi/abiRouter.json";
import { ethers } from "ethers";

const getAmountSell = async (
  wallet: string,
  tokenAddress: string,
  nftAddress: string,
  idNFT: string | number[],
  amountNFT: string,
  rpc:string,
  routerAddress:string,
) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(routerAddress, abiRouter, provider);
  try {
    let amountAFee;
    if (amountNFT) {
      amountAFee = await contract.getAmountSell(
        tokenAddress,
        nftAddress,
        idNFT,
        amountNFT
      );
    } else {
      const contract721 = new ethers.Contract(routerAddress, abiRouter721, provider);
      amountAFee = await contract721.getAmountSell(
        tokenAddress,
        nftAddress,
        idNFT,
      );
    }
    return amountAFee;
  } catch (error) {
    console.error(error);
  }
};
export default getAmountSell;