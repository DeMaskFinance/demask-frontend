import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abiDML from "@/abi/abiDML.json";
import utilsStarknet, { getProviders } from "@/utils/utils.starknet";
const useAllowanceDML = (
  account: string,
  dmlAddress: string,
  wallet: string,
  providers: any,
  isApprovedDML: boolean,
  inputLiquidity: string,
  routerAddress: string
) => {
  const [currentAllowance, setCurrentAllowance] = useState<string | null>(null);
  useEffect(() => {
    const getAllowance = async () => {
      if (account && dmlAddress) {
        // const providerChoice = await getProviders(wallet, providers);
        // const provider = new ethers.providers.Web3Provider(providerChoice);
        // const signer = provider.getSigner();
        // const contract = new ethers.Contract(dmlAddress, abiDML, signer);
        try {
          const balanceApprove = await utilsStarknet.getAllowance({
            account: account,
            contractAddress: dmlAddress,
            target: routerAddress,
          });

          // const dmlAllowance = await contract.allowance(account, routerAddress);
          // const allowanceValue = dmlAllowance.toString();
          setCurrentAllowance(balanceApprove.toString());
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
