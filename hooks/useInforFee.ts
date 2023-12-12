import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useInforFee = (account: string, wallet: string): {tip: string, gasUse: string} => {
  const [tip, setTip] = useState<string>("");
  const [gasUse, setGasUse] = useState<string>("");

  useEffect(() => {
    const fetchInformationFee = async () => {
      if (account && wallet) {
        try {
          const providerChoice = getProvider(wallet);
          const provider = new ethers.providers.Web3Provider(providerChoice);
          const feeData = await provider.getFeeData();
          setTip(feeData?.maxPriorityFeePerGas?.toString() || "");
          setGasUse(feeData?.gasPrice?.toString() || "");
        } catch (error: any) {
          console.error(error);
        }
      } else {
        setTip("0"); // No Account
        setGasUse("0");
      }
    };

    fetchInformationFee();
  }, [account, wallet]);

  return {tip, gasUse};
};

export default useInforFee;