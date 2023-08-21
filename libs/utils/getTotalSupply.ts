import abiDML from "@/abi/abiDML.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getTotalSupply = async (
  account: string,
  wallet: string,
  dmlAddress: string
) => {
  if (account && dmlAddress && wallet) {
    console.log(account,dmlAddress,wallet);
    
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai-bor.publicnode.com"
    );
    const contract = new ethers.Contract(dmlAddress, abiDML, provider);
    const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
    try {
      const currentTotalSupply = await contract.totalSupply();
      const totalSupply = currentTotalSupply.toString();
      return totalSupply;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("No account");
    return false;
  }
};
export default getTotalSupply;
