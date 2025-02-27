import abiDML from "@/abi/abiDML.json";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { wagmiAdapter } from "@/config";

type Address = `0x${string}` | any;

const useAllowanceDML = (
  account: Address,
  dmlAddress: Address,
  wallet: Address,
  isApprovedDML: boolean,
  inputLiquidity: string,
  routerAddress: Address
) => {
  const [currentAllowance, setCurrentAllowance] = useState<string | null>(null);

  const { data: allowance, error } = useReadContract({
    account,
    abi: abiDML,
    address: dmlAddress,
    functionName: "allowance",
    args: [account, routerAddress],
  });

  useEffect(() => {
    if (allowance) {
      setCurrentAllowance(allowance.toString());
    }
    if (error) {
      console.error("Error fetching allowance:", error);
    }
  }, [allowance, error]);

  return currentAllowance;
};

export default useAllowanceDML;
