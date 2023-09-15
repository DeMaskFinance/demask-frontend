import { ethers } from "ethers";
import abiDML from "@/abi/abiDML.json";
import { getProvider } from "../connection/getProvider";
const viewReward = async (
  dmlToken: string,
  account: string,
  wallet: string
) => {
  const providerChoice = getProvider(wallet);
  const provider = new ethers.providers.Web3Provider(providerChoice);
  const signer = provider.getSigner();
  if (dmlToken) {
    const contract = new ethers.Contract(dmlToken, abiDML, signer);
    console.log(contract);

    try {
      console.log("test");

      const result = await contract.viewReward(account);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
export default viewReward;
