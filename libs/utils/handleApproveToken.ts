import abiErc20 from "@/abi/abiErc20.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const handleApproveToken = async (
  account: string,
  wallet: string,
  tokenAddress: string,
  inputToken: string,
  routerAddress: string,
  setIsOpen: any,
  setCheckApproveToken: any
) => {
  if (account) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
    try {
      const result = await contract.approve(routerAddress, inputToken);
      await provider.waitForTransaction(result.hash);
      setCheckApproveToken(true);
    } catch (error) {
      console.error(error);
    }
  } else {
    setCheckApproveToken(false);
    setIsOpen(true);
  }
};
export default handleApproveToken;
