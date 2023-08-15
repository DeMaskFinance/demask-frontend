import { ethers } from "ethers";
import abiDML from "@/abi/abiDML.json";
const viewReward = async (dmlToken: string, account: string) => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai-bor.publicnode.com"
  );
  if (dmlToken) {
    const contract = new ethers.Contract(dmlToken, abiDML, provider);
    try {
      const result = await contract.viewReward(account);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
};
export default viewReward;
