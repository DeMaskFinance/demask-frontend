import { ethers } from "ethers";
import abiDML from "@/abi/abiDML.json";
import { getProvider } from "../connection/getProvider";
const viewReward = async (
  dmlToken: string,
  account: string,
  wallet: string
) => {
  if (dmlToken && account && wallet) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(dmlToken, abiDML, signer);
    console.log(contract);

    try {
      const result = await contract.viewReward(account);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
export default viewReward;
