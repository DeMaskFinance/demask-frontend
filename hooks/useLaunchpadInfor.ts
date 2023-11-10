import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abiLaunchPad from "@/abi/abiLaunchPad.json";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { getProvider } from "@/libs/connection/getProvider";
const useLaunchpadInfor = (
  account: string,
  launchpadAddress: string,
  wallet: string,
  isOpenTransaction?: boolean
) => {
  const [dml, setDML] = useState("");
  // const [totalSoldout, setTotalSoldout] = useState("");
  useEffect(() => {
    const getDmlLaunchpad = async () => {
      if (launchpadAddress && account && wallet) {
        try {
          const providerChoice = getProvider(wallet);
          const provider = new ethers.providers.Web3Provider(providerChoice);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(launchpadAddress, abiLaunchPad, signer);
          const result = await contract.dml();
          const totalSoldout = await contract.totalSoldout();
          setDML(result);
          // setTotalSoldout(totalSoldout.toString());
        } catch (error) {
          console.error(error);
        }
      } else {
        setDML('');
      }
    };
    getDmlLaunchpad();
  }, [launchpadAddress, account, isOpenTransaction, wallet]);
  return { dml };
};
export default useLaunchpadInfor;
