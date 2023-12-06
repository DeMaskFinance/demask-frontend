import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { ethers } from "ethers";
import { getProvider } from "../connection/getProvider";
import { exponentialToDecimal } from "./convertExponential";
import TransitionURL from "@/components/Toast/TransionURL";
import { toast } from "react-toastify";

const handleReleaseLaunchPad = async (
  account: string,
  wallet: string,
  routerAddress: string,
  setIsOpen: any,
  setIsOpenTransaction: any
) => {
  if (account) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(routerAddress, abiLaunchPad, signer);
    try {
      const gasLimit = await contract.estimateGas.balanceOf(account);
      console.log(gasLimit);
      
      const result = await contract.release({ gasLimit });
      setIsOpenTransaction(true);
      const check = await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
      setIsOpen(false);
      if (check.status) {
        toast.success(
          <TransitionURL
            type={"Claim launchpad success"}
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
      } else {
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
export default handleReleaseLaunchPad;
