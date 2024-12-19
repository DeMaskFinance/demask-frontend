import utilsStarknet from "@/utils/utils.starknet";
import { useEffect, useState } from "react";
const useAllowanceDML = (
  account: string,
  dmlAddress: string,
  wallet: string,
  isApprovedDML: boolean,
  routerAddress?: string
) => {
  const [currentAllowance, setCurrentAllowance] = useState<string | null>(null);
  useEffect(() => {
    const getAllowance = async () => {
      if (account && dmlAddress) {
        try {
          const balanceApprove = await utilsStarknet.getAllowance({
            account: account,
            contractAddress: dmlAddress,
            target: routerAddress || "",
          });

          setCurrentAllowance(balanceApprove.toString());
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No account");
      }
    };

    getAllowance();
  }, [account, dmlAddress, wallet, isApprovedDML]);

  return currentAllowance;
};
export default useAllowanceDML;
