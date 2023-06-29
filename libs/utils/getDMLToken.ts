import  abiFactory  from '@/abi/abiFactory.json';
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getDMLToken = async (nftAddress:string,idNFT:string,tokenAddress:string) => {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
    const factoryAddress = process.env.NEXT_PUBLIC_FACTORY || "";
    const contract = new ethers.Contract(factoryAddress, abiFactory, provider);
    try {
      const result = await contract.getDmlToken(tokenAddress,nftAddress,idNFT);
      return result;
      
    } catch (error) {
      console.error(error);
    }
  };
export default getDMLToken;