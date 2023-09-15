import  abiDML  from '@/abi/abiDML.json';
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const allowanceDML = async (
  account: string,
  wallet: string,
  dmlAddress: string,
  routerAddress:string,
) => {
  if (account && dmlAddress && wallet) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(dmlAddress, abiDML, signer);
    try {
        const dmlAllowance = await contract.allowance(account, routerAddress);
        const currentAllowance = dmlAllowance.toString();
        console.log(currentAllowance);
        
        return currentAllowance;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("No account");
    return false;
  }
};
export default allowanceDML;
