import abiErc20 from "@/abi/abiErc20.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";
import { exponentialToDecimal } from "./convertExponential";

const handleApproveToken = async (
  account: string,
  wallet: string,
  tokenAddress: string,
  amountErcDesired: number,
  routerAddress: string,
  setIsOpen: any,
  setIsOpenTransaction: any
) => {
  if (account) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
    try {
      const result = await contract.approve(routerAddress, exponentialToDecimal(amountErcDesired));
      setIsOpenTransaction(true);
      await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
    } catch (error) {
      console.error(error);
    }
  } else {
    setIsOpenTransaction(false);
    setIsOpen(true);
  }
};
export default handleApproveToken;
