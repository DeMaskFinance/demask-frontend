import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import  abiDML  from '@/abi/abiDML.json';
const useAllowanceDML = (account: string, dmlAddress: string, wallet: string,isApprovedDML:boolean,inputLiquidity:string) => {
  const [currentAllowance, setCurrentAllowance] = useState<string | null>(null);
  // console.log(account,dmlAddress,wallet,isApprovedDML);
  useEffect(() => {
    const getAllowance = async () => {
      if (account && dmlAddress && wallet ) {
        // console.log(account,dmlAddress,wallet,isApprovedDML);
        
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai-bor.publicnode.com');
        const contract = new ethers.Contract(dmlAddress, abiDML, provider);
        const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
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
  }, [account, dmlAddress, wallet,isApprovedDML,inputLiquidity]);

  return currentAllowance;
};
export default useAllowanceDML;