import abiDML from "@/abi/abiDML.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const getTotalSupply = async (
  account: string,
  wallet: string,
  dmlAddress: string
) => {
  if (account && dmlAddress && wallet) {
    const providerChoice = await getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(dmlAddress, abiDML, signer);
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
