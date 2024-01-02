import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const handleReleaseLaunchPad = async (
  account: string,
  wallet: string,
  routerAddress: string,
  setIsOpen: any,
  setIsOpenTransaction: any,
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>,
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setHash: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (account) {
    const providerChoice = await getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(routerAddress, abiLaunchPad, signer);
    try {
      const gasLimit = await contract.estimateGas.balanceOf(account);
      console.log(gasLimit.toString());

      const result = await contract.release({ gasLimit });
      setIsOpenTransaction(true);
      setHash(result.hash);
      const check = await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
      setIsOpen(false);
      
      if (check.status === 1) {
        setIsOpenSuccess(true);
      } else {
        setIsOpenError(true);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    setIsOpenTransaction(false);
    setIsOpen(true);
  }
};
export default handleReleaseLaunchPad;
