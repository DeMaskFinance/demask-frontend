import  abiErc1155  from '@/abi/abiErc1155.json';
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getBalanceNFT = async (account:string,nftAddress:string,idNFT:string) => {
    if (account) {
      const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai-bor.publicnode.com');
      const contract = new ethers.Contract(nftAddress, abiErc1155, provider);
      try {
        const bigNumberBalance = await contract.balanceOf(account, idNFT.toString());
        const balance = bigNumberBalance.toString();
        return balance;
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No account");
    }
  };
  export default getBalanceNFT;