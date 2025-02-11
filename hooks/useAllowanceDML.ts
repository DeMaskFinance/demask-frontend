import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abiDML from "@/abi/abiDML.json";
const useAllowanceDML = (
  account: string,
  dmlAddress: string,
  wallet: string,
  isApprovedDML: boolean,
  inputLiquidity: string,
  routerAddress: string
) => {
  const [currentAllowance, setCurrentAllowance] = useState<string | null>(null);
  useEffect(() => {
    const getAllowance = async () => {
      console.log(account && dmlAddress && wallet);
      if (account && dmlAddress && wallet) {
        console.log(123);
        const providerChoice = await getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(dmlAddress, abiDML, signer);
        try {
          const dmlAllowance = await contract.allowance(account, routerAddress);
          const allowanceValue = dmlAllowance.toString();
          setCurrentAllowance(allowanceValue);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No account");
      }
    };

    getAllowance();
  }, [account, dmlAddress, wallet, isApprovedDML, inputLiquidity]);

  return currentAllowance;
};
export default useAllowanceDML;
