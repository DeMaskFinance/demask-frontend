import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";

const handleLeaveLaunchPad = async (
  account: string,
  wallet: string,
  inputLeave: number,
  routerAddress: string,
  setIsOpen: any,
  setIsOpenTransaction: any,
  refetch: any,
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
      const result = await contract.leave(inputLeave.toString(), {
        gasLimit: 8000000,
      });
      setIsOpenTransaction(true);
      setIsOpen(false);
      setHash(result.hash)
      const check = await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
      if (check.status === 1) {
        setIsOpenSuccess(true);
      } else {
        setIsOpenError(true);
      }
      refetch();
    } catch (error) {
      console.error(error);
    }
  } else {
    setIsOpenTransaction(false);
    setIsOpen(true);
  }
};
export default handleLeaveLaunchPad;
