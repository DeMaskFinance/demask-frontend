import abiErc20 from "@/abi/abiErc20.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const approveToken = async (
  account: string,
  wallet: string,
  tokenAddress: string
) => {
  if (account) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
    const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
    try {
      const tokenAllowance = await contract.allowance(account, routerAddress);
      const currentAllowance = tokenAllowance.toString();
      console.log(currentAllowance);
      
      return currentAllowance;
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    console.log("No account");
    return false;
  }
};
export default approveToken;
