import abiLaunchPad from "@/abi/abiLaunchPad.json";
import TransitionURL from "@/components/Toast/TransionURL";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getProvider } from "../connection/getProvider";
import { useState } from "react";

const handleAddAdmin = async (
  account: string,
  wallet: string,
  adminAddresses: any,
  statuses: any,
  addresses: any,
  routerAddress: string,
  setIsOpen: any,
  setIsOpenTransaction: any
) => {
  if (account) {
    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(routerAddress, abiLaunchPad, signer);
    console.log(statuses, addresses);
    try {
      console.log("ok");
      const result = await contract.addAdmin(addresses, statuses, {
        gasLimit: 8000000,
      });
      setIsOpenTransaction(true);
      await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
      setIsOpen(false);
      toast.success(
        <TransitionURL
          type={"Release launchpad"}
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
    } catch (error) {
      console.error(error);
    }
  } else {
    setIsOpenTransaction(false);
    setIsOpen(true);
  }
};
export default handleAddAdmin;
