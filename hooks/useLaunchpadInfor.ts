import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
const useLaunchpadInfor = (
  account: string,
  launchpadAddress: string,
  wallet: string,
  isOpenTransaction?: boolean
) => {
  const [dml, setDML] = useState("");
  const [balance, setBalance] = useState("");
  const [release, setRelease] = useState("");
  // const [totalSoldout, setTotalSoldout] = useState("");
  useEffect(() => {
    const getDmlLaunchpad = async () => {
      if (launchpadAddress && account && wallet) {
        try {
          const providerChoice = await getProvider(wallet);
          const provider = new ethers.providers.Web3Provider(providerChoice);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            launchpadAddress,
            abiLaunchPad,
            signer
          );
          console.log(contract);
          
          // const result = await contract.dml();
          // const totalSoldout = await contract.totalSoldout();
          // setDML(result);
          const balanceOf = await contract.balanceOf(account); 
          setBalance(balanceOf);
          const releaseable = await contract.releasable(account);
          console.log({
            account,
            launchpadAddress,
            wallet,
            balanceOf,
            releaseable
          });
          setRelease(releaseable);
          // setTotalSoldout(totalSoldout.toString());
        } catch (error) {
          console.error(error);
        }
      } else {
        setDML("");
      }
    };
    getDmlLaunchpad();
  }, [launchpadAddress, account, isOpenTransaction, wallet]);
  return { dml, balance, release };
};
export default useLaunchpadInfor;
