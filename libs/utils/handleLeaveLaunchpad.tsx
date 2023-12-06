import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";
import { exponentialToDecimal } from "./convertExponential";
import { toast } from "react-toastify";
import TransitionURL from "@/components/Toast/TransionURL";

const handleLeaveLaunchPad = async (
  account: string,
  wallet: string,
  inputLeave: number,
  routerAddress: string,
  setIsOpen: any,
  setIsOpenTransaction: any,
  refetch: any
) => {
  if (account) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(routerAddress, abiLaunchPad, signer);
    try {
      const result = await contract.leave(inputLeave.toString(), {
        gasLimit: 8000000,
      });
      setIsOpenTransaction(true);
      setIsOpen(false);

      const check = await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
      refetch();
      if(check.status){
        toast.success(
          <TransitionURL
            type={"Refund launchpad success"}
            transactionHash={result.hash}
          />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }else{
        toast.error(
          <TransitionURL
            type={"Failed transaction"}
            transactionHash={result.hash}
          />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    setIsOpenTransaction(false);
    setIsOpen(true);
  }
};
export default handleLeaveLaunchPad;
